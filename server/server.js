'use strict';
import express from 'express';
import { returnUserReview, returnReviews } from './database.js';

import { parse } from 'url';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

import dotenv from 'dotenv';
dotenv.config()

import expressSession from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const port = process.env.PORT || 8080;
const app = express();

const session = {
    secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
    resave : false,
    saveUninitialized: false
};
// Passport configuration
const strategy = new LocalStrategy(
    async (username, password, done) => {
	if (!findUser(username)) {
	    // no such user
	    return done(null, false, { 'message' : 'Wrong username' });
	}
	if (!validatePassword(username, password)) {
	    // invalid password
	    // should disable logins after N messages
	    // delay return to rate-limit brute-force attacks
	    await new Promise((r) => setTimeout(r, 2000)); // two second delay
	    return done(null, false, { 'message' : 'Wrong password' });
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
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true}));


app.get('/readReviews', (req, res) => {
    if ('user' in req.query) {
        res.end(JSON.stringify(returnUserReview(req.query.user)));
        console.log('Viewing user reviews for user: ' + req.query.user);
    } else {
        res.end(JSON.stringify(returnReviews()));
        console.log('Main reviews loading...');
    }

});
app.post('/updateReview', (req, res) => {
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
app.post('/deleteReview', (req, res) => {
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
app.post('/createReview', (req, res) => {
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
            res.writeHead(200, { "Content-Type": "text/html" });
        } else if (filename.endsWith("css")) {
            res.writeHead(200, { "Content-Type": "text/css" });
        } else if (filename.endsWith("js")) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
        } else {
            res.writeHead(200);
        }
        res.write(readFileSync(path));
        res.end();
    } else {
        res.writeHead(404);
        res.end();
    }
});
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});