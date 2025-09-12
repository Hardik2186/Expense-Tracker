import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, Eye, EyeOff, Mail, Lock, User, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { login, register } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import "../styles/ExpenseTrackerAuth.css";

const ExpenseTrackerAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error: backendError } = useSelector(state => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard'); // Redirect after login/register
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');

    if (isLogin) {
      await dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      await dispatch(register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      }));
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
            {(error || backendError) && <p style={{ color: 'red', textAlign: 'center' }}>{error || backendError}</p>}

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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="divider"><span>or</span></div>

            <button type="button" className="google-btn">
              {/* Google Icon SVG */}
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
