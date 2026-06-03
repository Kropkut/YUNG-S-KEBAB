import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoalCard from '../components/GoalCard';
import { FaPlus } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard({ goals }) {
  const [localGoals, setLocalGoals] = useState(goals);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    setLocalGoals(goals);
    calculateTotals(goals);
  }, [goals]);

  const calculateTotals = (goalsData) => {
    const total = goalsData.reduce((sum, goal) => sum + goal.accumulated, 0);
    setTotalSavings(total);
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await fetch(`/api/goals/${goalId}`, { method: 'DELETE' });
        const updatedGoals = localGoals.filter(goal => goal.id !== goalId);
        setLocalGoals(updatedGoals);
        calculateTotals(updatedGoals);
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Savings Goals</h1>
        <div className="total-savings-display">
          <h2>Total Savings</h2>
          <p className="total-amount">${totalSavings.toFixed(2)}</p>
        </div>
      </div>

      {localGoals.length === 0 ? (
        <div className="empty-state">
          <p>No savings goals yet. Start by creating one!</p>
          <Link to="/add-goal" className="add-goal-btn">
            <FaPlus /> Create Your First Goal
          </Link>
        </div>
      ) : (
        <div className="goals-grid">
          {localGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      <div className="dashboard-actions">
        <Link to="/add-goal" className="btn btn-primary">
          <FaPlus /> Add New Goal
        </Link>
        <Link to="/link-account" className="btn btn-secondary">
          Link Bank Account
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
