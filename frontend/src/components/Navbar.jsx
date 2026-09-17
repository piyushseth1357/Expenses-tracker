import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Sun, Moon, LogOut, Download, PlusCircle, User } from 'lucide-react';

const Navbar = ({ onOpenExport, onOpenExpenseModal, onOpenIncomeModal }) => {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              SpendWise
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">
              Multi-User Expense Tracker
            </span>
          </div>
        </div>

        {/* Quick Action Buttons & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Add Buttons */}
          <button
            onClick={onOpenIncomeModal}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ Income</span>
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition"
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            <span>+ Expense</span>
          </button>

          {/* Statement Export */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition border border-indigo-200 dark:border-indigo-800"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Statement</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {user?.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {user?.email}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
