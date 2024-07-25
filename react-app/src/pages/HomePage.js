import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/home-page.css';

export default function HomePage() {
  return(
    <div>
      <Header variant="homepage" />
      <div className="banner">
        <img src="/business-meeting.jpg" alt="Banner" className="banner-image" />
        <div className="banner-text">
          <h1>Ο Νο1 επαγγελματικός σου βοηθός</h1>
          <p>Γίνε και εσύ μέλος της κυψέλης</p>
          <br></br>
          <button className="button-primary">Εγγραφή τώρα</button>
        </div>
      </div>
      <div className="split-page">
        <div className="text-section">
          <h1>Κάθε μέλος μίας εταιρείας είναι σαν μια εργάτρια μέλισσα - σημαντικό και απαραίτητο για την επιτυχία.</h1>
          <p>Βρες καταρτισμένο προσωπικό για την δημιουργία μιας ισχυρής ομάδας.</p>
        </div>
        <div className="image-section">
          <img src="/business05.png" alt="Right Section" className="right-image" />
        </div>
      </div>
      <div className="split-page">
        <div className="image-section">
          <img src="/business04.png" alt="Left Section" className="right-image" />
        </div>
        <div className="text-section">
          <h1>Ήξερες ότι ένα μελίσσι μπορεί να έχει πάνω από 80.000 μέλισσες;</h1>
          <p>Το CareerHive αποτελεί δίκτυο πάνω από 800.000 επαγγελματιών.</p>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
