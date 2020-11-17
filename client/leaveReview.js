window.addEventListener('load', async function() {
    document.getElementById('submit').addEventListener('click', () => {
        const sent_data = {};
        sent_data['dining'] = document.getElementById('Dining-Hall').selectedIndex;
        sent_data['dish'] = document.getElementById('Dish').value;
        sent_data['review'] = document.getElementById('Review').value;
        fetch('/createReview', {
            method: 'POST',
            body: JSON.stringify(sent_data)
        });
    });
});