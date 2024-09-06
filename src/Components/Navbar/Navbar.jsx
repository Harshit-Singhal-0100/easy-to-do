import React, { useState } from 'react';
import './Navbar.css';
import logo from './logo.jpg'; // Importing the logo

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" /> {/* Using the imported logo */}
        </div>
        <div className="navbar-title">Easy to Notes</div>
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {/* Login and Sign Up buttons removed */}
          <button className="search-toggle" onClick={toggleMenu}>
            <span className="search-icon"></span>
          </button>
        </div>
        <div className={`search-bar ${isMenuOpen ? 'active' : ''}`}>
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
