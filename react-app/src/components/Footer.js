import React from 'react';
import './Footer.css'; // We will create this CSS file next

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/logo3.png" alt="logo" className="footer-logo" />
        <span className="footer-text1">CareerHive © 2024. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;