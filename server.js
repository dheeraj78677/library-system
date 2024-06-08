const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`);

// Endpoint to save the user data after verification
app.post('/verify-code', (req, res) => {
  const { userData } = req.body;
  const { firstName, lastName, email, username, password } = userData;

  // Save the user data in the database
  const sql = `INSERT INTO users (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [firstName, lastName, email, username, password], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send('Email verified and user data saved.');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
