import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddGoal from './pages/AddGoal';
import ManageGoal from './pages/ManageGoal';
import LinkAccount from './pages/LinkAccount';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [goals, setGoals] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    // Fetch goals from API
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      setGoals(data);
      calculateTotalSavings(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const calculateTotalSavings = (goalsData) => {
    const total = goalsData.reduce((sum, goal) => sum + goal.accumulated, 0);
    setTotalSavings(total);
  };

  return (
    <Router>
      <div className="App">
        <Navigation totalSavings={totalSavings} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard goals={goals} />} />
            <Route path="/add-goal" element={<AddGoal onGoalAdded={fetchGoals} />} />
            <Route path="/goal/:id" element={<ManageGoal onUpdate={fetchGoals} />} />
            <Route path="/link-account" element={<LinkAccount />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
