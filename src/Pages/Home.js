import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import EditProfileModal from '../components/EditProfileModal';
import ResetPasswordModal from '../components/ResetPasswordModal';
import BookList from '../components/BookList';

const Home = () => {
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
    <div>
       {!userInfo && (
        <Navbar
          isLoggedIn={!!userInfo}
          onLogout={handleLogout}
          onEditProfile={openEditProfileModal}
          onResetPassword={openResetPasswordModal}
          openLoginModal={openLoginModal}
          openSignupModal={openSignupModal}
        />
      )}
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} setUserInfo={setUserInfo} />
      <SignUpModal isOpen={signupModalIsOpen} onRequestClose={closeSignupModal} />
      <EditProfileModal isOpen={editProfileModalIsOpen} onRequestClose={closeEditProfileModal} userInfo={userInfo} setUserInfo={setUserInfo} />
      <ResetPasswordModal isOpen={resetPasswordModalIsOpen} onRequestClose={closeResetPasswordModal} userInfo={userInfo} />
      <Banner />
      <div>
        <h1 style={{ textAlign: 'center' }}>Explore our book collection</h1>
        <BookList booksPerPage={12} /> {/* 12 books per page, 3 books per row, 4 rows */}
      </div>
    </div>
  );
  
};

export default Home;
