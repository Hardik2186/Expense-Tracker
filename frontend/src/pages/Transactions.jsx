
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Calendar,
  Filter,
  Search,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  X,
  Download,
  Edit3,
  Save,
} from "lucide-react";
import "../styles/Transactions.css";
import {
  fetchTransactions,
  deleteTransaction as deleteTransactionAction,
  updateTransaction,
} from "../redux/slices/transactionSlice.js";

const Transactions = () => {
  const dispatch = useDispatch();

  // Redux state
  const { transactions, loading, error } = useSelector((state) => state.transactions);

  // Local state
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    mode: "all",
    payee: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Icons mapping
  const categoryIcons = {
    Food: <Utensils size={18} />,
    Transport: <Car size={18} />,
    Entertainment: <Film size={18} />,
    Shopping: <ShoppingBag size={18} />,
    Bills: <DollarSign size={18} />,
    Healthcare: <Heart size={18} />,
    Salary: <Briefcase size={18} />,
    Freelance: <Gift size={18} />,
    Investment: <TrendingUp size={18} />,
    Gift: <Gift size={18} />,
    Travel: <Car size={18} />,
    Other: <DollarSign size={18} />,
  };

  const paymentModeIcons = {
    Cash: <Banknote size={16} />,
    UPI: <Smartphone size={16} />,
    Card: <CreditCard size={16} />,
    Online: <Smartphone size={16} />,
    "Bank Transfer": <Building2 size={16} />,
  };

  // Fetch transactions on mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Unique values for filters
  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];
  const uniqueModes = [...new Set(transactions.map((t) => t.mode))];
  const uniquePayees = [...new Set(transactions.map((t) => t.payee))];

  // All available categories and modes for editing
  const allCategories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Travel",
    "Other",
  ];
  const allModes = ["Cash", "UPI", "Card", "Online", "Bank Transfer"];

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !transaction.title.toLowerCase().includes(searchTerm) &&
          !transaction.payee.toLowerCase().includes(searchTerm) &&
          !(transaction.description || "").toLowerCase().includes(searchTerm)
        )
          return false;
      }
      // Type
      if (filters.type !== "all" && transaction.type !== filters.type) return false;
      // Category
      if (filters.category !== "all" && transaction.category !== filters.category) return false;
      // Mode
      if (filters.mode !== "all" && transaction.mode !== filters.mode) return false;
      // Payee
      if (filters.payee !== "all" && transaction.payee !== filters.payee) return false;
      // Date range
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        const daysDiff = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
        switch (filters.dateRange) {
          case "today":
            if (daysDiff !== 0) return false;
            break;
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
          case "year":
            if (daysDiff > 365) return false;
            break;
          default:
            break;
        }
      }
      return true;
    });
  }, [transactions, filters]);

  // Analytics
  const analytics = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpense;

    const payeeStats = {};
    filteredTransactions.forEach((t) => {
      if (!payeeStats[t.payee]) payeeStats[t.payee] = { income: 0, expense: 0, count: 0 };
      if (t.type === "income") payeeStats[t.payee].income += Math.abs(t.amount);
      else payeeStats[t.payee].expense += Math.abs(t.amount);
      payeeStats[t.payee].count += 1;
    });

    return { totalIncome, totalExpense, balance, totalTransactions: filteredTransactions.length, payeeStats };
  }, [filteredTransactions]);

  // Handlers
  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearAllFilters = () =>
    setFilters({ search: "", type: "all", category: "all", mode: "all", payee: "all", dateRange: "all" });
  const deleteTransaction = (id) => dispatch(deleteTransactionAction(id));
  const startEditing = (transaction) => {
    setEditingTransaction(transaction._id);
    setEditFormData({
      title: transaction.title,
      amount: Math.abs(transaction.amount),
      category: transaction.category,
      mode: transaction.mode,
      payee: transaction.payee,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date.slice(0, 10), // format for input[type=date]
    });
  };
  const cancelEditing = () => {
    setEditingTransaction(null);
    setEditFormData({});
  };
  const saveTransaction = () => {
    dispatch(
      updateTransaction({
        id: editingTransaction,
        updatedData: {
          ...editFormData,
          amount: editFormData.type === "expense" ? -Math.abs(editFormData.amount) : Math.abs(editFormData.amount),
        },
      })
    );
    cancelEditing();
  };
  const handleEditFormChange = (field, value) =>
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Math.abs(amount));
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const getActiveFiltersCount = () => Object.values(filters).filter((v) => v !== "all" && v !== "").length;

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="transactions-page">
      <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div className="header-left">
          <h1 className="page-title">💳 All Transactions</h1>
          <p className="page-subtitle">Manage and analyze your financial transactions</p>
        </div>
        <div className="header-actions">
          <button 
            className="export-btn"
            onClick={() => console.log('Export functionality')}
          >
            <Download size={18} />
            Export
          </button>
          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="filter-badge">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card income">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Income</span>
            <span className="stat-value">{formatCurrency(analytics.totalIncome)}</span>
          </div>
        </div>
        <div className="stat-card expense">
          <div className="stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Expense</span>
            <span className="stat-value">{formatCurrency(analytics.totalExpense)}</span>
          </div>
        </div>
        <div className={`stat-card balance ${analytics.balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Net Balance</span>
            <span className="stat-value">{formatCurrency(analytics.balance)}</span>
          </div>
        </div>
        <div className="stat-card count">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{analytics.totalTransactions}</span>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filter Transactions</h3>
            <div className="filters-actions">
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
              <button className="close-filters-btn" onClick={() => setShowFilters(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="filters-grid">
            {/* Search */}
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by title, payee, or description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <label>Transaction Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Payment Mode Filter */}
            <div className="filter-group">
              <label>Payment Mode</label>
              <select
                value={filters.mode}
                onChange={(e) => handleFilterChange('mode', e.target.value)}
              >
                <option value="all">All Modes</option>
                {uniqueModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            {/* Payee Filter */}
            <div className="filter-group">
              <label>Payee/Company</label>
              <select
                value={filters.payee}
                onChange={(e) => handleFilterChange('payee', e.target.value)}
              >
                <option value="all">All Payees</option>
                {uniquePayees.map(payee => (
                  <option key={payee} value={payee}>{payee}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="filter-group">
              <label>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Payee Analytics */}
      {filters.payee !== "all" && analytics.payeeStats[filters.payee] && (
        <div className="payee-analytics">
          <h3>Analytics for: {filters.payee}</h3>
          <div className="payee-stats">
            <div className="payee-stat income">
              <span className="label">Total Income</span>
              <span className="value">
                {formatCurrency(analytics.payeeStats[filters.payee].income)}
              </span>
            </div>
            <div className="payee-stat expense">
              <span className="label">Total Expense</span>
              <span className="value">
                {formatCurrency(analytics.payeeStats[filters.payee].expense)}
              </span>
            </div>
            <div className="payee-stat count">
              <span className="label">Total Transactions</span>
              <span className="value">
                {analytics.payeeStats[filters.payee].count}
              </span>
            </div>
            <div className="payee-stat net">
              <span className="label">Net Amount</span>
              <span className={`value ${(analytics.payeeStats[filters.payee].income - analytics.payeeStats[filters.payee].expense) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(analytics.payeeStats[filters.payee].income - analytics.payeeStats[filters.payee].expense)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="transactions-container">
        <div className="transactions-list-header">
          <h3>
            Transactions 
            <span className="count">({filteredTransactions.length})</span>
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h4>No transactions found</h4>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`transaction-card ${transaction.type}`}
              >
                <div className="transaction-main">
                  <div className="transaction-left">
                    <div className="transaction-icon">
                      {categoryIcons[transaction.category]}
                    </div>
                    <div className="transaction-info">
                      {editingTransaction === transaction.id ? (
                        // Edit Form
                        <div className="edit-form">
                          <div className="edit-form-row">
                            <input
                              type="text"
                              placeholder="Transaction title"
                              value={editFormData.title || ''}
                              onChange={(e) => handleEditFormChange('title', e.target.value)}
                              className="edit-input title-input"
                            />
                            <input
                              type="number"
                              placeholder="Amount"
                              value={editFormData.amount || ''}
                              onChange={(e) => handleEditFormChange('amount', parseFloat(e.target.value) || 0)}
                              className="edit-input amount-input"
                            />
                          </div>
                          <div className="edit-form-row">
                            <select
                              value={editFormData.type || ''}
                              onChange={(e) => handleEditFormChange('type', e.target.value)}
                              className="edit-select"
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                            <select
                              value={editFormData.category || ''}
                              onChange={(e) => handleEditFormChange('category', e.target.value)}
                              className="edit-select"
                            >
                              {allCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div className="edit-form-row">
                            <input
                              type="text"
                              placeholder="Payee"
                              value={editFormData.payee || ''}
                              onChange={(e) => handleEditFormChange('payee', e.target.value)}
                              className="edit-input"
                            />
                            <select
                              value={editFormData.mode || ''}
                              onChange={(e) => handleEditFormChange('mode', e.target.value)}
                              className="edit-select"
                            >
                              {allModes.map(mode => (
                                <option key={mode} value={mode}>{mode}</option>
                              ))}
                            </select>
                          </div>
                          <div className="edit-form-row">
                            <input
                              type="date"
                              value={editFormData.date || ''}
                              onChange={(e) => handleEditFormChange('date', e.target.value)}
                              className="edit-input"
                            />
                          </div>
                          <div className="edit-form-row">
                            <textarea
                              placeholder="Description"
                              value={editFormData.description || ''}
                              onChange={(e) => handleEditFormChange('description', e.target.value)}
                              className="edit-textarea"
                              rows="2"
                            />
                          </div>
                        </div>
                      ) : (
                        // Normal View
                        <>
                          <h4 className="transaction-title">{transaction.title}</h4>
                          <p className="transaction-payee">
                            <Users size={14} />
                            {transaction.type === "expense" ? "Paid to" : "Received from"}: 
                            <strong>{transaction.payee}</strong>
                          </p>
                          <div className="transaction-meta">
                            <span className="transaction-category">
                              {transaction.category}
                            </span>
                            <span className="transaction-mode">
                              {paymentModeIcons[transaction.mode]} {transaction.mode}
                            </span>
                            <span className="transaction-date">
                              <Calendar size={12} /> {formatDate(transaction.date)}
                            </span>
                          </div>
                          {transaction.description && (
                            <p className="transaction-description">
                              {transaction.description}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="transaction-right">
                    <div className="transaction-amount-section">
                      <p className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === "expense" ? "-" : "+"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <div className="transaction-actions">
                        {editingTransaction === transaction.id ? (
                          <>
                            <button 
                              className="action-btn save-btn"
                              onClick={saveTransaction}
                              title="Save Changes"
                            >
                              <Save size={16} />
                            </button>
                            <button 
                              className="action-btn cancel-btn"
                              onClick={cancelEditing}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => setShowDeleteConfirm(transaction.id)}
                              title="Delete Transaction"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-content">
              <div className="delete-icon">
                <Trash2 size={48} />
              </div>
              <h3>Delete Transaction</h3>
              <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
              <div className="delete-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-btn"
                  onClick={() => deleteTransaction(showDeleteConfirm)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Transactions;
