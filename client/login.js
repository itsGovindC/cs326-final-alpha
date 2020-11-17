window.addEventListener('load',()=>{
    document.getElementById('submit').addEventListener('click',()=>{
        const sent_data = {};
        sent_data['username']=document.getElementById('username').value;
        sent_data['password']=document.getElementById('password').value;
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify(sent_data)
        });
    });
});