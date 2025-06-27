import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuickRecharge.css';

const QuickRecharge: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    // No data storage as per user preference
    navigate('/enter-amount', { 
      state: { 
        phoneNumber: mobileNumber,
        serviceType: 'DU QUICK RECHARGE'
      } 
    });
  };

  return (
    <div className="quick-recharge-container">
      <div className="header">
        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate('/quick-pay')}>Quick Pay</button>
          <button className="nav-button active">Quick Recharge</button>
          <button className="nav-button" onClick={() => navigate('/update-id')}>Update ID</button>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Quick Recharge</h1>
        <p className="subtitle">Recharge online</p>

        <div className="form-group">
          <input
            type="text"
            className="mobile-input"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <button className="next-button" onClick={handleNext}>
          Next
        </button>

        <div className="payment-methods">
          <h2 className="payment-title">We accept</h2>
          <div className="payment-icons">
            <div className="payment-icon visa"></div>
            <div className="payment-icon mastercard"></div>
            <div className="payment-icon amex"></div>
            <div className="payment-icon gpay"></div>
            <div className="payment-icon samsung-pay"></div>
          </div>
          <p className="payment-note">
            International and GCC/UAE issued cards are accepted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickRecharge;
