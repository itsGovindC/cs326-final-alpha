import { default as faker } from 'faker';

import minicrypt from './miniCrypt.js'

import pgPromise from 'pg-promise';
const pgp = pgPromise({
    connect(client) {
        console.log('Connected to database:', client.connectionParameters.database);
    },

    disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }
});


const url = process.env.DATABASE_URL || 'postgres://postgres@localhost/';
const db = pgp(url);


async function connectAndRun(task) {
    let connection = null;

    try {
        connection = await db.connect();
        return await task(connection);
    } finally {
        try {
            connection.done();
        } catch(ignored) {
            console.log('IGNORED CONNECTION');
        }
    }
}

async function checkUser(username) {
    return await connectAndRun(db => db.one('SELECT EXISTS(SELECT 1 FROM diningusers WHERE username = $1);', username));
}

async function returnUser(username) {
    return await connectAndRun(db => db.one('SELECT * from diningusers WHERE username = $1);', username));
}

async function insertUser(username, salt, hash) {
    return await connectAndRun(db => db.none("INSERT INTO diningusers VALUES ($1, $2, $3)", [username, salt, hash]));
}


const mc = new minicrypt();

export function returnUserReview(user_id) {
    let obj1;
    const arr_1 = [];
    //search all reviews using user_id, currently not implemented
    console.log('Returning reviews from database for ' + user_id);
    for (let i = 0; i < 10; ++i) {
        obj1 = {};
        obj1['reviewid'] = faker.random.number();
        obj1['dining'] = faker.random.number() % 5;
        obj1['review'] = faker.commerce.productDescription();
        obj1['dish'] = faker.commerce.product();
        arr_1.push(obj1);
    }
    return arr_1;
}

export function returnReviews() {
    let obj1;
    const arr_1 = [];
    for (let i = 0; i < 10; ++i) {
        obj1 = {};
        obj1['name'] = faker.name.firstName() + " " + faker.name.lastName();
        obj1['reviewid'] = faker.random.number();
        obj1['dining'] = faker.random.number() % 5;
        obj1['review'] = faker.commerce.productDescription();
        obj1['dish'] = faker.commerce.product();
        arr_1.push(obj1);
    }
    return arr_1;
}

// we use an in-memory "database"; this isn't persistent but is easy
let users = { 'emery' : [
    '2401f90940e037305f71ffa15275fb0d',
    '61236629f33285cbc73dc563cfc49e96a00396dc9e3a220d7cd5aad0fa2f3827d03d41d55cb2834042119e5f495fc3dc8ba3073429dd5a5a1430888e0d115250'
  ] }; // default user

// Returns true iff the user exists.
export async function findUser(username) {
    const truth = await checkUser(username);
    return truth.exists;
}

export async function validatePassword(name, pwd) {
    const foundUser = await findUser(name);
    if (!foundUser) {
	    return false;
    }
    const userVal = await returnUser(name)
    console.log(userVal)
	return mc.check(pwd,userVal.salt,userVal.hash);
}

// Add a user to the "database".
// Return true if added, false otherwise (because it was already there).
export async function addUser(name, pwd) {
    const foundUser = await findUser(name);
    if (foundUser) {
	return false;
    }
    const resp = mc.hash(pwd);
    insertUser(name,resp[0],resp[1]);
    return true;
}