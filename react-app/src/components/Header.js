import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = ({ variant }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    // Check authentication status on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally verify token and fetch user info from an API
      // For now, we just set as logged in if the token exists
      setIsLoggedIn(true);
      // Fetch user data from API if needed
      // Example: fetchUserData(token).then(data => setUser(data));
    }
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <a href={isLoggedIn ? '/epaggelmatias_homepage' : '/'}>
          <img src="/logo.png" alt="icon" className="header-icon" />
        </a>
      </div>
      <div className="header-right">
        {!isLoggedIn ? (
          <div className="header-button-container">
            <a href="/login">
              <button className="button-primary">Σύνδεση</button>
            </a>
            <a href="/register">
              <button className="button-secondary">Εγγραφή</button>
            </a>
          </div>
        ) : (
          <>
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
                    <div className="dropdown-name">User Name</div>
                    <div className="dropdown-email">user@example.com</div>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="sign-out-button">
                    Sign Out
                    <img src="/logout.png" alt="Log Out Icon" className="logout-icon" />
                  </button>
                </div>
              </div>
            )}
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
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
