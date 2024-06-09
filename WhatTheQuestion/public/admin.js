document.addEventListener('DOMContentLoaded', function() {
    fetch('/admin')
        .then(response => response.json())
        .then(data => {
            const questionsList = document.getElementById('questionsList');
            data.forEach(question => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${question.question}
                    <button class="delete-btn" data-id="${question.id}">Supprimer</button>
                `;
                questionsList.appendChild(li);
            });

            // Ajouter les gestionnaires d'événements pour les boutons de suppression
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const questionId = this.getAttribute('data-id');
                    fetch(`/delete/${questionId}`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                this.parentElement.remove();
                            } else {
                                alert('Erreur lors de la suppression de la question');
                            }
                        })
                        .catch(error => console.error('Erreur:', error));
                });
            });
        })
        .catch(error => console.error('Erreur:', error));
});
