import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingBag,
  Utensils,
  Car,
  Film,
  Heart,
  Briefcase,
  Gift,
  DollarSign,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";

import { fetchTransactions, addTransaction } from "../redux/slices/transactionSlice";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions: backendTransactions, loading } = useSelector((state) => state.transactions);

  // Modal & filter state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    mode: "Cash",
    payee: "",
    type: "expense",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Static fallback data
  const staticTransactions = [
    
  ];

  const transactions = backendTransactions.length ? backendTransactions : staticTransactions;

  // Fetch transactions from backend
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category || !formData.payee) return;

    const newTransaction = {
      title: formData.title,
      amount: formData.type === "expense" ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
      category: formData.category,
      mode: formData.mode,
      payee: formData.payee,
      type: formData.type,
      description: formData.description,
      date: formData.date,
    };

    dispatch(addTransaction(newTransaction));

    setFormData({
      title: "",
      amount: "",
      category: "",
      mode: "Cash",
      payee: "",
      type: "expense",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(false);
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const paymentModeStats = {
    Cash: transactions.filter(t => t.mode === "Cash").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    UPI: transactions.filter(t => t.mode === "UPI").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    Card: transactions.filter(t => t.mode === "Card").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    Online: transactions.filter(t => t.mode === "Online").reduce((sum, t) => sum + Math.abs(t.amount), 0),
    "Bank Transfer": transactions.filter(t => t.mode === "Bank Transfer").reduce((sum, t) => sum + Math.abs(t.amount), 0),
  };

  // ✅ Changed to Indian Rupee (₹)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Math.abs(amount));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });

  const categoryIcons = {
    Food: <Utensils size={18} />, Transport: <Car size={18} />, Entertainment: <Film size={18} />,
    Shopping: <ShoppingBag size={18} />, Bills: <DollarSign size={18} />, Healthcare: <Heart size={18} />,
    Salary: <Briefcase size={18} />, Freelance: <Gift size={18} />, Investment: <DollarSign size={18} />,
    Gift: <Gift size={18} />, Travel: <Car size={18} />, Other: <DollarSign size={18} />,
  };

  const paymentModeIcons = {
    Cash: <Banknote size={16} />, UPI: <Smartphone size={16} />, Card: <CreditCard size={16} />,
    Online: <Smartphone size={16} />, "Bank Transfer": <Building2 size={16} />,
  };

  const filteredTransactions = filterMode === "all" ? transactions : transactions.filter(t => t.mode === filterMode);

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">💰 My Expense Tracker</h1>
          <p className="dashboard-subtitle">Track your expenses and manage your finances</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Add Transaction</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <div className="card-icon"><TrendingUp size={28} /></div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="summary-card expense-card">
          <div className="card-icon"><DollarSign size={28} /></div>
          <div className="card-content">
            <h3>Total Expense</h3>
            <p className="amount">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
        <div className={`summary-card balance-card ${balance >= 0 ? "positive" : "negative"}`}>
          <div className="card-icon"><PieChart size={28} /></div>
          <div className="card-content">
            <h3>Balance</h3>
            <p className="amount">{formatCurrency(balance)}</p>
            <span className="card-trend">{balance >= 0 ? "Surplus" : "Deficit"}</span>
          </div>
        </div>
      </div>

      {/* Payment Mode Stats */}
      <div className="payment-stats-section">
        <h2>Payment Mode Statistics</h2>
        <div className="payment-stats-grid">
          {Object.entries(paymentModeStats).map(([mode, amount]) => (
            <div key={mode} className="payment-stat-card">
              <div className="payment-icon">{paymentModeIcons[mode]}</div>
              <div className="payment-content">
                <h4>{mode}</h4>
                <p className="payment-amount">{formatCurrency(amount)}</p>
                <span className="payment-count">{transactions.filter(t => t.mode === mode).length} transactions</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
          <div className="filter-controls">
            <Filter size={18} />
            <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className="filter-select">
              <option value="all">All Payments</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="transactions-list">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state"><p>🌱 No transactions found for the selected filter.</p></div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction._id || transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-left">
                  <div className="transaction-icon">{categoryIcons[transaction.category]}</div>
                  <div className="transaction-info">
                    <h4 className="transaction-title">{transaction.title}</h4>
                    <p className="transaction-payee">{transaction.type === "expense" ? "Paid to" : "Received from"}: {transaction.payee}</p>
                    <p className="transaction-category">{transaction.category}</p>
                    {transaction.description && <p className="transaction-description">{transaction.description}</p>}
                  </div>
                </div>
                <div className="transaction-right">
                  <div className="transaction-details">
                    <p className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === "expense" ? "-" : "+"}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <div className="transaction-meta">
                      <span className="transaction-mode">{paymentModeIcons[transaction.mode]} {transaction.mode}</span>
                      <span className="transaction-date"><Calendar size={14} /> {formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal (Add Transaction) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Transaction</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              {/* Transaction Type */}
              <div className="form-group">
                <label>Transaction Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="type" value="expense" checked={formData.type === "expense"} onChange={handleInputChange} />
                    <span className="radio-text expense">💸 Expense</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="type" value="income" checked={formData.type === "income"} onChange={handleInputChange} />
                    <span className="radio-text income">💰 Income</span>
                  </label>
                </div>
              </div>

              {/* Title & Amount */}
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Transaction title" />
              </div>
              <div className="form-group">
                {/* ✅ Updated label */}
                <label>Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} step="0.01" min="0" required />
              </div>

              {/* Category & Mode */}
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select category</option>
                    {formData.type === "expense" ? (
                      <>
                        <option value="Food">🍽️ Food</option>
                        <option value="Transport">🚗 Transport</option>
                        <option value="Entertainment">🎬 Entertainment</option>
                        <option value="Shopping">🛍️ Shopping</option>
                        <option value="Bills">💡 Bills</option>
                        <option value="Healthcare">❤️ Healthcare</option>
                        <option value="Travel">✈️ Travel</option>
                        <option value="Other">📝 Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Salary">💼 Salary</option>
                        <option value="Freelance">🎨 Freelance</option>
                        <option value="Investment">📈 Investment</option>
                        <option value="Gift">🎁 Gift</option>
                        <option value="Other">📝 Other</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Mode</label>
                  <select name="mode" value={formData.mode} onChange={handleInputChange} required>
                    <option value="Cash">💵 Cash</option>
                    <option value="UPI">📱 UPI</option>
                    <option value="Card">💳 Card</option>
                    <option value="Online">🌐 Online</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Payee & Date */}
              <div className="form-group">
                <label>{formData.type === "expense" ? "Paid To" : "Received From"}</label>
                <input type="text" name="payee" value={formData.payee} onChange={handleInputChange} required placeholder="Enter payee" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Notes..."></textarea>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
