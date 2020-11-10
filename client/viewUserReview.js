
function addReviews() {
    let user = "pari";

    fetch('/readReviews?user=' +  user).then(data => data.json()).then((success) => {
        console.log(success);
        const body_1 = document.getElementById('main-review-body');
        let id= 0;
        success.forEach(element => {
            let elem = document.createElement("div");
            elem.classList.add("user-review");
            elem.innerHTML = `<div class='form-group'><label for='Dining Hall-${id}'>Dining Hall</label><select class='form-control' id='Dining Hall-${id}'>` +
                `<option>Berkshire Dining Commons</option><option>Franklin Dining Commons</option><option>Worcester Dining Commons</option><option>Hampshire Dining Commons</option><option>Blue Wall</option></select>` +
                `</div><div class='form-group'><label for='Dish-${id}'>Dish</label><input type='text' class='form-control' id='Dish-${id}'></div>` +
                `<div class='form-group'><label for='Review-${id}'>Review</label><textarea class='form-control' rows=7 id='Review-${id}'></textarea></div>` +
                `<label for='review-id-${id}'>Review-ID</label><input class='form-control' type='text' placeholder='' id='review-id-${id}' readonly></input><button type='submit' class='btn btn-light mt-3' id='update-${id}'>Update</button><button type='submit' class='btn btn-light mt-3 ml-2' id='delete-${id}'>Delete</button>`;
            body_1.appendChild(elem);
            let dining_hall = document.getElementById(`Dining Hall-${id}`);
            let dish = document.getElementById(`Dish-${id}`);
            let review = document.getElementById(`Review-${id}`);
            let review_id = document.getElementById(`review-id-${id}`);
            dining_hall.selectedIndex= element.dining;
            dish.value = element.dish;
            review.value = element.review;
            review_id.value=element.reviewid;

            function EventListener_update() {
                let cur_id = id;
                return function() {
                    let obj = {};
                    obj['dining'] = document.getElementById(`Dining Hall-${cur_id}`).value;
                    obj['dish'] = document.getElementById(`Dish-${cur_id}`).value;
                    obj['review'] = document.getElementById(`Review-${cur_id}`).value;
                    obj['reviewid'] = document.getElementById(`review-id-${cur_id}`).value;
                    console.log(obj);
                    fetch('/updateReview', {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    });
                }
            }
            document.getElementById(`update-${id}`).addEventListener('click',EventListener_update());
            id+=1
            });
            
    });
}

window.addEventListener("load", async function () {
    addReviews();

    

});