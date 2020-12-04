async function addReviews() {
    fetch('/viewUserReview', { method: "POST" }).then(data => data.json()).then((success) => {
        const body_1 = document.getElementById('main-review-body'); //parent is this element, to which all the forms are added
        let id = 0;
        success.forEach(element => {
            const elem = document.createElement("div");
            elem.classList.add("user-review");
            //creates a default layout for user review, uses html/bootstrap, where id is parametrized
            elem.innerHTML = `<div class='form-group'><label for='Dining Hall-${id}'>Dining Hall</label><select class='form-control' id='Dining Hall-${id}'>` +
                `<option>Berkshire Dining Commons</option><option>Franklin Dining Commons</option><option>Worcester Dining Commons</option><option>Hampshire Dining Commons</option><option>Blue Wall</option></select>` +
                `</div><div class='form-group'><label for='Dish-${id}'>Dish</label><input type='text' class='form-control' id='Dish-${id}'></div>` +
                `<div class='form-group'><label for='Review-${id}'>Review</label><textarea class='form-control' rows=7 id='Review-${id}'></textarea></div>` +
                `<label for='review-id-${id}'>Review-ID</label><input class='form-control' type='text' placeholder='' id='review-id-${id}' readonly></input><button type='submit' class='btn btn-light mt-3' id='update-${id}'>Update</button><button type='submit' class='btn btn-light mt-3 ml-2' id='delete-${id}'>Delete</button>`;
            body_1.appendChild(elem);
            //fetching elements below, and then updating value based on data fields
            const dining_hall = document.getElementById(`Dining Hall-${id}`);
            const dish = document.getElementById(`Dish-${id}`);
            const review = document.getElementById(`Review-${id}`);
            const review_id = document.getElementById(`review-id-${id}`);
            dining_hall.selectedIndex = element.dining;
            dish.value = element.dish;
            review.value = element.review;
            review_id.value = element.id;
            //curried function, ensures that cur_id remains the same as it was during the initial loop execution
            //allows us to ensure that the id we deal with for update/delete is the correct one
            function EventListener_update() {
                const cur_id = id;
                return function() {
                    const obj = {};
                    obj['dining'] = document.getElementById(`Dining Hall-${cur_id}`).selectedIndex;
                    obj['dish'] = document.getElementById(`Dish-${cur_id}`).value;
                    obj['review'] = document.getElementById(`Review-${cur_id}`).value;
                    obj['id'] = document.getElementById(`review-id-${cur_id}`).value;
                    fetch('/updateReview', {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    });
                };
            }
            //another curried function
            function EventListener_delete() {
                const cur_id = id;
                return function() {
                    const obj = {};
                    obj['id'] = document.getElementById(`review-id-${cur_id}`).value;
                    fetch('/deleteReview', {
                        method: 'POST',
                        body: JSON.stringify(obj)
                    });
                };
            }
            //just adding event listeners, parametrized ids again
            document.getElementById(`update-${id}`).addEventListener('click', EventListener_update());
            document.getElementById(`delete-${id}`).addEventListener('click', EventListener_delete());
            //since our id is updated on each loop execution
            id += 1;
        });

    });
}

window.addEventListener("load", async function() {
    addReviews();
});