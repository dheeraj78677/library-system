const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');


require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors({ origin: '*' }));
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
      password VARCHAR(255) NOT NULL,
      isadmin BOOLEAN
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

// Helper functions to encrypt and decrypt data
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  const [ivText, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Endpoint to handle sign-up and save the user data
app.post('/sign-up', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  console.log('Received data:', { firstName, lastName, email, username, password });

  try {
    const encryptedUsername = encrypt(username);
    const encryptedPassword = encrypt(password);

    const sql = `INSERT INTO users (firstName, lastName, email, username, password, isadmin) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [firstName, lastName, email, encryptedUsername, encryptedPassword, false], (err, result) => {
      if (err) {
        console.error('Error inserting user data:', err.message, err.sqlMessage);
        return res.status(500).send('Error saving user data.');
      }
      res.status(200).send({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).send('Server error.');
  }
});

// Endpoint to handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received:', { username, password });

  const sql = `SELECT * FROM users`;
  db.query(sql, async (err, results) => {
        if (err) {
        console.error('Error fetching user:', err.message);
        return res.status(500).send('Server error.');
        }

        let userFound = null;
        for (let user of results) {
        try {
            const decryptedUsername = decrypt(user.username);
            if (decryptedUsername === username) {
            userFound = user;
            userFound.username= decryptedUsername;
            break;
            }
        } catch (error) {
            console.error('Error decrypting username:', error.message);
        }
        }
        
        if (!userFound) {
        console.error('User does not exist:', username);
        return res.status(404).send({ success: false, message: 'User does not exist.' });
        }

        try {
        const decryptedPassword = decrypt(userFound.password);
        if (decryptedPassword !== password) {
            console.error('Incorrect username or password');
            return res.status(401).send({ success: false, message: 'Incorrect username or password.' });
        }

        res.status(200).send({ success: true, user: userFound });
        console.log('user found ',userFound)
        } catch (error) {
        console.error('Error decrypting password:', error.message);
        res.status(500).send('Server error.');
        }
  });
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

// Endpoint to handle password reset
app.post('/reset-password', async (req, res) => {
    const { email, password } = req.body;
    const encryptedPassword = encrypt(password);
  
    const sql = `UPDATE users SET password = ? WHERE email = ?`;
    db.query(sql, [encryptedPassword, email], (err, result) => {
      if (err) {
        return res.status(500).send('Failed to reset password.');
      }
      res.status(200).send('Password reset successfully.');
    });
  });
  
  // Endpoint to handle profile update
app.post('/update-profile', async (req, res) => {
    const { id, firstName, lastName, email, username } = req.body;
    try{
        const encryptedUsername = encrypt(username);
        const sql = `UPDATE users SET firstName = ?, lastName = ?, email = ?, username = ? WHERE id = ?`;
        db.query(sql, [firstName, lastName, email, encryptedUsername, id], (err, result) => {
          if (err) {
            return res.status(500).send('Failed to update profile.');
          }
          res.status(200).send('Profile updated successfully.');
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).send('Server error.');
      }
    
   
  });
  
  // Endpoint to handle password reset with old password check
  app.post('/reset-password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
  
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).send('Email not found.');
      }
  
      const user = result[0];
      const decryptedOldPassword = decrypt(user.password);
  
      if (decryptedOldPassword !== oldPassword) {
        return res.status(400).send('Old password is incorrect.');
      }
  
      const encryptedNewPassword = encrypt(newPassword);
      const updateSql = `UPDATE users SET password = ? WHERE email = ?`;
      db.query(updateSql, [encryptedNewPassword, email], (err, result) => {
        if (err) {
          return res.status(500).send('Failed to reset password.');
        }
        res.status(200).send('Password reset successfully.');
      });
    });
  });
  
  // Endpoint to generate and download a sample PDF
app.get('/api/download-sample', (req, res) => {
    const filePath = path.join(__dirname, 'sample.pdf');
    res.download(filePath, 'sample.pdf', (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
  });

  // Route to fetch all users
app.get('/users', (req, res) => {  
    const sql = 'SELECT id, firstName, lastName, email FROM users';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err.message);
        return res.status(500).send('Server error.');
      }
      res.status(200).send({ success: true, users: results });
      console.log('Number of users found:', results.length);
    });
  });
  
  // Route to delete selected users
  app.post('/deleteUsers', (req, res) => {
    const { userIds } = req.body;
    const sql = 'DELETE FROM users WHERE id IN (?)';
    db.query(sql, [userIds], (err, result) => {
      if (err) {
        console.error('Error deleting user data:', err.message, err.sqlMessage);
        return res.status(500).send('Error deleting user data.');
      }
      res.status(200).send({ message: 'User(s) deleted successfully' });
    });
  });

app.listen(port, '0.0.0.0',() => {
  console.log(`Server running on port ${port}`);
});
