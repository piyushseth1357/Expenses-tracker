import Papa from 'papaparse';

export const generateCSVStatement = (user, expenses, startDate, endDate) => {
  const formattedData = expenses.map((exp, index) => ({
    'S.No': index + 1,
    'Date': exp.date,
    'Title/Description': exp.title,
    'Category': exp.category,
    'Payment Method': exp.payment_method,
    'Amount (INR)': exp.amount,
    'Notes': exp.notes || ''
  }));

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Expense_Report_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
