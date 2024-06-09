document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin')
        .then(response => response.json())
        .then(data => {
            const questionsList = document.getElementById('questionsList');
            data.forEach(question => {
                const li = document.createElement('li');
                li.textContent = question.question;
                questionsList.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur:', error));
});
