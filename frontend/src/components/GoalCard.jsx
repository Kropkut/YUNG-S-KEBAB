import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaMoneyBillWave, FaTrash } from 'react-icons/fa';
import './GoalCard.css';

function GoalCard({ goal, onDelete }) {
  const progressPercentage = (goal.accumulated / goal.target) * 100;

  return (
    <div className="goal-card">
      <div className="goal-header">
        <h3>{goal.name}</h3>
        <button className="delete-btn" onClick={() => onDelete(goal.id)}>
          <FaTrash />
        </button>
      </div>
      
      <p className="goal-description">{goal.description}</p>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="progress-text">
          ${goal.accumulated.toFixed(2)} / ${goal.target.toFixed(2)}
        </p>
      </div>

      <div className="goal-info">
        <p>Linked Account: {goal.linkedAccount?.accountName || 'None'}</p>
        <p>Available Balance: ${goal.linkedAccount?.balance || '0.00'}</p>
      </div>

      <div className="goal-actions">
        <Link to={`/goal/${goal.id}`} className="action-btn edit-btn">
          <FaEdit /> Manage
        </Link>
        <button className="action-btn deposit-btn">
          <FaMoneyBillWave /> Deposit
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
