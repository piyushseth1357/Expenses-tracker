import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { PieChart as PieIcon, TrendingUp, Award, DollarSign, ArrowUpRight } from 'lucide-react';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#14B8A6', '#F43F5E', '#3B82F6'];

const Analytics = ({ analyticsData }) => {
  const { summary = {}, categoryBreakdown = [], monthlyTrends = [] } = analyticsData || {};

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Financial Analytics & Insights
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Deep dive into category distribution, spending patterns, and income vs expense ratios.
        </p>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Top Expense Category</span>
              <div className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {summary.topCategory ? summary.topCategory.category : 'N/A'}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            {summary.topCategory ? `${formatCurrency(summary.topCategory.amount)} (${summary.topCategory.percentage}% of total)` : 'No expenses logged yet'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Savings Efficiency</span>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {summary.savingsRate || 0}% Savings Rate
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Net balance: {formatCurrency(summary.remainingBalance)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Categories</span>
              <div className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {categoryBreakdown.length} Categories Used
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Total expenses logged: {categoryBreakdown.reduce((sum, c) => sum + c.count, 0)} transactions
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4">
            Category Share Breakdown
          </h3>
          {categoryBreakdown.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
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
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No category data available.
            </div>
          )}
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4">
            Financial Flow (Income vs Expense)
          </h3>
          {monthlyTrends.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" fillOpacity={1} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#F43F5E" fillOpacity={1} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-xs text-slate-400">
              No trend data available.
            </div>
          )}
        </div>

      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4">
          Detailed Category Analysis Table
        </h3>
        {categoryBreakdown.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Transactions</th>
                  <th className="py-2.5 px-3 text-right">Total Spent</th>
                  <th className="py-2.5 px-3">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {categoryBreakdown.map((cat, idx) => (
                  <tr key={cat.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span>{cat.category}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {cat.count} items
                    </td>
                    <td className="py-3 px-3 text-right font-black text-rose-600 dark:text-rose-400">
                      {formatCurrency(cat.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 w-10 text-right">{cat.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            No category details found.
          </div>
        )}
      </div>

    </div>
  );
};

export default Analytics;
