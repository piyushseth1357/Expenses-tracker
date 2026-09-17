import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Plus, Edit, Trash2, Landmark, TrendingUp } from 'lucide-react';

const Income = ({ onOpenIncomeModal, onEditIncome, onDeleteIncome, refreshTrigger }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/incomes');
      setIncomes(res.data.incomes || []);
    } catch (err) {
      console.error('Fetch incomes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [refreshTrigger]);

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Income & Salary Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log your monthly salary, freelance earnings, bonuses, and investment yields.
          </p>
        </div>
        <button
          onClick={() => onOpenIncomeModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Income / Salary</span>
        </button>
      </div>

      {/* Income Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
            Total Accumulated Income
          </span>
          <div className="text-3xl font-black text-emerald-300 mt-1">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 flex items-center justify-center text-emerald-300">
          <TrendingUp className="w-7 h-7" />
        </div>
      </div>

      {/* Income Records Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading income records...</div>
        ) : incomes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Date Received</th>
                  <th className="py-3 px-4">Income Source / Title</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {incomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {inc.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {inc.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {inc.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-sm">
                      + {formatCurrency(inc.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onEditIncome(inc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                          title="Edit Income"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteIncome(inc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                          title="Delete Income"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Landmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Income Records Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Click the button above to log your salary or monthly earnings.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Income;
