import React from 'react';
import { Link } from 'react-router-dom';
import { FaWallet, FaPlus, FaLink } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ totalSavings }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <FaWallet /> YUNG-S-KEBAB
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/add-goal" className="nav-link">
              <FaPlus /> New Goal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/link-account" className="nav-link">
              <FaLink /> Link Account
            </Link>
          </li>
        </ul>
        <div className="total-savings">
          Total Savings: ${totalSavings.toFixed(2)}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
