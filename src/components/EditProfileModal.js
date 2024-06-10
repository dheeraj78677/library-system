import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import './SignUpModal.css';

Modal.setAppElement('#root');

const EditProfileModal = ({ isOpen, onRequestClose, userInfo, setUserInfo }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  const [errors, setErrors] = useState({});
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');

  useEffect(() => {
    if (userInfo) {
      setFormData(userInfo);
    }
  }, [userInfo]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.firstName = formData.firstName ? "" : "First Name is required.";
    tempErrors.lastName = formData.lastName ? "" : "Last Name is required.";
    tempErrors.email = formData.email ? (/^[^@\s]+@[^@\s]+\.[^@\s]+$/).test(formData.email) ? "" : "Email is not valid." : "Email is required.";
    tempErrors.username = formData.username ? formData.username.length > 6 ? "" : "Username must be more than 6 characters." : "Username is required.";   

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
        to_name: formData.firstName,
        to_email: formData.email,
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
        await axios.post(`${process.env.REACT_APP_API_URL}/update-profile`, formData);
        setUserInfo(formData);
        alert('Profile updated successfully');
        setIsVerificationModalOpen(false);
        onRequestClose();
      } catch (error) {
        console.error('Error verifying code:', error);
        alert('Failed to update user data.');
      }
    } else {
      alert('Invalid verification code.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <div className="error">{errors.firstName}</div>}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <div className="error">{errors.username}</div>}
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

export default EditProfileModal;
