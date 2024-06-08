document.getElementById('questionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const question = document.getElementById('question').value;
    
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Question envoyée avec succès !');
            document.getElementById('question').value = '';
        } else {
            alert('Une erreur est survenue.');
        }
    })
    .catch(error => console.error('Error:', error));
});
