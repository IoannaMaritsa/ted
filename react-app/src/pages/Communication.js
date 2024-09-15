import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import '../css/help.css';

export default function Communication() {
  useScrollToTop();


  return (
    <div>
      <Header variant="homepage" />

      <div className="help-main-section">
        <h1 style={{ textAlign: 'left' }}>Επικοινωνήστε μαζί μας</h1>
        <div className='help-main-container'>
            <h2>Μπορείτε να μας βρείτε στην διεύθυνση</h2>
            <p>25η Μαρτίου 32</p>
            <b>Ώρες Λειτουργίας: </b>
            <p>Δευτέρα-Τετάρτη-Παρασκευή: 09:00 - 15:00</p>
            <p>Τρίτη-Πέμπτη: 09:00 - 20:00</p>
            <p>Σάββατο-Κυριακή: Κλειστά</p>
            <br></br>
            <p style={{ fontStyle:'italic' }}>Για περισσότερες πληροφορίες καλέστε στο 210 1010 101</p>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  );
}