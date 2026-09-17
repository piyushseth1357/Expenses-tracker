const { query, get } = require('../config/db');

// Get overall analytics summary for user dashboard
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Income
    const incomeRow = await get('SELECT SUM(amount) as totalIncome FROM incomes WHERE user_id = ?', [userId]);
    const totalIncome = incomeRow?.totalIncome || 0;

    // Total Expense
    const expenseRow = await get('SELECT SUM(amount) as totalExpense FROM expenses WHERE user_id = ?', [userId]);
    const totalExpense = expenseRow?.totalExpense || 0;

    // Remaining Balance
    const remainingBalance = totalIncome - totalExpense;

    // Savings Rate
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

    // Category breakdown
    const categoryBreakdown = await query(
      `SELECT category, SUM(amount) as total, COUNT(*) as count 
       FROM expenses 
       WHERE user_id = ? 
       GROUP BY category 
       ORDER BY total DESC`,
      [userId]
    );

    const formattedCategoryBreakdown = categoryBreakdown.map(cat => ({
      category: cat.category,
      amount: cat.total,
      count: cat.count,
      percentage: totalExpense > 0 ? parseFloat(((cat.total / totalExpense) * 100).toFixed(1)) : 0
    }));

    // Monthly trends (Last 6 months)
    const monthlyIncome = await query(
      `SELECT strftime('%Y-%m', date) as month, SUM(amount) as income 
       FROM incomes 
       WHERE user_id = ? 
       GROUP BY month 
       ORDER BY month DESC 
       LIMIT 6`,
      [userId]
    );

    const monthlyExpenses = await query(
      `SELECT strftime('%Y-%m', date) as month, SUM(amount) as expense 
       FROM expenses 
       WHERE user_id = ? 
       GROUP BY month 
       ORDER BY month DESC 
       LIMIT 6`,
      [userId]
    );

    // Merge monthly trends
    const monthMap = {};
    monthlyIncome.forEach(item => {
      monthMap[item.month] = { month: item.month, income: item.income, expense: 0 };
    });
    monthlyExpenses.forEach(item => {
      if (!monthMap[item.month]) {
        monthMap[item.month] = { month: item.month, income: 0, expense: item.expense };
      } else {
        monthMap[item.month].expense = item.expense;
      }
    });

    const monthlyTrends = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

    // Recent 5 expenses
    const recentExpenses = await query(
      'SELECT id, title, amount, category, date, payment_method FROM expenses WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 5',
      [userId]
    );

    // Highest expense category
    const topCategory = formattedCategoryBreakdown.length > 0 ? formattedCategoryBreakdown[0] : null;

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        remainingBalance,
        savingsRate,
        topCategory
      },
      categoryBreakdown: formattedCategoryBreakdown,
      monthlyTrends,
      recentExpenses
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ message: 'Error generating analytics summary.' });
  }
};

module.exports = {
  getDashboardSummary
};
