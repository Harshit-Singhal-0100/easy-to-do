import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/path-to-your-logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="navbar-title">My App</div>
        <div className="navbar-links">
          <button className="nav-button">Login</button>
          <button className="nav-button">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
