const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurer le middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chemin vers le fichier de la base de données
const DB_PATH = path.join(__dirname, 'questions.db');

// Configurer la base de données SQLite
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT)");
});

// Route pour soumettre une question
app.post('/ask', (req, res) => {
    const question = req.body.question;
    db.run("INSERT INTO questions (question) VALUES (?)", [question], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
        }
        res.json({ success: true });
    });
});

// Route pour visualiser les questions (API)
app.get('/admin', (req, res) => {
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Route pour la page d'administration
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route pour supprimer une question
app.delete('/delete/:id', (req, res) => {
    const questionId = req.params.id;
    db.run("DELETE FROM questions WHERE id = ?", [questionId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
        }
        res.json({ success: true });
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
