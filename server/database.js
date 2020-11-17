import { default as faker } from 'faker';
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
let users = { 'emery': 'compsci326' } // default user

// Returns true iff the user exists.
export function findUser(username) {
    if (!users[username]) {
        return false;
    } else {
        return true;
    }
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
export function validatePassword(name, pwd) {
    if (!findUser(name)) {
        return false;
    }
    if (users[name] !== pwd) {
        return false;
    }
    return true;
}

// Add a user to the "database".
// Return true if added, false otherwise (because it was already there).
export function addUser(name, pwd) {
    if (findUser(name)) {
        return false;
    }
    users[name] = pwd;
    return true;
}