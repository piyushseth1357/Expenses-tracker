import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Target, Plus, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const Budgets = ({ onOpenBudgetModal, refreshTrigger }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await API.get('/budgets');
      setBudgets(res.data.budgets || []);
    } catch (err) {
      console.error('Fetch budgets error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget target?')) {
      try {
        await API.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        console.error('Delete budget error:', err);
      }
    }
  };

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Category Monthly Budgets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Set spending targets per category and track budget limits in real time.
          </p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Set Budget Target</span>
        </button>
      </div>

      {/* Budget Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading budget targets...</div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const isOverBudget = b.percentUsed >= 100;
            const isWarning = b.percentUsed >= 80 && b.percentUsed < 100;

            return (
              <div
                key={b.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
                  isOverBudget
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                    : isWarning
                    ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {b.category}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Delete Budget Target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Spent vs Limit */}
                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Spent: </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(b.spent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Target: </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(b.monthly_limit)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                  />
                </div>

                {/* Alert Badge */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {b.percentUsed}% used
                  </span>
                  {isOverBudget ? (
                    <span className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Over Budget!</span>
                    </span>
                  ) : isWarning ? (
                    <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Near Limit (80%+)</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Within Budget</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Target className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Budget Targets Set</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Setting budget targets helps you prevent overspending by alerting you when expenses approach your limit.
          </p>
          <button
            onClick={onOpenBudgetModal}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            Set Your First Budget Limit
          </button>
        </div>
      )}

    </div>
  );
};

export default Budgets;
