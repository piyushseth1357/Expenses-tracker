const { query, get, run } = require('../config/db');

// Get all budgets with spent amount for current month
const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current month YYYY-MM
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // e.g. "2026-09"

    const budgets = await query('SELECT * FROM budgets WHERE user_id = ?', [userId]);

    // Calculate actual spent per category for current month
    const categorySpent = await query(
      `SELECT category, SUM(amount) as spent 
       FROM expenses 
       WHERE user_id = ? AND strftime('%Y-%m', date) = ? 
       GROUP BY category`,
      [userId, currentMonth]
    );

    const spentMap = {};
    categorySpent.forEach(item => {
      spentMap[item.category] = item.spent;
    });

    const result = budgets.map(b => ({
      ...b,
      spent: spentMap[b.category] || 0,
      remaining: b.monthly_limit - (spentMap[b.category] || 0),
      percentUsed: Math.min(100, Math.round(((spentMap[b.category] || 0) / b.monthly_limit) * 100))
    }));

    res.json({ budgets: result });
  } catch (err) {
    console.error('Get budgets error:', err);
    res.status(500).json({ message: 'Error fetching budget records.' });
  }
};

// Set / Update budget for a category
const setBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, monthly_limit } = req.body;

    if (!category || !monthly_limit) {
      return res.status(400).json({ message: 'Category and Monthly Limit are required.' });
    }

    const parsedLimit = parseFloat(monthly_limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive budget limit.' });
    }

    // SQLite INSERT OR REPLACE / ON CONFLICT
    await run(
      `INSERT INTO budgets (user_id, category, monthly_limit) 
       VALUES (?, ?, ?) 
       ON CONFLICT(user_id, category) 
       DO UPDATE SET monthly_limit = excluded.monthly_limit`,
      [userId, category.trim(), parsedLimit]
    );

    res.json({ message: 'Budget target saved successfully!' });
  } catch (err) {
    console.error('Set budget error:', err);
    res.status(500).json({ message: 'Error saving budget target.' });
  }
};

// Delete budget
const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    await run('DELETE FROM budgets WHERE id = ? AND user_id = ?', [budgetId, userId]);

    res.json({ message: 'Budget deleted successfully.' });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({ message: 'Error deleting budget.' });
  }
};

module.exports = {
  getBudgets,
  setBudget,
  deleteBudget
};
