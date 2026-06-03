import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LinkAccount from './pages/LinkAccount';
import GoalsPage from './pages/GoalsPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="navbar-logo">💰 Savings Hub</h1>
            {isAuthenticated && user && (
              <div className="navbar-menu">
                <span className="user-greeting">Welcome, {user.name}!</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/link-account" />} 
            />
            <Route 
              path="/link-account" 
              element={<LinkAccount />} 
            />
            <Route 
              path="/goals" 
              element={isAuthenticated ? <GoalsPage user={user} /> : <Navigate to="/link-account" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
