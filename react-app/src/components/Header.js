import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
              src="/default-avatar.jpeg" 
              className="profile-picture2" 
              alt="Profile" 
              onClick={handleProfileClick}
            />
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-content">
                  <img 
                    src="/default-avatar.jpeg" 
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
                    <img src="/logout.png" alt="Log Out Icon" className='logout-icon'></img>
                  </button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        {variant === 'professional' && (
          <div className="tabs">
          <NavLink exact to="/epaggelmatias_homepage" activeClassName="active-tab" className="tab">
            Αρχική Σελίδα
          </NavLink>
          <NavLink to="/epaggelmatias_network" activeClassName="active-tab" className="tab">
            Δίκτυο
          </NavLink>
          <NavLink to="/epaggelmatias_aggelies" activeClassName="active-tab" className="tab">
            Αγγελίες
          </NavLink>
          <NavLink to="/epaggelmatias_messages" activeClassName="active-tab" className="tab">
            Συζητήσεις
          </NavLink>
          <NavLink to="/epaggelmatias_notifications" activeClassName="active-tab" className="tab">
            Ειδοποιήσεις
          </NavLink>
          <NavLink to="/epaggelmatias_personal_info" activeClassName="active-tab" className="tab">
            Προσωπικά στοιχεία
          </NavLink>
          <NavLink to="/epaggelmatias_settings" activeClassName="active-tab" className="tab">
            Ρυθμίσεις
          </NavLink>
        </div>
        )}
        {/* logo-only variant */}
      </div>
    </header>
  );
};

export default Header;
