import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './SignUpModal.css';

Modal.setAppElement('#root');

const ResetPasswordModal = ({ isOpen, onRequestClose, userInfo }) => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');

  const validate = () => {
    let tempErrors = {};
    tempErrors.oldPassword = formData.oldPassword ? "" : "Old Password is required.";
    tempErrors.newPassword = formData.newPassword ? formData.newPassword.length > 6 ? /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.newPassword) ? "" : "Password must include at least one digit and one special character." : "Password must be more than 6 characters." : "Password is required.";

    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);

      const templateParams = {
        to_name: userInfo.firstName,
        to_email: userInfo.email,
        verification_code: code,
      };

      emailjs.send('service_223aieg', 'template_bdtvmfp', templateParams, '1kn52D_-VeXYgs7_A')
        .then(() => {
          console.log('Email sent successfully!');
          setIsVerificationModalOpen(true);
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
        });
    }
  };

  const handleVerificationSubmit = async e => {
    e.preventDefault();
    if (userCode === verificationCode) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, { email: userInfo.email, oldPassword: formData.oldPassword, newPassword: formData.newPassword });
        alert('Password reset successfully');
        setIsVerificationModalOpen(false);
        onRequestClose();
      } catch (error) {
        console.error('Error verifying code:', error);
        alert('Failed to reset password.');
      }
    } else {
      alert('Invalid verification code.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Old Password</label>
            <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
            {errors.oldPassword && <div className="error">{errors.oldPassword}</div>}
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
          </div>
          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onRequestClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isVerificationModalOpen} onRequestClose={() => setIsVerificationModalOpen(false)} className="modal" overlayClassName="overlay">
        <h2>Verify Your Email</h2>
        <form onSubmit={handleVerificationSubmit}>
          <div className="form-group">
            <label>Verification Code</label>
            <input type="text" value={userCode} onChange={e => setUserCode(e.target.value)} />
          </div>
          <div className="form-buttons">
            <button type="submit">Verify</button>
            <button type="button" onClick={() => setIsVerificationModalOpen(false)} className="cancel-button">Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
