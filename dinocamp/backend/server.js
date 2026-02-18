const express = require('express');
const { Pool } = require('pg');
const path = require('path');

// Load .env from root directory (parent of backend folder)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Database connection
// Ensure password is always a string
const dbPassword = process.env.DB_PASSWORD;
const password = dbPassword ? String(dbPassword) : '';

// Debug: Log database config (without password)
console.log('Database config:', {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'dinocamp',
  user: process.env.DB_USER || 'postgres',
  passwordSet: !!password,
  passwordLength: password.length
});

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'dinocamp',
  user: process.env.DB_USER || 'postgres',
  password: password, // Always a string
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, username, emoji FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      detail: error.detail || null
    });
  }
});

app.put('/api/users/:id/username', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, name, username, emoji',
      [username.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
