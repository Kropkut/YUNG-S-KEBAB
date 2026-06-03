import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function LinkAccount() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'register', 'link'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [accountForm, setAccountForm] = useState({
    accountName: '',
    accountType: 'checking',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMode('link');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        'user-id': user.id
      };

      await axios.post(`${API_BASE_URL}/accounts`, accountForm, config);
      setAccountForm({
        accountName: '',
        accountType: 'checking',
        bankName: '',
        accountNumber: '',
        routingNumber: ''
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to link account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        {mode === 'login' && (
          <>
            <h2 className="card-title">Login</h2>
            {error && <div style={{ color: '#e74c3c', marginBottom: '1rem', padding: '1rem', background: '#fadbd8', borderRadius: '4px' }}>{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
              Don't have an account?{' '}
              <button 
                style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Register here
              </button>
            </p>
          </>
        )}

        {mode === 'register' && (
          <>
            <h2 className="card-title">Create Account</h2>
            {error && <div style={{ color: '#e74c3c', marginBottom: '1rem', padding: '1rem', background: '#fadbd8', borderRadius: '4px' }}>{error}</div>}
            
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
              Already have an account?{' '}
              <button 
                style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Login here
              </button>
            </p>
          </>
        )}

        {mode === 'link' && (
          <>
            <h2 className="card-title">Link Bank Account</h2>
            {error && <div style={{ color: '#e74c3c', marginBottom: '1rem', padding: '1rem', background: '#fadbd8', borderRadius: '4px' }}>{error}</div>}
            
            <form onSubmit={handleLinkAccount}>
              <div className="form-group">
                <label>Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={accountForm.accountName}
                  onChange={handleAccountChange}
                  required
                  placeholder="My Checking Account"
                />
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <select
                  name="accountType"
                  value={accountForm.accountType}
                  onChange={handleAccountChange}
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="money_market">Money Market</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={accountForm.bankName}
                  onChange={handleAccountChange}
                  required
                  placeholder="Bank of America"
                />
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={accountForm.accountNumber}
                  onChange={handleAccountChange}
                  required
                  placeholder="••••••••1234"
                />
              </div>

              <div className="form-group">
                <label>Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={accountForm.routingNumber}
                  onChange={handleAccountChange}
                  required
                  placeholder="021000021"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Linking account...' : 'Link Account'}
              </button>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              ✓ Your banking information is encrypted and secure
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LinkAccount;
