import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/EnterAmount.css';

const EnterAmount: React.FC = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';
  const serviceType = location.state?.serviceType || 'DU QUICK RECHARGE';

  const handlePaymentMethod = () => {
    // No data storage as per user preference
    navigate('/payment-details-arabic', { 
      state: { 
        amount: amount,
        phoneNumber: phoneNumber,
        serviceType: serviceType
      } 
    });
  };

  return (
    <div className="enter-amount-container">
      <div className="header">
        <div className="tabs">
          <div className="tab active">Pay</div>
          <div className="tab">Account</div>
        </div>
      </div>

      <div className="content">
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
          <p className="amount-note">Enter a value between 1 AED and 30000 AED.</p>
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
  );
};

export default EnterAmount;
