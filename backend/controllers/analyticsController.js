const { query, get } = require('../config/db');

// Get overall analytics summary for user dashboard
const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Income
    const incomeRow = await get('SELECT SUM(amount) as totalIncome FROM incomes WHERE user_id = ?', [userId]);
    const totalIncome = parseFloat(incomeRow?.totalincome || incomeRow?.totalIncome || 0);

    // Total Expense
    const expenseRow = await get('SELECT SUM(amount) as totalExpense FROM expenses WHERE user_id = ?', [userId]);
    const totalExpense = parseFloat(expenseRow?.totalexpense || expenseRow?.totalExpense || 0);

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

    const formattedCategoryBreakdown = categoryBreakdown.map(cat => {
      const amt = parseFloat(cat.total || 0);
      const cnt = parseInt(cat.count || 0, 10);
      return {
        category: cat.category,
        amount: amt,
        count: cnt,
        percentage: totalExpense > 0 ? parseFloat(((amt / totalExpense) * 100).toFixed(1)) : 0
      };
    });

    // Monthly trends (Last 6 months) using universal SUBSTR
    const monthlyIncome = await query(
      `SELECT SUBSTR(date, 1, 7) as month, SUM(amount) as income 
       FROM incomes 
       WHERE user_id = ? 
       GROUP BY SUBSTR(date, 1, 7) 
       ORDER BY month DESC 
       LIMIT 6`,
      [userId]
    );

    const monthlyExpenses = await query(
      `SELECT SUBSTR(date, 1, 7) as month, SUM(amount) as expense 
       FROM expenses 
       WHERE user_id = ? 
       GROUP BY SUBSTR(date, 1, 7) 
       ORDER BY month DESC 
       LIMIT 6`,
      [userId]
    );

    // Merge monthly trends
    const monthMap = {};
    monthlyIncome.forEach(item => {
      const inc = parseFloat(item.income || 0);
      monthMap[item.month] = { month: item.month, income: inc, expense: 0 };
    });
    monthlyExpenses.forEach(item => {
      const exp = parseFloat(item.expense || 0);
      if (!monthMap[item.month]) {
        monthMap[item.month] = { month: item.month, income: 0, expense: exp };
      } else {
        monthMap[item.month].expense = exp;
      }
    });

    const monthlyTrends = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

    // Recent 5 expenses
    const recentExpenses = await query(
      'SELECT id, title, amount, category, date, payment_method FROM expenses WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 5',
      [userId]
    );

    const formattedRecentExpenses = recentExpenses.map(exp => ({
      ...exp,
      amount: parseFloat(exp.amount || 0)
    }));

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
      recentExpenses: formattedRecentExpenses
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ message: 'Error generating analytics summary.' });
  }
};

module.exports = {
  getDashboardSummary
};
