import React from 'react';
import '../styles/LoadingAnimation.css';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle-inner"></div>
      </div>
      <h1 className="loading-text">Processing your request</h1>
      <p className="loading-subtext">Please wait while we verify your information</p>
    </div>
  );
};

export default LoadingAnimation;
