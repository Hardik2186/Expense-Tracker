import React, { useState } from "react";
import {
  ShoppingBag,
  Utensils,
  Car,
  Film,
  Heart,
  Briefcase,
  Gift,
  DollarSign,
} from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: "Salary",
      amount: 5000,
      category: "Salary",
      date: "2025-09-10",
      type: "income",
    },
    {
      id: 2,
      title: "Groceries",
      amount: -150,
      category: "Food",
      date: "2025-09-09",
      type: "expense",
    },
    {
      id: 3,
      title: "Coffee",
      amount: -25,
      category: "Food",
      date: "2025-09-08",
      type: "expense",
    },
    {
      id: 4,
      title: "Freelance",
      amount: 800,
      category: "Freelance",
      date: "2025-09-07",
      type: "income",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });

  // Totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) return;

    const newTransaction = {
      id: Date.now(),
      title: formData.title,
      amount:
        formData.type === "expense"
          ? -Math.abs(parseFloat(formData.amount))
          : Math.abs(parseFloat(formData.amount)),
      category: formData.category,
      date: formData.date,
      type: formData.type,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    });
    setIsModalOpen(false);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const categoryIcons = {
    Food: <Utensils size={18} />,
    Transport: <Car size={18} />,
    Entertainment: <Film size={18} />,
    Shopping: <ShoppingBag size={18} />,
    Bills: <DollarSign size={18} />,
    Healthcare: <Heart size={18} />,
    Salary: <Briefcase size={18} />,
    Freelance: <Gift size={18} />,
    Investment: <DollarSign size={18} />,
    Gift: <Gift size={18} />,
    Other: <DollarSign size={18} />,
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">💰 My Expense Tracker</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="summary-card expense-card">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Expense</h3>
            <p className="amount">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
        <div
          className={`summary-card balance-card ${
            balance >= 0 ? "positive" : "negative"
          }`}
        >
          <div className="card-icon">⚖️</div>
          <div className="card-content">
            <h3>Balance</h3>
            <p className="amount">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>
                🌱 You haven’t added anything yet.  
                Let’s start tracking your money!
              </p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-info">
                  <h4 className="transaction-title">
                    {categoryIcons[transaction.category]} {transaction.title}
                  </h4>
                  <p className="transaction-category">{transaction.category}</p>
                </div>
                <div className="transaction-details">
                  <p
                    className={`transaction-amount ${transaction.type}`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <p className="transaction-date">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Add New Transaction</h3>
              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              {/* Type */}
              <div className="form-group">
                <label>Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={handleInputChange}
                    />
                    <span>Expense</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={handleInputChange}
                    />
                    <span>Income</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Lunch, Salary, Coffee"
                  required
                />
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {formData.type === "expense" ? (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Bills">Bills</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Gift">Gift</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
