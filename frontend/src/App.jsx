import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getMe, logout } from "./redux/slices/authSlice.js";

import Navbar from './component/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ExpenseTrackerAuth from './pages/ExpenseTrackerAuth';
import FinancialAnalytics from "./pages/FinancialAnalytics";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getMe()); // fetch logged-in user on app load
    }
  }, [dispatch, user]);

  if (loading) return <div>Loading...</div>;

  // Protect routes for logged-in users
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/auth" />;
  };

  // Redirect authenticated users away from auth page
  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/dashboard" /> : children;
  };

  return (
    <Router>
      {user && <Navbar onLogout={() => dispatch(logout())} />}
      <Routes>
        {/* Auth Page */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <ExpenseTrackerAuth />
            </PublicRoute>
          } 
        />

        {/* Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Transactions */}
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />

        {/* Financial Analytics */}
        <Route 
          path="/analytics" 
          element={
            <PrivateRoute>
              <FinancialAnalytics />
            </PrivateRoute>
          } 
        />

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;
