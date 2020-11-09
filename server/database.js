import {default as faker} from 'faker';


function returnReview(){
    let obj1= {};
    obj1['name'] = faker.name.findName();
    obj1['description'] =  faker.commerce.productDescription();
    obj1['dish'] = faker.commerce.product();
}
