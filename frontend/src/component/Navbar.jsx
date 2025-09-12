import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getMe } from '../redux/slices/authSlice';
import "../styles/Navbar.css";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ currentPage = 'dashboard', onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Overview & Summary' , path: '/dashboard'
    },
    { id: 'transactions', name: 'Transactions', icon: '💸', description: 'All your transactions', path: '/transactions' },
    { id: 'data', name: 'Data analysis', icon: '👤', description: 'Data of your Expenses', path: '/analytics' }
  ];

  useEffect(() => {
    if (!user) dispatch(getMe());
  }, [dispatch, user]);

  const handleMenuClick = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button 
              className="menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isSidebarOpen ? 'active' : ''}`}>
                <span></span><span></span><span></span>
              </span>
            </button>
            
            <div className="navbar-logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">ExpenseTracker</span>
            </div>
          </div>

          <div className="navbar-right">
            {user && (
              <button 
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navigation</h3>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <div className="sidebar-item-icon">{item.icon}</div>
              <div className="sidebar-item-content">
                <span className="sidebar-item-name">{item.name}</span>
                <span className="sidebar-item-desc">{item.description}</span>
              </div>
              {currentPage === item.id && <div className="active-indicator"><span>●</span></div>}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">👤</div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-email">{user.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;
