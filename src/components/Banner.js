import React, { useState } from 'react';
import SignupModal from './SignUpModal';
import LoginModal from './LoginModal';
import './Banner.css';

const Banner = () => {
  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const openSignupModal = () => setSignupModalIsOpen(true);
  const closeSignupModal = () => setSignupModalIsOpen(false);

  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Welcome to RMIT Library</h1>
        <p>Explore a world of knowledge at your fingertips.</p>
        <div className="banner-buttons">
          <button className="banner-button banner-button-primary" onClick={openLoginModal}>Login</button>
          <button className="banner-button banner-button-secondary" onClick={openSignupModal}>Sign Up</button>
        </div>
      </div>
      <SignupModal isOpen={signupModalIsOpen} onRequestClose={closeSignupModal} />
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} setUserInfo={setUserInfo} />
    </div>
  );
};

export default Banner;
