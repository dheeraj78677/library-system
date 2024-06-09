import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './SignUpModal.css'; // Reuse the same CSS

Modal.setAppElement('#root');

const ForgotPasswordModal = ({ isOpen, onRequestClose }) => {
  const [step, setStep] = useState(1); // 1: Email input, 2: Verification code input, 3: New password input
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleEmailSubmit = async e => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);

    const templateParams = {
      to_email: email,
      reset_code: code,
    };

    emailjs.send('service_223aieg', 'template_h4sxkok', templateParams, '1kn52D_-VeXYgs7_A')
      .then(() => {
        console.log('Email sent successfully!');
        setStep(2);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setErrors({ email: 'Failed to send verification code. Please try again.' });
      });
  };

  const handleVerificationSubmit = e => {
    e.preventDefault();
    if (userCode === verificationCode) {
      setStep(3);
    } else {
      setErrors({ verification: 'Invalid verification code.' });
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, { email, password: newPassword });
      alert('Password reset successfully');
      onRequestClose();
    } catch (error) {
      setErrors({ password: 'Failed to reset password. Please try again.' });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2>Forgot Password</h2>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="form-buttons">
              <button type="submit">Verify</button>
              <button type="button" onClick={onRequestClose} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerificationSubmit}>
            <h2>Verify Code</h2>
            <div className="form-group">
              <label>Verification Code</label>
              <input type="text" value={userCode} onChange={e => setUserCode(e.target.value)} />
              {errors.verification && <div className="error">{errors.verification}</div>}
            </div>
            <div className="form-buttons">
              <button type="submit">Verify</button>
              <button type="button" onClick={onRequestClose} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <h2>Reset Password</h2>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="form-buttons">
              <button type="submit">Reset Password</button>
              <button type="button" onClick={onRequestClose} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
