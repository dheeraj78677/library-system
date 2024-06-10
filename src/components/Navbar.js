import React from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn,  onLogout, onEditProfile, onResetPassword, openLoginModal, openSignupModal,userInfo }) => {
  console.log('isLoggedIn ', isLoggedIn);
  console.log('userInfo ', userInfo);

 


  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" className="navbar-logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <button className="navbar-button" onClick={onEditProfile}>Edit Profile</button>
            <button className="navbar-button" onClick={onResetPassword}>Reset Password</button>
            {userInfo.isAdmin && (
              <button className="navbar-button" onClick={() => alert('Manage Users Clicked!')}>Manage Users</button>
            )}
            <button className="navbar-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="navbar-button" onClick={openLoginModal}>Login</button>
            <button className="navbar-button" onClick={openSignupModal}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
