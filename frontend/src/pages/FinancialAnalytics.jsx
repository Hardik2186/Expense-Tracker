import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';
import '../styles/FinancialAnalytics.css';

const FinancialAnalytics = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(state => state.transactions);

  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filter transactions by selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      switch (selectedPeriod) {
        case 'thisMonth':
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return tDate.getMonth() === lastMonth.getMonth() && tDate.getFullYear() === lastMonth.getFullYear();
        case 'last3Months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          return tDate >= threeMonthsAgo && tDate <= now;
        case 'thisYear':
          return tDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [transactions, selectedPeriod]);

  // Calculate totals (expenses as positive)
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0); // Make positive

    return {
      income,
      expenses,
      balance: income - expenses,
      savings: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0
    };
  }, [filteredTransactions]);

  // Category-wise expense data (positive values)
  const categoryData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2))
    }));
  }, [filteredTransactions]);

  // Payment mode distribution (expenses positive)
  const paymentModeData = useMemo(() => {
    const paymentTotals = filteredTransactions.reduce((acc, t) => {
      acc[t.mode] = (acc[t.mode] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    return Object.entries(paymentTotals).map(([mode, amount]) => ({
      mode,
      amount: Number(amount.toFixed(2))
    }));
  }, [filteredTransactions]);

  // Daily trend (expenses as positive values)
  const dailyTrend = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date).toISOString().split('T')[0];
        return tDate === dateStr;
      });

      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: Number(income.toFixed(2)),
        expenses: Number(expenses.toFixed(2))
      });
    }

    return last7Days;
  }, [filteredTransactions]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  if (loading) return <p className="loading">Loading transactions...</p>;
  if (error) return <p className="error">{error}</p>;

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
