import React, { useState } from 'react';

import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, onEditProfile, onResetPassword, openLoginModal, openSignupModal }) => {
  console.log('isLoggedIn ',isLoggedIn);
  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      {isLoggedIn ? (
        <>
          <button className="navbar-button" onClick={onEditProfile}>Edit Profile</button>
          <button className="navbar-button" onClick={onResetPassword}>Reset Password</button>
          <button className="navbar-button" onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <button className="navbar-button" onClick={openLoginModal}>Login</button>
          <button className="navbar-button" onClick={openSignupModal}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
