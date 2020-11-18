window.addEventListener('load', async function() {
    fetch('/readReviews', { method: "POST" }).then(data => data.json()).then((success) => {
        let id = 0;
        console.log(success);
        const body = document.getElementById('main-body');
        const dining = ["Berkshire", "Frank", "Worcester", "Hampshire", "Blue Wall"];
        success.forEach(element => {
            const curItem = document.createElement('div');
            curItem.classList.add('mt-4');
            curItem.classList.add('card');
            curItem.innerHTML = `<div class="card-header" id="name-${id}"> &#128366; Govind Chandak </div>` +
                `<div class="card-body"> <blockquote class="blockquote mb-0"> <p id="description-${id}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>` +
                `<footer class="blockquote-footer">Dish: <cite title="Source Title" id="dish-${id}">Sushi</cite></footer></blockquote></div>` +
                `<footer class="blockquote-footer">Dining Hall: <cite title="Source Title" id="dining-${id}">Berkshire</cite></footer>`;
            body.appendChild(curItem);
            document.getElementById(`name-${id}`).innerHTML = "&#128366; " + element.username.toUpperCase();
            document.getElementById(`description-${id}`).innerHTML = element.review;
            document.getElementById(`dish-${id}`).innerHTML = element.dish;
            document.getElementById(`dining-${id}`).innerHTML = dining[parseInt(element.dining)];
            id += 1;
        });
    });
});