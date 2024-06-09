import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import './Navbar.css';

const Navbar = () => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);

  const openSignupModal = () => setSignupModalIsOpen(true);
  const closeSignupModal = () => setSignupModalIsOpen(false);

  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      <button className="navbar-button" onClick={openLoginModal}>Login</button>
      <button className="navbar-button" onClick={openSignupModal}>Sign Up</button>
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} setUserInfo={setUserInfo} />
      <SignUpModal isOpen={signupModalIsOpen} onRequestClose={closeSignupModal} />
    </div>
  );
};

export default Navbar;
