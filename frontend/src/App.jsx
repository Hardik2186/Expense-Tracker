import { useState } from "react";
import Navbar from './component/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ExpenseTrackerAuth from './pages/ExpenseTrackerAuth';
// import Profile later if needed
// import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    alert("Logged out!");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <ExpenseTrackerAuth onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        onLogout={handleLogout} 
      />

      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "transactions" && <Transactions />}
      {currentPage === "profile" && <Profile />}
    </>
  );
}

export default App;
