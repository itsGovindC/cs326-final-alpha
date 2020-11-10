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