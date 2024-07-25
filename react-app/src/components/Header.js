import React from 'react';
import './Header.css'; // We will create this CSS file next

const Header = ({ variant }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="icon" className="header-icon" />
      </div>
      <div className="header-right">
        {variant === 'homepage' && (
          <div className="header-button-container">
            <a href="/login">
              <button className="button-primary">Σύνδεση</button>
            </a>
            <a href="/signup">
              <button className="button-secondary">Εγγραφή</button>
            </a>
          </div>
        )}
        {/*logo-only variant */}
      </div>
    </header>
  );
};

export default Header;