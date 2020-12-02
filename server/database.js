import minicrypt from './miniCrypt.js';

import pgPromise from 'pg-promise';
const pgp = pgPromise({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});

const username = "postgres";
const password = "admin";

const url = process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(url);

//lecture code to connect to databse and run a particular command
async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    } finally {
        try {
            connection.done();
        } catch (ignored) {
            console.log('IGNORED CONNECTION');
        }
    }
}

//function to check if username exists
async function checkUser(username) {
    return await connectAndRun(db => db.one('SELECT EXISTS(SELECT 1 FROM diningusers WHERE username = $1);', username));
}
//function to return user relevant information, used for minicrypt
async function returnUser(username) {
    return await connectAndRun(db => db.one('SELECT * from diningusers WHERE username = $1 LIMIT 1;', username));
}

async function insertUser(username, salt, hash) {
    return await connectAndRun(db => db.none("INSERT INTO diningusers VALUES ($1, $2, $3)", [username, salt, hash]));
}

export async function insertReview(username, dining, dish, review) {
    return await connectAndRun(db => db.none("INSERT INTO reviewpage(username,dining,dish,review) VALUES ($1, $2, $3, $4)", [username, dining, dish, review]));
}

async function helperUserReview(username) {
    return await connectAndRun(db => db.any('SELECT * from reviewpage WHERE username = $1 ;', username));
}

async function helperAllReviews() {
    return await connectAndRun(db => db.any('SELECT * from reviewpage;'));
}

export async function deleteReview(id) {
    return await connectAndRun(db => db.none("DELETE FROM reviewpage WHERE id = $1", id));
}

export async function updateReview(id, dining, dish, review) {
    return await connectAndRun(db => db.none("UPDATE reviewpage SET dining = $2, dish = $3, review = $4 WHERE id = $1;", [id, dining, dish, review]));
}

const mc = new minicrypt();

//returns user reviews
export async function returnUserReview(username) {
    const reviewArr = await helperUserReview(username);
    return reviewArr;
}
//helps to ensure that reviews returned are in proper format
export async function returnReviews() {
    const reviewArr = await helperAllReviews();
    return reviewArr;
}


// Returns true iff the user exists.
export async function findUser(username) {
    const truth = await checkUser(username);
    return truth.exists; //exists is a field returned by sql query 
}

//validating password by using database
export async function validatePassword(name, pwd) {
    const foundUser = await findUser(name);
    if (!foundUser) {
        return false;
    }
    const userVal = await returnUser(name);
    return mc.check(pwd, userVal.salt, userVal.hash);
}

// Add a user to the "database".
// Return true if added, false otherwise (because it was already there).
export async function addUser(name, pwd) {
    const foundUser = await findUser(name);
    if (foundUser) {
        return false;
    }
    const resp = mc.hash(pwd);
    insertUser(name, resp[0], resp[1]);
    return true;
}