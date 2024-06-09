import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './SignUpModal.css'; // Reusing the same CSS

Modal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, setUserInfo }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState('');

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
      axios.post('https://rmit-library-management/login', formData)
        .then(response => {
          if (response.data.success) {
            setUserInfo(response.data.user);
            onRequestClose();
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
    </Modal>
  );
};

export default LoginModal;
