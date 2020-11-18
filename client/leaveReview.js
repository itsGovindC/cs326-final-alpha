window.addEventListener('load', async function() {
    document.getElementById('submit').addEventListener('click', () => {
        const sent_data = {};
        sent_data['dining'] = document.getElementById('Dining-Hall').selectedIndex;
        let str_dish = document.getElementById('Dish').value;
        str_dish = str_dish.toLowerCase();
        sent_data['dish'] = str_dish;
        sent_data['review'] = document.getElementById('Review').value;
        fetch('/createReview', {
            method: 'POST',
            body: JSON.stringify(sent_data)
        });
    });
});