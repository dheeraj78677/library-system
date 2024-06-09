const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors({ origin: 'https://rmit-library-management.com' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/build')));

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
});

// MySQL Connection
const db = mysql.createConnection({
  host: 'database-1.c1o2ymc0iint.ap-southeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Test12345',
  database: 'database-1',
  connectTimeout: 10000,
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database.');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
});

// POST Endpoint to save the user data after verification
app.post('/verify-code', async (req, res) => {
  const { userData } = req.body;
  const { firstName, lastName, email, username, password } = userData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [firstName, lastName, email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user data:', err.message);
        return res.status(500).send('Error saving user data.');
      }
      res.status(200).send('Email verified and user data saved.');
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).send('Server error.');
  }
});

// Endpoint to fetch books from Open Library
app.get('/api/books', async (req, res) => {
  try {
    const response = await axios.get('https://openlibrary.org/search.json?q=programming&limit=96');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books from Open Library:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error', error.message);
    }
    res.status(500).send('Error fetching books.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// POST Endpoint to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err.message);
        return res.status(500).send('Server error.');
      }
  
      if (results.length === 0) {
        return res.status(404).send({ success: false, message: 'User does not exist.' });
      }
  
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ success: false, message: 'Incorrect password.' });
      }
  
      res.status(200).send({ success: true, user });
    });
  });
