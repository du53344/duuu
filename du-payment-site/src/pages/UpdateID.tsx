import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdateID.css';

const UpdateID: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="update-id-container">
      <div className="header">
        <div className="nav-buttons">
          <button 
            className="nav-button" 
            onClick={() => handleNavigation('/quick-pay')}
          >
            Quick Pay
          </button>
          <button 
            className="nav-button" 
            onClick={() => handleNavigation('/quick-recharge')}
          >
            Quick Recharge
          </button>
          <button 
            className="nav-button active"
          >
            Update ID
          </button>
        </div>
      </div>

      <div className="content">
        <h1 className="title">Update ID</h1>
        <p className="subtitle">Update your identification details</p>

        <div className="form-container">
          <div className="form-group">
            <label className="form-label">ID Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your ID number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-input"
            />
          </div>

          <button className="submit-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateID;
