import React from "react"
<<<<<<< HEAD
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/home-page.css';
=======
import Header from '../components/Header'
import Footer from '../components/Footer'
import MainBottom from '../components/MainBottom'
>>>>>>> c885ba18d742b87288595ca22db4b3cb9c4a3588

export default function HomePage() {
  return(
    <div>
<<<<<<< HEAD
      <Header />
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
          <p className="large-text">Βρες πλήρως καταρτισμένο επαγγελματικό δυναμικό.</p>
        </div>
        <div className="image-section">
          <img src="/handshake-business.jpg" alt="Right Section" className="right-image" />
        </div>
      </div>
      <div className="split-page">
        <div className="image-section">
          <img src="/business-digital.jpg" alt="Right Section" className="right-image" />
        </div>
        <div className="text-section">
          <p className="large-text">Επικοινώνησε με άλλους επαγγελματίες.</p>
        </div>
      </div>
=======
      <Header variant="homepage" />
      <text> hello there..</text>
>>>>>>> c885ba18d742b87288595ca22db4b3cb9c4a3588
      <MainBottom />
      <Footer />
    </div>
  )
}
