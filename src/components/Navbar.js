import React from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onLogout, onEditProfile, onResetPassword, openLoginModal, openSignupModal }) => {
  // If isLoggedIn has a value, do not render the Navbar
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" className="navbar-logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      <div className="navbar-buttons"></div>
      <div className="navbar-buttons">
      {isLoggedIn && (
            <div>
            <button className="navbar-button" onClick={onEditProfile}>Edit Profile</button>
            <button className="navbar-button" onClick={onResetPassword}>Reset Password</button>
            <button className="navbar-button" onClick={onLogout}>Logout</button>
            </div>
             )}

      {!isLoggedIn && (
            <div>
             <button className="navbar-button" onClick={openLoginModal}>Login</button>
             <button className="navbar-button" onClick={openSignupModal}>Sign Up</button>
            </div>
       )}
            
      </div>
  
    </div>
  );
};

export default Navbar;
