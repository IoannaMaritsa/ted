import React from 'react';
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
        <p>Εγγραφή</p>
        <p>Κέντρο Βοήθειας</p>
        <p>FAQ</p>
      </div>
      <div className="column">
        <b>Εταιρεία</b>
        <p>About Us</p>
        <p>Γιατί το CareerHive;</p>
        <p>Επικοινωνία</p>
      </div>
      <div className="column">
        <b>Πληροφορίες</b>
        <p>Όροι και προυποθέσεις</p>
        <p>Πολιτική Απορρήτου</p>
        <p>Πολιτική Cookies</p>
      </div>
    </div>
  );
};

export default MainBottom;