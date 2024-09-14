import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { getSignedUrl } from '../api';
import { useAppContext } from '../context/appContext';
import getImageUrl from '../hooks/getImageUrl';
import { jwtDecode } from 'jwt-decode';

const Header = ({ variant }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logOut, user } = useAppContext();
  const [adminUser, setAdminUser] = useState(null);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      console.log(token, isLoggedIn)
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === 'admin');
        if (isAdmin) {
          setAdminUser(decoded);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

  }, [isLoggedIn]);

  useEffect(() => {
    console.log("logg", isLoggedIn);
    console.log(localStorage.getItem('token'));
    console.log(user);

  }, []);


  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    logOut(); // Call the logOut function from context
    setShowDropdown(false); // Close dropdown on sign out
    navigate('/login'); // Use navigate for redirection
  };


  return (
    <header className="header">
      <div className="header-left">
        <a href={isLoggedIn ? (isAdmin ? '/admin' : '/epaggelmatias_homepage') : '/'}>
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
            {isAdmin ? (
              <div className="admin-tabs">
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
                        <div className="dropdown-admin">Admin</div>
                        <div className="dropdown-email">{adminUser?.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-footer">
                      <button className="sign-out-button" onClick={handleSignOut}>
                        Αποσύνδεση
                        <img src="/logout.png" alt="Log Out Icon" className="logout-icon" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
                <img
                  src={getImageUrl(user?.profilepic, "profilepics")}
                  className="profile-picture2"
                  alt="Profile"
                  onClick={handleProfileClick}
                />
                {showDropdown && (
                  <div className="dropdown">
                    <div className="dropdown-content">
                      <img
                        src={getImageUrl(user?.profilepic, "profilepics")}
                        alt="Profile Picture"
                        className="dropdown-profile-pic"
                      />
                      <div className="dropdown-info">
                        <div className="dropdown-name">{user?.name}</div>
                        <div className="dropdown-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-footer">
                      <button className="sign-out-button" onClick={handleSignOut}>
                        Αποσύνδεση
                        <img src="/logout.png" alt="Log Out Icon" className="logout-icon" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            )}

          </>
        )}
      </div>
    </header>
  );
};

export default Header;
