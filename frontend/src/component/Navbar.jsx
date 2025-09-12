import React, { useState } from 'react';
import "../styles/Navbar.css"

const Navbar = ({ currentPage = 'dashboard', onPageChange, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      description: 'Overview & Summary'
    },
    {
      id: 'transactions',
      name: 'Transactions',
      icon: '💸',
      description: 'All your transactions'
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: '👤',
      description: 'Account settings'
    }
  ];

  const handleMenuClick = (pageId) => {
    if (onPageChange) {
      onPageChange(pageId);
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left side - Menu button and Logo */}
          <div className="navbar-left">
            <button 
              className="menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isSidebarOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            
            <div className="navbar-logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">ExpenseTracker</span>
            </div>
          </div>

          {/* Right side - User info and Logout */}
          <div className="navbar-right">
            
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
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
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <div className="sidebar-item-icon">{item.icon}</div>
              <div className="sidebar-item-content">
                <span className="sidebar-item-name">{item.name}</span>
                <span className="sidebar-item-desc">{item.description}</span>
              </div>
              {currentPage === item.id && (
                <div className="active-indicator">
                  <span>●</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">👤</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">John Doe</span>
              <span className="sidebar-user-email">john@example.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;