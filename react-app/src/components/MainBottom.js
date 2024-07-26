import React from 'react';
import { Link } from 'react-router-dom'
import './MainBottom.css'; // We will create this CSS file next

const MainBottom = () => {
  return (
    <div className="main-bottom">
      <div className="column">
        <div className="image-row">
          <img src="/twitter.png" alt="icon1" className="icon" />
          <img src="/instagram.png" alt="icon2" className="icon" />
          <img src="/youtube.png" alt="icon3" className="icon" />
        </div>
      </div>
      <div className="column">
        <b>Γενικά</b>
        <p><Link to="/register" className="link">Εγγραφή</Link></p>
        <p><Link to="/help_center" className="link">Κέντρο Βοήθειας</Link></p>
        <p><Link to="/FAQ" className="link">FAQ</Link></p>
      </div>
      <div className="column">
        <b>Εταιρεία</b>
        <p><Link to="/about" className="link">About Us</Link></p>
        <p><Link to="/communication" className="link">Επικοινωνία</Link></p>
      </div>
      <div className="column">
        <b>Πληροφορίες</b>
        <p><Link to="/terms_and_conditions" className="link">Όροι και προϋποθέσεις</Link></p>
        <p><Link to="/privacy_policy" className="link">Πολιτική Απορρήτου</Link></p>
        <p><Link to="/community_policies" className="link">Οδηγίες κοινότητας</Link></p>
      </div>
    </div>
  );
};

export default MainBottom;