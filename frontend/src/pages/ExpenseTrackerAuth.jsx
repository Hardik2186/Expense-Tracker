
import React, { useState } from 'react';
import { DollarSign, Eye, EyeOff, Mail, Lock, User, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

import "../styles/ExpenseTrackerAuth.css"

const ExpenseTrackerAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple demo validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');
    console.log(isLogin ? 'Login' : 'Signup', formData);

    // Call parent login handler for demo
    if (isLogin) {
      // You can implement proper auth here
      onLogin(); 
    } else {
      // For signup demo, just log in after "signup"
      onLogin();
    }
  };

  const FloatingIcon = ({ icon: Icon, className, delay }) => (
    <div className={`floating-icon ${className}`} style={{ animationDelay: `${delay}s` }}>
      <Icon size={24} />
    </div>
  );

  return (
    <div className="auth-container">
      {/* Floating Icons */}
      <FloatingIcon icon={DollarSign} className="icon-1" delay={0} />
      <FloatingIcon icon={TrendingUp} className="icon-2" delay={1} />
      <FloatingIcon icon={PieChart} className="icon-3" delay={2} />
      <FloatingIcon icon={BarChart3} className="icon-4" delay={3} />
      <FloatingIcon icon={DollarSign} className="icon-5" delay={4} />

      <div className="auth-card">
        {/* Left Branding */}
        <div className="brand-side">
          <div className="brand-content">
            <div className="logo">
              <DollarSign size={40} />
              <h1>MoneyFlow</h1>
            </div>
            <h2>Track Every Penny,<br />Master Your Money</h2>
            <p>Join thousands of users who've taken control of their finances.</p>

            <div className="features">
              <div className="feature"><TrendingUp size={20} /><span>Smart Analytics</span></div>
              <div className="feature"><PieChart size={20} /><span>Visual Reports</span></div>
              <div className="feature"><BarChart3 size={20} /><span>Budget Goals</span></div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="form-side">
          <div className="form-header">
            <h3>{isLogin ? 'Welcome Back!' : 'Create Account'}</h3>
            <p>{isLogin ? 'Sign in to continue managing your expenses' : 'Start your financial journey today'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!isLogin && (
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="switch-mode">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="switch-btn">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrackerAuth;
