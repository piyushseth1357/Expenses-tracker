const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('Connected to PostgreSQL database.');
  }
});

// Convert SQLite-style "?" placeholders to Postgres-style "$1, $2..."
const convertPlaceholders = (sql) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

// Utility wrappers (same interface as before, so routes files don't need to change)
const query = async (sql, params = []) => {
  const converted = convertPlaceholders(sql);
  const res = await pool.query(converted, params);
  return res.rows;
};

const get = async (sql, params = []) => {
  const converted = convertPlaceholders(sql);
  const res = await pool.query(converted, params);
  return res.rows[0];
};

const run = async (sql, params = []) => {
  let converted = convertPlaceholders(sql);
  const trimmed = converted.trim().toUpperCase();
  let addedReturning = false;

  if (trimmed.startsWith('INSERT') && !trimmed.includes('RETURNING')) {
    converted += ' RETURNING id';
    addedReturning = true;
  }

  const res = await pool.query(converted, params);
  return {
    id: addedReturning && res.rows[0] ? res.rows[0].id : null,
    changes: res.rowCount
  };
};

// Initialize database tables
const initDatabase = async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS incomes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        monthly_limit REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
};

initDatabase();

module.exports = {
  db: pool,
  query,
  get,
  run
};
