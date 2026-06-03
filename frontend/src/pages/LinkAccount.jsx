import React, { useState } from 'react';
import './LinkAccount.css';

function LinkAccount() {
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'savings',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    cardType: 'debit',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [accountType, setAccountType] = useState('bank');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.accountName) {
      setError('Please enter an account name');
      setLoading(false);
      return;
    }

    try {
      const endpoint = accountType === 'bank' ? '/api/bank-accounts' : '/api/cards';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess('Account linked successfully!');
        setFormData({
          accountName: '',
          accountType: 'savings',
          bankName: '',
          accountNumber: '',
          routingNumber: '',
          cardType: 'debit',
          cardNumber: '',
          expiryDate: '',
          cvv: ''
        });
      } else {
        setError('Failed to link account');
      }
    } catch (err) {
      setError('Error linking account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-account-page">
      <h1>Link Bank Account or Card</h1>

      <div className="account-type-selector">
        <button
          className={`type-btn ${accountType === 'bank' ? 'active' : ''}`}
          onClick={() => setAccountType('bank')}
        >
          Bank Account
        </button>
        <button
          className={`type-btn ${accountType === 'card' ? 'active' : ''}`}
          onClick={() => setAccountType('card')}
        >
          Debit Card
        </button>
      </div>

      <form className="link-account-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="accountName">Account Nickname *</label>
          <input
            type="text"
            id="accountName"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            placeholder="e.g., My Savings Account"
            required
          />
        </div>

        {accountType === 'bank' ? (
          <>
            <div className="form-group">
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="money-market">Money Market</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bankName">Bank Name *</label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g., Chase Bank"
                required={accountType === 'bank'}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="accountNumber">Account Number *</label>
                <input
                  type="password"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  required={accountType === 'bank'}
                />
              </div>
              <div className="form-group">
                <label htmlFor="routingNumber">Routing Number *</label>
                <input
                  type="password"
                  id="routingNumber"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required={accountType === 'bank'}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="cardType">Card Type</label>
              <select
                id="cardType"
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input
                type="password"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="•••• •••• •••• ••••"
                maxLength="19"
                required={accountType === 'card'}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required={accountType === 'card'}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  maxLength="4"
                  required={accountType === 'card'}
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Linking...' : 'Link Account'}
        </button>
      </form>

      <div className="security-notice">
        <p><strong>🔒 Security Notice:</strong> Your financial information is encrypted and stored securely.</p>
      </div>
    </div>
  );
}

export default LinkAccount;
