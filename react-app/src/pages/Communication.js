import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import '../css/help.css';

export default function Communication() {
  useScrollToTop();

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <Header variant="homepage" />

      <div className="help-main-section">
        <div className="help-back-icon-container">
          <img
            src="/back-icon.png" 
            alt="Back"
            className="back-icon"
            onClick={handleBackClick}
          />
        </div>

        <div className='help-main-container'>
          <h1 style={{ textAlign: 'left' }}>Επικοινωνήστε μαζί μας</h1>
          <h2>Μπορείτε να μας βρείτε στην διεύθυνση</h2>
          <p>Ζωγράφου 161 22</p>
          <b>Ώρες Λειτουργίας: </b>
          <p>Δευτέρα-Τετάρτη-Παρασκευή: 09:00 - 15:00</p>
          <p>Τρίτη-Πέμπτη: 09:00 - 20:00</p>
          <p>Σάββατο-Κυριακή: Κλειστά</p>
          <br></br>
          <p style={{ fontStyle: 'italic' }}>Για περισσότερες πληροφορίες καλέστε στο 210 1010 101</p>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  );
}