import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import API from './utils/api';

// Components & Modals
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExpenseModal from './components/ExpenseModal';
import IncomeModal from './components/IncomeModal';
import BudgetModal from './components/BudgetModal';
import ExportModal from './components/ExportModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Analytics from './pages/Analytics';
import Budgets from './pages/Budgets';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  // Analytics summary data state
  const [analyticsData, setAnalyticsData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAnalytics = async () => {
    if (!user) return;
    try {
      const res = await API.get('/analytics/summary');
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Fetch analytics summary error:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // CRUD Expense Actions
  const handleSaveExpense = async (data, id) => {
    if (id) {
      await API.put(`/expenses/${id}`, data);
    } else {
      await API.post('/expenses', data);
    }
    triggerRefresh();
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await API.delete(`/expenses/${id}`);
        triggerRefresh();
      } catch (err) {
        console.error('Delete expense error:', err);
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  // CRUD Income Actions
  const handleSaveIncome = async (data, id) => {
    if (id) {
      await API.put(`/incomes/${id}`, data);
    } else {
      await API.post('/incomes', data);
    }
    triggerRefresh();
  };

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await API.delete(`/incomes/${id}`);
        triggerRefresh();
      } catch (err) {
        console.error('Delete income error:', err);
      }
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setIsIncomeModalOpen(true);
  };

  // Budget Action
  const handleSaveBudget = async (data) => {
    await API.post('/budgets', data);
    triggerRefresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
        Loading SpendWise Expense Tracker...
      </div>
    );
  }

  // Unauthenticated Views
  if (!user) {
    return (
      <>
        {authMode === 'login' ? (
          <Login
            onSwitchToRegister={() => setAuthMode('register')}
            onOpenForgotPassword={() => setIsForgotPasswordModalOpen(true)}
          />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}

        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      </>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenExpenseModal={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onOpenIncomeModal={() => {
          setEditingIncome(null);
          setIsIncomeModalOpen(true);
        }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              analyticsData={analyticsData}
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onOpenIncomeModal={() => {
                setEditingIncome(null);
                setIsIncomeModalOpen(true);
              }}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              refreshTrigger={refreshKey}
            />
          )}

          {activeTab === 'income' && (
            <Income
              onOpenIncomeModal={() => {
                setEditingIncome(null);
                setIsIncomeModalOpen(true);
              }}
              onEditIncome={handleEditIncome}
              onDeleteIncome={handleDeleteIncome}
              refreshTrigger={refreshKey}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics analyticsData={analyticsData} />
          )}

          {activeTab === 'budgets' && (
            <Budgets
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              refreshTrigger={refreshKey}
            />
          )}
        </main>

      </div>

      {/* Global Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => {
          setIsIncomeModalOpen(false);
          setEditingIncome(null);
        }}
        onSave={handleSaveIncome}
        editingIncome={editingIncome}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};

export default AppContent;
