import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import EditProfileModal from './EditProfileModal';
import ResetPasswordModal from './ResetPasswordModal';
import './Navbar.css';

const Navbar = () => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const [resetPasswordModalIsOpen, setResetPasswordModalIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);

  const openSignupModal = () => setSignupModalIsOpen(true);
  const closeSignupModal = () => setSignupModalIsOpen(false);

  const openEditProfileModal = () => setEditProfileModalIsOpen(true);
  const closeEditProfileModal = () => setEditProfileModalIsOpen(false);

  const openResetPasswordModal = () => setResetPasswordModalIsOpen(true);
  const closeResetPasswordModal = () => setResetPasswordModalIsOpen(false);

  const handleLogout = () => {
    setUserInfo(null);
  };

  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      {userInfo ? (
        <>
          <button className="navbar-button" onClick={openEditProfileModal}>Edit Profile</button>
          <button className="navbar-button" onClick={openResetPasswordModal}>Reset Password</button>
          <button className="navbar-button" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button className="navbar-button" onClick={openLoginModal}>Login</button>
          <button className="navbar-button" onClick={openSignupModal}>Sign Up</button>
        </>
      )}
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} setUserInfo={setUserInfo} />
      <SignUpModal isOpen={signupModalIsOpen} onRequestClose={closeSignupModal} />
      <EditProfileModal isOpen={editProfileModalIsOpen} onRequestClose={closeEditProfileModal} userInfo={userInfo} setUserInfo={setUserInfo} />
      <ResetPasswordModal isOpen={resetPasswordModalIsOpen} onRequestClose={closeResetPasswordModal} userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
