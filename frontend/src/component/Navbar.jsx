import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../styles/Navbar.css"

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Overview & Summary', path: '/dashboard' },
    { id: 'transactions', name: 'Transactions', icon: '💸', description: 'All your transactions', path: '/transactions' },
    { id: 'analytics', name: 'Data analysis', icon: '👤', description: 'Data of your Expenses', path: '/analytics' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
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
            <button 
              className="logout-btn"
              onClick={() => navigate('/auth')}
              aria-label="Logout"
            >
              <span className="logout-text">Logout</span>
            </button>
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
          {menuItems.map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.path)}
              >
                <div className="sidebar-item-icon">{item.icon}</div>
                <div className="sidebar-item-content">
                  <span className="sidebar-item-name">{item.name}</span>
                  <span className="sidebar-item-desc">{item.description}</span>
                </div>
                {isActive && <div className="active-indicator"><span>●</span></div>}
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">👤</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'Guest'}</span>
              <span className="sidebar-user-email">{user?.email || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;
