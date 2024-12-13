// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();
const port = 3008;

// Middleware
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$ona@15', // Replace with your MySQL password
  database: 'details',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Routes

// Create a new student
app.post('/api/students', (req, res) => {
  const { firstname, lastname, email, phone, gender } = req.body;
  const sql = 'INSERT INTO student_details (firstname, lastname, email, phone, gender) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [firstname, lastname, email, phone, gender], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Student added successfully', id: result.insertId });
  });
});

// Read all students
app.get('/api/students', (req, res) => {
  const sql = 'SELECT * FROM student_details';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Read a single student by ID
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM student_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Update a student by ID
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, gender } = req.body;
  const sql = 'UPDATE student_details SET firstname = ?, lastname = ?, email = ?, phone = ?, gender = ? WHERE id = ?';
  db.query(sql, [firstname, lastname, email, phone, gender, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully' });
  });
});

// Delete a student by ID
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM student_details WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


