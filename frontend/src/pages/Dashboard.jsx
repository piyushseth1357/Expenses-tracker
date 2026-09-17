import React from 'react';
import SummaryCards from '../components/SummaryCards';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PlusCircle, Receipt, ArrowUpRight, ArrowDownRight, Tag, Calendar, Trash2, Edit } from 'lucide-react';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#14B8A6', '#F43F5E', '#3B82F6'];

const Dashboard = ({
  analyticsData,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenBudgetModal,
  onEditExpense,
  onDeleteExpense
}) => {
  const { summary = {}, categoryBreakdown = [], monthlyTrends = [], recentExpenses = [] } = analyticsData || {};

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Financial Overview</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Track your income salary, itemized expenses, and remaining balance in real-time.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenIncomeModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Income</span>
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <SummaryCards summary={summary} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Category Spending Breakdown</span>
            <span className="text-xs font-normal text-slate-400">By Expense Category</span>
          </h3>

          {categoryBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 font-medium">No expense records found yet.</p>
              <button
                onClick={onOpenExpenseModal}
                className="mt-3 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 text-xs font-semibold"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </div>

        {/* Income vs Expense Monthly Trends Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Income vs Expense Comparison</span>
            <span className="text-xs font-normal text-slate-400">Monthly Overview</span>
          </h3>

          {monthlyTrends.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 font-medium">Add income and expenses to view monthly trends.</p>
            </div>
          )}
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            Recent Expenses
          </h3>
          <button
            onClick={onOpenExpenseModal}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Add Expense
          </button>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {exp.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-medium">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {exp.payment_method}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">
                      - {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No recent transaction activity to show.
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
