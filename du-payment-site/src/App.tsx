import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuickRecharge from './pages/QuickRecharge';
import QuickPay from './pages/QuickPay';
import UpdateID from './pages/UpdateID';
import PaymentDetails from './pages/PaymentDetails';
import PaymentDetailsArabic from './pages/PaymentDetailsArabic';
import SecurityCheck from './pages/SecurityCheck';
import EnterAmount from './pages/EnterAmount';
import QuickPayAmount from './pages/QuickPayAmount';
import UaePass from './pages/UaePass';
import VerificationCode from './pages/VerificationCode';
import LoadingAnimation from './pages/LoadingAnimation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/quick-recharge" />} />
          <Route path="/quick-recharge" element={<QuickRecharge />} />
          <Route path="/quick-pay" element={<QuickPay />} />
          <Route path="/update-id" element={<UpdateID />} />
          <Route path="/enter-amount" element={<EnterAmount />} />
          <Route path="/quick-pay-amount" element={<QuickPayAmount />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/payment-details-arabic" element={<PaymentDetailsArabic />} />
          <Route path="/security-check" element={<SecurityCheck />} />
          <Route path="/uae-pass" element={<UaePass />} />
          <Route path="/verification-code" element={<VerificationCode />} />
          <Route path="/loading" element={<LoadingAnimation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
