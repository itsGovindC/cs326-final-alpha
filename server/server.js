'use strict';

// For loading environment variables.
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
const __dirname = path.resolve();

import express from 'express'; // express routing
import expressSession from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
const app = express();
const port = process.env.PORT || 8080;
import { returnUserReview, returnReviews, addUser, validatePassword, findUser, insertReview, deleteReview, updateReview } from './database.js';

import { parse } from 'url';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';


// Session configuration

const session = {
    secret: process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
    saveUninitialized: false
};

// Passport configuration

const strategy = new LocalStrategy(
    async(username, password, done) => {
        if (!findUser(username)) {
            // no such user
            return done(null, false, { 'message': 'Wrong username' });
        }
        if (!validatePassword(username, password)) {
            // invalid password
            // should disable logins after N messages
            // delay return to rate-limit brute-force attacks
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { 'message': 'Wrong password' });
        }
        // success!
        // should create a user object here, associated with a unique identifier
        return done(null, username);
    });


// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({ 'extended': true })); // allow URLencoded data

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/login');
    }
}

function post_authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.end('{}');
    }
}
//redirects based on user login, but this is index page
app.get('/',
    checkLoggedIn,
    (req, res) => {
        res.sendFile('client/index.html', { 'root': __dirname });
    });

// Handle post data from the login.html form.
app.post('/login',
    passport.authenticate('local', { // use username/password authentication
        'successRedirect': '/', // when we login, go to /private 
        'failureRedirect': '/login' // otherwise, back to login
    }));
//when user clicks logout button on index page
app.get('/logout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/login'); // back to login
});


// Handle the URL /login (just output the login.html file).
app.get('/login',
    (req, res) => res.sendFile('client/login.html', { 'root': __dirname }));
//endpoint to add user to database
app.post('/register',
    (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (addUser(username, password)) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    });

// Register URL
app.get('/register',
    (req, res) => res.sendFile('client/register.html', { 'root': __dirname }));

//the viewUserReview html page    
app.get('/viewUserReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/viewUserReview.html', { 'root': __dirname });
    });
//endpoint returns data for user reviews
app.post('/viewUserReview',
    post_authenticate,
    async function(req, res) {
        res.end(JSON.stringify(await returnUserReview(req.user)));
    });
//for the html page
app.get('/leaveReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/leaveReview.html', { 'root': __dirname });
    });
//get endpoint for html page
app.get('/viewReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/viewReview.html', { 'root': __dirname });
    });
//post endpoint to return all the reviews for the reviews page
app.post('/readReviews',
    post_authenticate,
    async function(req, res) {
        res.end(JSON.stringify(await returnReviews()));
    });
//post endpoint that receives data about review to update
app.post('/updateReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        console.log('Updated: ' + JSON.stringify(data));
        updateReview(data.id, data.dining, data.dish, data.review);
    });
    res.writeHead(202);
    res.end();
});
//post endpoint that receives data about review to delete
app.post('/deleteReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        console.log('deleted review with id : ' + data.id);
        deleteReview(data.id);
    });
    res.writeHead(200);
    res.end();
});
//endpoint that receives review to insert 
app.post('/createReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);

        insertReview(req.user, data.dining, data.dish, data.review);
        console.log(JSON.stringify(data));
    });
    res.writeHead(201);
    res.end();
});
//endpoint to return all other files
app.get('*', (req, res) => {
    const parsed = parse(req.url, true);
    const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
    const path = join("client/", filename);
    //console.log("trying to serve " + path + "...");
    if (existsSync(path)) {
        if (filename.endsWith("html")) {
            res.writeHead(404);
            res.end();
        } else if (filename.endsWith("css")) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(readFileSync(path));
            res.end();
        } else if (filename.endsWith("js")) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(200);
            res.write(readFileSync(path));
            res.end();
        }

    } else {
        res.writeHead(404);
        res.end();
    }
});
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});