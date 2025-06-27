import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuickPay.css';

const QuickPay: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    // No data storage as per user preference
    navigate('/quick-pay-amount', { state: { phoneNumber: mobileNumber } });
  };

  return (
    <div className="quick-pay-container">
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

      <div className="nav-buttons">
        <button className="nav-button active">Quick Pay</button>
        <button className="nav-button" onClick={() => navigate('/quick-recharge')}>Quick Recharge</button>
        <button className="nav-button" onClick={() => navigate('/update-id')}>Update ID</button>
      </div>

      <div className="content">
        <h1 className="title">Quick Pay</h1>
        <p className="subtitle">Pay your prepaid bills securely without the need to log in.</p>

        <div className="form-group">
          <input
            type="text"
            className="mobile-input"
            placeholder="Enter your mobile number or account number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            dir="ltr"
          />
        </div>

        <button className="next-button" onClick={handleNext}>
          Next
        </button>

        <div className="payment-methods">
          <h2 className="payment-title">Accepted Cards</h2>
          <div className="payment-icons">
            <div className="payment-icon visa"></div>
            <div className="payment-icon mastercard"></div>
            <div className="payment-icon amex"></div>
            <div className="payment-icon gpay"></div>
            <div className="payment-icon samsung-pay"></div>
          </div>
          <p className="payment-note">
            All Mastercard and Visa cards issued by GCC/UAE countries are accepted
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickPay;
