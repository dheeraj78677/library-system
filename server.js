const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'database-1.c1o2ymc0iint.ap-southeast-2.rds.amazonaws.com', // Replace with your RDS endpoint
  user: 'admin',     // Replace with your RDS username
  password: 'Test12345', // Replace with your RDS password
  database: 'database-1',  // Replace with your database name
  connectTimeout: 10000,
  port: 3306
});
// Connect to MySQL and handle connection errors
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      return;
    }
    console.log('Connected to the MySQL database.');
  
    // Create users table if it doesn't exist
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
  
  // Endpoint to save the user data after verification
  app.post('/verify-code', async (req, res) => {
    const { userData } = req.body;
    const { firstName, lastName, email, username, password } = userData;
  
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the user data in the database
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
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });