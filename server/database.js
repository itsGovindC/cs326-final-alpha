import { default as faker } from 'faker';
export function returnUserReview(name) {
    let obj1;
    let arr_1 = [];
    for (let i = 0; i < 10; ++i) {
        obj1 = {};
        obj1['name'] = name;
        obj1['reviewid'] = faker.random.number();
        obj1['dining'] = faker.random.number()%5;
        obj1['review'] = faker.commerce.productDescription();
        obj1['dish'] = faker.commerce.product();
        arr_1.push(obj1);
    }
    return arr_1;
}