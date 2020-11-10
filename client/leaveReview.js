window.addEventListener('load', async function() {
    document.getElementById('submit').addEventListener('click', () => {
        const sent_data = {};
        sent_data['name'] = 'pari'; //will redefine once authentication is done 
        sent_data['dining'] = document.getElementById('Dining-Hall').value;
        sent_data['dish'] = document.getElementById('Dish').value;
        sent_data['review'] = document.getElementById('Review').value;
        console.log(sent_data);
        fetch('/createReview', {
            method: 'POST',
            body: JSON.stringify(sent_data)
        });
    });
});