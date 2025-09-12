import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  deleteTransaction,
  updateTransaction,
  resetTransactionState,
} from "../redux/slices/transactionSlice";
import {
  ShoppingBag, Utensils, Car, Film, Heart, Briefcase, Gift,
  DollarSign, CreditCard, Smartphone, Building2, Banknote,
  Calendar, Filter, Search, Trash2, TrendingUp, TrendingDown,
  Users, BarChart3, X, Edit3, Save, Download
} from "lucide-react";
import "../styles/Transactions.css";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector((state) => state.transactions);

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

  useEffect(() => {
    dispatch(fetchTransactions());
    return () => {
      dispatch(resetTransactionState());
    };
  }, [dispatch]);

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

  // All available categories and modes for editing
  const allCategories = Object.keys(categoryIcons);
  const allModes = Object.keys(paymentModeIcons);

  // Unique filter values
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];
  const uniqueModes = [...new Set(transactions.map(t => t.mode))];
  const uniquePayees = [...new Set(transactions.map(t => t.payee))];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!transaction.title.toLowerCase().includes(searchTerm) &&
            !transaction.payee.toLowerCase().includes(searchTerm) &&
            !transaction.description.toLowerCase().includes(searchTerm)) return false;
      }
      if (filters.type !== "all" && transaction.type !== filters.type) return false;
      if (filters.category !== "all" && transaction.category !== filters.category) return false;
      if (filters.mode !== "all" && transaction.mode !== filters.mode) return false;
      if (filters.payee !== "all" && transaction.payee !== filters.payee) return false;

      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        const daysDiff = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
        switch (filters.dateRange) {
          case "today": if (daysDiff !== 0) return false; break;
          case "week": if (daysDiff > 7) return false; break;
          case "month": if (daysDiff > 30) return false; break;
          case "year": if (daysDiff > 365) return false; break;
          default: break;
        }
      }
      return true;
    });
  }, [transactions, filters]);

  // Analytics
  const analytics = useMemo(() => {
    const totalIncome = filteredTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalExpense = filteredTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpense;

    const payeeStats = {};
    filteredTransactions.forEach(t => {
      if (!payeeStats[t.payee]) payeeStats[t.payee] = { income: 0, expense: 0, count: 0 };
      if (t.type === "income") payeeStats[t.payee].income += Math.abs(t.amount);
      else payeeStats[t.payee].expense += Math.abs(t.amount);
      payeeStats[t.payee].count += 1;
    });

    return { totalIncome, totalExpense, balance, totalTransactions: filteredTransactions.length, payeeStats };
  }, [filteredTransactions]);

  // Handlers
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearAllFilters = () => setFilters({ search: "", type: "all", category: "all", mode: "all", payee: "all", dateRange: "all" });

  const handleDeleteTransaction = async (id) => {
    await dispatch(deleteTransaction(id));
    setShowDeleteConfirm(null);
  };

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
      date: transaction.date
    });
  };

  const cancelEditing = () => { setEditingTransaction(null); setEditFormData({}); };

  const saveTransactionHandler = async () => {
    await dispatch(updateTransaction({
      id: editingTransaction,
      updatedData: {
        ...editFormData,
        amount: editFormData.type === 'expense' ? -Math.abs(editFormData.amount) : Math.abs(editFormData.amount)
      }
    }));
    setEditingTransaction(null); setEditFormData({});
  };

  const handleEditFormChange = (field, value) => setEditFormData(prev => ({ ...prev, [field]: value }));

  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(amount));
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const getActiveFiltersCount = () => Object.values(filters).filter(value => value !== "all" && value !== "").length;

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="transactions-header">
        <div className="header-left">
          <h1 className="page-title">💳 All Transactions</h1>
          <p className="page-subtitle">Manage and analyze your financial transactions</p>
        </div>
        <div className="header-actions">
          <button className="export-btn"><Download size={18}/> Export</button>
          <button className={`filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18}/> Filters {getActiveFiltersCount() > 0 && <span className="filter-badge">{getActiveFiltersCount()}</span>}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card income"><TrendingUp size={24} /><div><span>Total Income</span><span>{formatCurrency(analytics.totalIncome)}</span></div></div>
        <div className="stat-card expense"><TrendingDown size={24} /><div><span>Total Expense</span><span>{formatCurrency(analytics.totalExpense)}</span></div></div>
        <div className={`stat-card balance ${analytics.balance >= 0 ? 'positive' : 'negative'}`}><BarChart3 size={24} /><div><span>Net Balance</span><span>{formatCurrency(analytics.balance)}</span></div></div>
        <div className="stat-card count"><Users size={24} /><div><span>Total Transactions</span><span>{analytics.totalTransactions}</span></div></div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          {/* same filter UI as before */}
        </div>
      )}

      {/* Transactions List */}
      <div className="transactions-container">
        {filteredTransactions.map((t) => (
          <div key={t._id} className={`transaction-card ${t.type}`}>
            <div className="transaction-main">
              <div className="transaction-left">
                <div className="transaction-icon">{categoryIcons[t.category]}</div>
                <div className="transaction-info">
                  {editingTransaction === t._id ? (
                    <div className="edit-form">
                      {/* Same edit form JSX */}
                    </div>
                  ) : (
                    <>
                      <h4>{t.title}</h4>
                      <p>{t.type === 'expense' ? 'Paid to' : 'Received from'}: {t.payee}</p>
                      <span>{t.category} | {t.mode} | {formatDate(t.date)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="transaction-right">
                <p className={`${t.type}`}>{t.type === 'expense' ? '-' : '+'}{formatCurrency(Math.abs(t.amount))}</p>
                <div>
                  {editingTransaction === t._id ? (
                    <>
                      <button onClick={saveTransactionHandler}><Save size={16}/></button>
                      <button onClick={cancelEditing}><X size={16}/></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(t)}><Edit3 size={16}/></button>
                      <button onClick={() => setShowDeleteConfirm(t._id)}><Trash2 size={16}/></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete Transaction?</h3>
            <button onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
            <button onClick={() => handleDeleteTransaction(showDeleteConfirm)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
