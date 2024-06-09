const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurer le middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurer la base de données PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT
  )
`);

// Route pour soumettre une question
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  try {
    await pool.query('INSERT INTO questions (question) VALUES ($1)', [question]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
  }
});

// Route pour visualiser les questions (API)
app.get('/admin', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
  }
});

// Route pour la page d'administration
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route pour supprimer une question
app.delete('/delete/:id', async (req, res) => {
  const questionId = req.params.id;
  try {
    await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Une erreur est survenue.' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
