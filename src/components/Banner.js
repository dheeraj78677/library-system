import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignupModal from './SignUpModal';
import './Banner.css';

const Banner = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Welcome to RMIT Library</h1>
        <p>Explore a world of knowledge at your fingertips.</p>
        <div className="banner-buttons">
          <Link to="/login">
            <button className="banner-button banner-button-primary">Login</button>
          </Link>
          <button className="banner-button banner-button-secondary" onClick={openModal}>Sign Up</button>
        </div>
      </div>
      <SignupModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
};

export default Banner;
