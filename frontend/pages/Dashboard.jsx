import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function Dashboard({ user }) {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [goalsRes, accountsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/goals`, config),
        axios.get(`${API_BASE_URL}/accounts`, config)
      ]);

      setGoals(goalsRes.data);
      setAccounts(accountsRes.data);

      // Calculate totals
      const saved = goalsRes.data.reduce((sum, goal) => sum + goal.accumulated, 0);
      const target = goalsRes.data.reduce((sum, goal) => sum + goal.target, 0);
      setTotalSaved(saved);
      setTotalTarget(target);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getProgress = (goal) => {
    return goal.target > 0 ? (goal.accumulated / goal.target) * 100 : 0;
  };

  if (loading) {
    return <div className="card"><p>Loading dashboard...</p></div>;
  }

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Dashboard Overview</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>Total Saved</p>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>${totalSaved.toFixed(2)}</h3>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>Total Target</p>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>${totalTarget.toFixed(2)}</h3>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>Active Goals</p>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>{goals.length}</h3>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>Linked Accounts</p>
            <h3 style={{ margin: 0, fontSize: '2rem' }}>{accounts.length}</h3>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Your Goals</h2>
        
        {goals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            No goals yet. Create your first goal to get started!
          </p>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal._id} className="goal-card">
                <div className="goal-header">
                  <h3 className="goal-name">{goal.name}</h3>
                  <span className="goal-category">{goal.category}</span>
                </div>

                {goal.description && (
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {goal.description}
                  </p>
                )}

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min(getProgress(goal), 100)}%` }}
                  ></div>
                </div>

                <div className="goal-stats">
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Saved</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#667eea' }}>
                      ${goal.accumulated.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Target</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${goal.target.toFixed(2)}</p>
                  </div>
                </div>

                <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                  {getProgress(goal).toFixed(1)}% Complete
                </p>

                <div className="goal-actions">
                  <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                    Deposit
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
