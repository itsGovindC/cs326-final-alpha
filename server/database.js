import { default as faker } from 'faker';
export function returnReview(n) {
    let obj1;
    let arr_1 = [];
    for (let i = 0; i < n; ++i) {
        obj1 = {};
        obj1['name'] = faker.name.findName();
        obj1['description'] = faker.commerce.productDescription();
        obj1['dish'] = faker.commerce.product();
        arr_1.push(obj1);
    }
    return arr_1;
}