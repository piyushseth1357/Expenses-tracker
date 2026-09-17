import React, { useState } from 'react';
import { X, FileText, Download, Calendar, CheckCircle2 } from 'lucide-react';
import { generatePDFStatement } from '../utils/pdfGenerator';
import { generateCSVStatement } from '../utils/csvExporter';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const ExportModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleExport = async (format) => {
    try {
      setLoading(true);
      setStatusMsg('');

      // Fetch expenses for date range
      const expRes = await API.get('/expenses', { params: { startDate, endDate } });
      const incRes = await API.get('/incomes');

      const expenses = expRes.data.expenses || [];
      const incomes = incRes.data.incomes || [];

      if (format === 'pdf') {
        generatePDFStatement(user, expenses, incomes, startDate, endDate);
        setStatusMsg('PDF statement downloaded successfully!');
      } else if (format === 'csv') {
        generateCSVStatement(user, expenses, startDate, endDate);
        setStatusMsg('CSV statement spreadsheet downloaded successfully!');
      }
    } catch (err) {
      console.error('Export error:', err);
      setStatusMsg('Failed to generate export file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Download Statement
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Export your complete financial transaction history as a professionally formatted PDF or a raw CSV spreadsheet.
          </p>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Date Filters */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => handleExport('pdf')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition group"
            >
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200">Export PDF Report</span>
              <span className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-0.5">Invoice style PDF</span>
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition group"
            >
              <Download className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">Export CSV Data</span>
              <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Excel / Sheets compatible</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ExportModal;
