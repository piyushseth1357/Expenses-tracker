const { query, get, run } = require('../config/db');

// Get all incomes for logged in user
const getIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await query('SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC, id DESC', [userId]);
    res.json({ incomes });
  } catch (err) {
    console.error('Get incomes error:', err);
    res.status(500).json({ message: 'Error fetching income records.' });
  }
};

// Add new income / salary
const addIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, date, notes } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({ message: 'Title, Amount, and Date are required.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive income amount.' });
    }

    const result = await run(
      'INSERT INTO incomes (user_id, title, amount, date, notes) VALUES (?, ?, ?, ?, ?)',
      [userId, title.trim(), parsedAmount, date, notes ? notes.trim() : '']
    );

    const newIncome = await get('SELECT * FROM incomes WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Income added successfully!',
      income: newIncome
    });
  } catch (err) {
    console.error('Add income error:', err);
    res.status(500).json({ message: 'Error saving income record.' });
  }
};

// Update income
const updateIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const { title, amount, date, notes } = req.body;

    const existing = await get('SELECT * FROM incomes WHERE id = ? AND user_id = ?', [incomeId, userId]);
    if (!existing) {
      return res.status(404).json({ message: 'Income record not found.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid positive income amount.' });
    }

    await run(
      'UPDATE incomes SET title = ?, amount = ?, date = ?, notes = ? WHERE id = ? AND user_id = ?',
      [title.trim(), parsedAmount, date, notes ? notes.trim() : '', incomeId, userId]
    );

    const updated = await get('SELECT * FROM incomes WHERE id = ?', [incomeId]);

    res.json({
      message: 'Income updated successfully!',
      income: updated
    });
  } catch (err) {
    console.error('Update income error:', err);
    res.status(500).json({ message: 'Error updating income record.' });
  }
};

// Delete income
const deleteIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = req.params.id;

    const existing = await get('SELECT * FROM incomes WHERE id = ? AND user_id = ?', [incomeId, userId]);
    if (!existing) {
      return res.status(404).json({ message: 'Income record not found.' });
    }

    await run('DELETE FROM incomes WHERE id = ? AND user_id = ?', [incomeId, userId]);

    res.json({ message: 'Income record deleted successfully.' });
  } catch (err) {
    console.error('Delete income error:', err);
    res.status(500).json({ message: 'Error deleting income record.' });
  }
};

module.exports = {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome
};
