const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../backend/routes/authRoutes');
const incomeRoutes = require('../backend/routes/incomeRoutes');
const expenseRoutes = require('../backend/routes/expenseRoutes');
const budgetRoutes = require('../backend/routes/budgetRoutes');
const analyticsRoutes = require('../backend/routes/analyticsRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Support both /api/route and /route path variations on Vercel Serverless
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/incomes', '/incomes'], incomeRoutes);
app.use(['/api/expenses', '/expenses'], expenseRoutes);
app.use(['/api/budgets', '/budgets'], budgetRoutes);
app.use(['/api/analytics', '/analytics'], analyticsRoutes);

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker Backend API is running smoothly.' });
});

module.exports = app;
