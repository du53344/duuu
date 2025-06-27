import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/QuickPayAmount.css';

const QuickPayAmount: React.FC = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '0588656655';

  const handlePaymentMethod = () => {
    // No data storage as per user preference
    navigate('/payment-details-arabic', { 
      state: { 
        amount: amount,
        phoneNumber: phoneNumber,
        serviceType: 'DU QUICK PAY'
      } 
    });
  };

  const handleChangeAccount = () => {
    navigate('/quick-pay');
  };

  return (
    <div className="quick-pay-amount-container">
      <div className="header">
        <div className="logo-container">
          <div className="du-logo"></div>
        </div>
        <div className="header-icons">
          <div className="icon user-icon"></div>
          <div className="icon search-icon"></div>
          <div className="icon menu-icon"></div>
        </div>
      </div>

      <div className="content">
        <div className="account-section">
          <h2 className="section-title">Pay</h2>
          <div className="account-info">
            <span className="account-number">{phoneNumber}</span>
            <button className="change-button" onClick={handleChangeAccount}>Change</button>
            <span className="account-label">Account</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="amount-section">
          <h2 className="amount-title">How much do you want to pay?</h2>

          <div className="form-group">
            <input
              type="text"
              className="amount-input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="divider"></div>

          <div className="payment-section">
            <h3 className="payment-title">Payment</h3>
            <p className="payment-question">How would you like to pay?</p>

            <button className="bank-card-button" onClick={handlePaymentMethod}>
              Bank Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPayAmount;
