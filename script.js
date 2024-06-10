document.getElementById('questionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const question = document.getElementById('questionInput').value;
    const messageDiv = document.getElementById('message');

    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('questionInput').value = '';
            messageDiv.innerHTML = '<div class="alert alert-success">Question send !</div>';
        } else {
            messageDiv.innerHTML = '<div class="alert alert-error">Uh-Oh... Something went wrong >w<</div>';
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        messageDiv.innerHTML = '<div class="alert alert-error">Uh-Oh... Something went wrong >w<</div>';
    });
});
