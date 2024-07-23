import React from 'react';
import './Header.css'; // We will create this CSS file next

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="icon" className="header-icon" />
      </div>
      <div className="header-right">
        <button className="header-button">Button 1</button>
        <button className="header-button">Button 2</button>
      </div>
    </header>
  );
};

export default Header;