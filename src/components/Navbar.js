import React, { useState } from 'react';
import './Navbar.css';
import ManageUsersModal from './ManageUsersModal'; // Import the ManageUsersModal


const Navbar = ({ isLoggedIn,  onLogout, onEditProfile, onResetPassword, openLoginModal, openSignupModal,userInfo }) => {
  console.log('isLoggedIn ', isLoggedIn);
  console.log('userInfo ', userInfo);



  const [isManageUsersModalOpen, setIsManageUsersModalOpen] = useState(false);

  const openManageUsersModal = () => setIsManageUsersModalOpen(true);
  const closeManageUsersModal = () => setIsManageUsersModalOpen(false);
  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" className="navbar-logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <>
            <button className="navbar-button" onClick={onEditProfile}>Edit Profile</button>
            <button className="navbar-button" onClick={onResetPassword}>Reset Password</button>
            {userInfo.isadmin === 1 && (
              <button className="navbar-button" onClick={openManageUsersModal}>Manage Users</button>
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
      <ManageUsersModal isOpen={isManageUsersModalOpen} onRequestClose={closeManageUsersModal} />
    </div>
  );
};

export default Navbar;
