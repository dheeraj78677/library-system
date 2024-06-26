import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './SignUpModal.css'; // Reusing the same CSS
import ForgotPasswordModal from './ForgotPasswordModal'; // Import the new modal

Modal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, setUserInfo , isLoggedIn}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState('');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = formData.username ? "" : "Username is required.";
    tempErrors.password = formData.password ? "" : "Password is required.";
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
      axios.post('https://rmit-library-management.com/login', formData)
        .then(response => {
          if (response.data.success) {
            setUserInfo(response.data.user); // Set user info on successful login
            console.log('userInfo ', response.data.user);
            onRequestClose();
            isLoggedIn = true;
            console.log('is logged in ',isLoggedIn);
          } else {
            setErrors({ form: 'User does not exist or incorrect credentials.' });
          }
        })
        .catch(error => {
          console.error('Error logging in:', error);
          setErrors({ form: 'Server error, please try again later.' });
        });
       
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          {errors.form && <div className="error">{errors.form}</div>}
          <div className="form-buttons">
            <button type="submit">Login</button>
            <button type="button" onClick={onRequestClose} className="cancel-button">Cancel</button>
          </div>
        </form>
        <div className="forgot-password">
          <a href="#!" onClick={() => { setIsForgotPasswordModalOpen(true); onRequestClose(); }}>Forgot Password?</a>
        </div>
      </Modal>
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onRequestClose={() => setIsForgotPasswordModalOpen(false)}
      />
    </>
  );
};

export default LoginModal;
