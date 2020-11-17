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
import { returnUserReview, returnReviews, addUser, validatePassword, findUser } from './database.js';

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
        const foundUser = await findUser(username);
        if (!foundUser) {
            // no such user
            return done(null, false, { 'message': 'Wrong username' });
        }
        const valPass = await validatePassword(username,password);
        if (!valPass) {
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

app.get('/',
    checkLoggedIn,
    (req, res) => {
        res.sendFile('client/index.html', { 'root': __dirname })
    });

// Handle post data from the login.html form.
app.post('/login',
    passport.authenticate('local', { // use username/password authentication
        'successRedirect': '/', // when we login, go to /private 
        'failureRedirect': '/login' // otherwise, back to login
    }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
    (req, res) => res.sendFile('client/login.html', { 'root': __dirname }));

app.post('/register',
    (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        console.log('jo');
        if (addUser(username, password)) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    });

// Register URL
app.get('/register',
    (req, res) => res.sendFile('client/register.html', { 'root': __dirname }));

app.get('/viewUserReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/viewUserReview.html', { 'root': __dirname });
    });

app.post('/viewUserReview',
    post_authenticate,
    function(req, res) {
        res.end(JSON.stringify(returnUserReview(req.user)));
    });

app.get('/leaveReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/leaveReview.html', { 'root': __dirname });
    });
app.post('/leaveReview',
    post_authenticate,
    function(req, res) {
        res.end(JSON.stringify(returnUserReview(req.user)));
    });
app.get('/viewReview',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => { // Go to the user's page.
        res.sendFile('client/viewReview.html', { 'root': __dirname });
    });

app.get('/readReviews', (req, res) => {
    res.end(JSON.stringify(returnReviews()));
    console.log('Main reviews loading...');
});

app.post('/updateReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        console.log('Updated: ' + JSON.stringify(data));
        //update score here through database code updateDatabase(data)
    });
    res.writeHead(202);
    res.end();
});
app.post('/deleteReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        console.log('deleted review with id : ' + data.reviewid);
        //update score here through database code updateDatabase(data)
    });
    res.writeHead(200);
    res.end();
});
app.post('/createReview', post_authenticate, (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        //create score here through database code
        console.log(JSON.stringify(data));
    });
    res.writeHead(201);
    res.end();
});

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