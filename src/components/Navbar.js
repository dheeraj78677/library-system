import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="RMIT Logo" />
      <h1 className="navbar-title">RMIT LIBRARY</h1>
      <Link to="/login">
        <button className="navbar-button">Login</button>
      </Link>
      <Link to="/signup">
        <button className="navbar-button">Sign Up</button>
      </Link>
    </div>
  );
};

export default Navbar;
