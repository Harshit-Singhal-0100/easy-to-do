import React from 'react';
import './Navbar.css';
import logo from './logo.jpg'; // Importing the logo

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <div className="navbar-title">Easy to Notes</div>
      </div>
    </nav>
  );
};

export default Navbar;
