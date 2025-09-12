import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import '../styles/FinancialAnalytics.css';

const FinancialAnalytics = () => {
  // Sample data based on your form structure
  const [transactions] = useState([
    { id: 1, type: 'expense', title: 'Lunch at restaurant', amount: 25.50, category: 'Food', paymentMode: 'Card', paidTo: 'Pizza Palace', date: '2025-09-10', description: 'Team lunch' },
    { id: 2, type: 'income', title: 'Monthly salary', amount: 3500.00, category: 'Salary', paymentMode: 'Bank Transfer', paidTo: 'Company Inc', date: '2025-09-01', description: 'September salary' },
    { id: 3, type: 'expense', title: 'Bus fare', amount: 5.75, category: 'Transport', paymentMode: 'Cash', paidTo: 'City Transit', date: '2025-09-10', description: 'Daily commute' },
    { id: 4, type: 'expense', title: 'Movie tickets', amount: 35.00, category: 'Entertainment', paymentMode: 'UPI', paidTo: 'Cinema Hall', date: '2025-09-08', description: 'Weekend movie' },
    { id: 5, type: 'expense', title: 'Grocery shopping', amount: 85.25, category: 'Shopping', paymentMode: 'Card', paidTo: 'SuperMart', date: '2025-09-07', description: 'Weekly groceries' },
    { id: 6, type: 'expense', title: 'Electricity bill', amount: 120.00, category: 'Bills', paymentMode: 'Online', paidTo: 'Power Company', date: '2025-09-05', description: 'Monthly electricity' },
    { id: 7, type: 'expense', title: 'Doctor visit', amount: 75.00, category: 'Healthcare', paymentMode: 'Cash', paidTo: 'City Clinic', date: '2025-09-03', description: 'Routine checkup' },
    { id: 8, type: 'expense', title: 'Flight booking', amount: 450.00, category: 'Travel', paymentMode: 'Card', paidTo: 'Airlines', date: '2025-09-02', description: 'Business trip' },
    { id: 9, type: 'income', title: 'Freelance work', amount: 800.00, category: 'Freelance', paymentMode: 'Bank Transfer', paidTo: 'Client ABC', date: '2025-09-06', description: 'Website development' },
    { id: 10, type: 'expense', title: 'Coffee', amount: 4.50, category: 'Food', paymentMode: 'UPI', paidTo: 'Coffee Shop', date: '2025-09-09', description: 'Morning coffee' }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  // Calculate totals
  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses,
      savings: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
    };
  }, [transactions]);

  // Category-wise expense data
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2))
    }));
  }, [transactions]);

  // Payment mode distribution
  const paymentModeData = useMemo(() => {
    const paymentTotals = transactions.reduce((acc, t) => {
      acc[t.paymentMode] = (acc[t.paymentMode] || 0) + t.amount;
      return acc;
    }, {});
    
    return Object.entries(paymentTotals).map(([mode, amount]) => ({
      mode,
      amount: Number(amount.toFixed(2))
    }));
  }, [transactions]);

  // Daily spending trend (last 7 days)
  const dailyTrend = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date).toISOString().split('T')[0];
        return tDate === dateStr;
      });
      
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: Number(income.toFixed(2)),
        expenses: Number(expenses.toFixed(2))
      });
    }
    
    return last7Days;
  }, [transactions]);

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Financial Analytics Dashboard</h1>
        <div className="period-selector">
          <label className="period-label">Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <h3>Total Income</h3>
          <p className="amount">${totals.income.toFixed(2)}</p>
        </div>
        <div className="summary-card expense-card">
          <h3>Total Expenses</h3>
          <p className="amount">${totals.expenses.toFixed(2)}</p>
        </div>
        <div className={`summary-card ${totals.balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
          <h3>Net Balance</h3>
          <p className="amount">${totals.balance.toFixed(2)}</p>
        </div>
        <div className="summary-card savings-card">
          <h3>Savings Rate</h3>
          <p className="amount">{totals.savings}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        
        {/* Category-wise Expenses */}
        <div className="chart-container">
          <h3 className="chart-title">📊 Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Mode Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">💳 Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentModeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mode, percent }) => `${mode} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Trend */}
        <div className="chart-container trend-chart">
          <h3 className="chart-title">📈 7-Day Income vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name === 'income' ? 'Income' : 'Expenses']} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Footer Insights */}
      <div className="insights-section">
        <h3 className="insights-title">💡 Smart Insights</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <strong>Top Spending Category:</strong><br />
            <span>{categoryData.length > 0 ? categoryData.reduce((max, cat) => cat.amount > max.amount ? cat : max).category : 'N/A'}</span>
          </div>
          <div className="insight-item">
            <strong>Most Used Payment:</strong><br />
            <span>{paymentModeData.length > 0 ? paymentModeData.reduce((max, mode) => mode.amount > max.amount ? mode : max).mode : 'N/A'}</span>
          </div>
          <div className="insight-item">
            <strong>Average Daily Expense:</strong><br />
            <span>${(totals.expenses / 30).toFixed(2)}</span>
          </div>
          <div className="insight-item">
            <strong>Financial Health:</strong><br />
            <span className={totals.balance >= 0 ? 'health-positive' : 'health-negative'}>
              {totals.balance >= 0 ? '✅ Positive' : '⚠️ Review Budget'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;