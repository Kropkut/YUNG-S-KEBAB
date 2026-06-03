import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const CATEGORIES = ['food', 'marriage', 'equipment', 'education', 'travel', 'home', 'other'];

function GoalsPage({ user }) {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target: '',
    category: 'other'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_BASE_URL}/goals`, config);
      setGoals(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        'user-id': user.id
      };

      await axios.post(`${API_BASE_URL}/goals`, {
        ...formData,
        target: parseFloat(formData.target)
      }, config);

      setFormData({ name: '', description: '', target: '', category: 'other' });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/goals/${goalId}`, config);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  };

  const getProgress = (goal) => {
    return goal.target > 0 ? (goal.accumulated / goal.target) * 100 : 0;
  };

  if (loading) {
    return <div className="card"><p>Loading goals...</p></div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>My Goals</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Create New Goal'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Create New Goal</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Summer Vacation"
                />
              </div>

              <div className="form-group">
                <label>Target Amount ($) *</label>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="5000"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us more about this goal..."
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Create Goal</button>
            </form>
          </div>
        )}
      </div>

      <div className="card">
        {goals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            No goals yet. Create your first goal to get started!
          </p>
        ) : (
          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal._id} className="goal-card">
                <div className="goal-header">
                  <div>
                    <h3 className="goal-name">{goal.name}</h3>
                    {goal.description && (
                      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <span className="goal-category">{goal.category}</span>
                </div>

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
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Progress</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{getProgress(goal).toFixed(1)}%</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Target</p>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${goal.target.toFixed(2)}</p>
                  </div>
                </div>

                <div className="goal-actions">
                  <button className="btn btn-primary">Deposit</button>
                  <button className="btn btn-secondary">Withdraw</button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteGoal(goal._id)}
                  >
                    Delete
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

export default GoalsPage;
