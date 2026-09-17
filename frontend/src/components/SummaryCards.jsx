import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Percent, TrendingUp } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  const { totalIncome = 0, totalExpense = 0, remainingBalance = 0, savingsRate = 0 } = summary || {};

  const formatCurrency = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Income / Salary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Income / Salary
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total earnings received
          </p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(totalExpense)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total spent across categories
          </p>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Remaining Balance
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            remainingBalance >= 0 
              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' 
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-black ${
            remainingBalance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'
          }`}>
            {formatCurrency(remainingBalance)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {remainingBalance >= 0 ? 'Available savings balance' : 'Deficit / Overbudget amount'}
          </p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Savings Rate
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-baseline space-x-1">
            <span>{savingsRate}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default SummaryCards;
