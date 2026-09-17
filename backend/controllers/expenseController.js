const { query, get, run } = require('../config/db');

// Get all expenses for logged in user with search & filters
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, category, search, payment_method } = req.query;

    let sql = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }
    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (payment_method && payment_method !== 'All') {
      sql += ' AND payment_method = ?';
      params.push(payment_method);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR notes LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    sql += ' ORDER BY date DESC, id DESC';

    const expenses = await query(sql, params);
    res.json({ expenses });
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ message: 'Error fetching expense records.' });
  }
};

// Add new expense
const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category, date, payment_method, notes } = req.body;

    if (!title || !amount || !category || !date || !payment_method) {
      return res.status(400).json({
        message: 'Title, Amount, Category, Date, and Payment Method are required.'
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive expense amount.' });
    }

    const result = await run(
      'INSERT INTO expenses (user_id, title, amount, category, date, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title.trim(), parsedAmount, category.trim(), date, payment_method.trim(), notes ? notes.trim() : '']
    );

    const newExpense = await get('SELECT * FROM expenses WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Expense added successfully!',
      expense: newExpense
    });
  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ message: 'Error saving expense record.' });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { title, amount, category, date, payment_method, notes } = req.body;

    const existing = await get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);
    if (!existing) {
      return res.status(404).json({ message: 'Expense record not found.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive expense amount.' });
    }

    await run(
      'UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, payment_method = ?, notes = ? WHERE id = ? AND user_id = ?',
      [title.trim(), parsedAmount, category.trim(), date, payment_method.trim(), notes ? notes.trim() : '', expenseId, userId]
    );

    const updated = await get('SELECT * FROM expenses WHERE id = ?', [expenseId]);

    res.json({
      message: 'Expense updated successfully!',
      expense: updated
    });
  } catch (err) {
    console.error('Update expense error:', err);
    res.status(500).json({ message: 'Error updating expense record.' });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const existing = await get('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);
    if (!existing) {
      return res.status(404).json({ message: 'Expense record not found.' });
    }

    await run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);

    res.json({ message: 'Expense record deleted successfully.' });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ message: 'Error deleting expense record.' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
};
