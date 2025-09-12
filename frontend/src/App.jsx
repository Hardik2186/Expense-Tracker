import { useState } from "react";
import Navbar from './component/Navbar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
// // You can add Profile page later if needed
// import Profile from './pages/Profile'

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleLogout = () => {
    alert("Logged out!");
    // You can redirect or clear auth data here
  };

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
