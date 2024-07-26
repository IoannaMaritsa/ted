import React, { useState } from 'react';
import './Header.css'; // We will create this CSS file next

const Header = ({ variant }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    // Add sign-out logic here
    console.log('Sign out clicked');
  };

  return (
    <header className="header">
      <div className="header-left">
        <a href='/'>
          <img src="/logo.png" alt="icon" className="header-icon" />
        </a>
      </div>
      <div className="header-right">
        {variant === 'homepage' && (
          <div className="header-button-container">
            <a href="/login">
              <button className="button-primary">Σύνδεση</button>
            </a>
            <a href="/register">
              <button className="button-secondary">Εγγραφή</button>
            </a>
          </div>
        )}
        {variant === 'admin' && (
          <div className="header-button-container">
            <img 
              src="default-avatar.jpeg" 
              className="profile-picture" 
              alt="Profile" 
              onClick={handleProfileClick}
            />
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-content">
                  <img 
                    src="default-avatar.jpeg" 
                    alt="Profile Picture" 
                    className="dropdown-profile-pic" 
                  />
                  <div className="dropdown-info">
                    <div className="dropdown-name">Admin Name</div>
                    <div className="dropdown-email">admin@example.com</div>
                  </div>
                </div>
                <div className="dropdown-footer">
                <a href="/">
                  <button className="sign-out-button" onClick={handleSignOut}>
                    Sign Out
                    <img src="logout.png" alt="Log Out Icon" className='logout-icon'></img>
                  </button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        {/* logo-only variant */}
      </div>
    </header>
  );
};

export default Header;
