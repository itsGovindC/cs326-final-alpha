'use strict';
import express from 'express'
import { returnReview } from './database.js'

import { parse } from 'url';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const app = express();
app.use(express.json()); // lets you handle JSON input
const port = process.env.PORT || 8080;

app.get('/readReviews', (req, res) => {
    res.end(JSON.stringify(returnReview(10)));
});
app.post('/updateReview', (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        //update score here through database code
    });
    res.writeHead(202);
    res.end();
});
app.post('/createReview', (req, res) => {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = JSON.parse(body);
        //create score here through database code
    });
    res.writeHead(201);
    res.end();
});

app.get('*', (req, res) => {
    const parsed = parse(req.url, true);
    const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
    const path = join("client/", filename);
    console.log("trying to serve " + path + "...");
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