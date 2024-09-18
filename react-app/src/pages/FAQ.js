import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import '../css/help.css';
import { useState } from 'react';

export default function FAQ() {
  useScrollToTop();

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);

  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);

  const toggleVisibility1 = () => {
    setIsVisible1(!isVisible1);
  };

  const toggleVisibility2 = () => {
    setIsVisible2(!isVisible2);
  };

  const toggleVisibility3 = () => {
    setIsVisible3(!isVisible3);
  };


  const toggleButtonColor1 = () => {
    toggleVisibility1();
    setIsClicked1(!isClicked1);
  };
  const toggleButtonColor2 = () => {
    toggleVisibility2();
    setIsClicked2(!isClicked2);
  };
  const toggleButtonColor3 = () => {
    toggleVisibility3();
    setIsClicked3(!isClicked3);
  };

  return (
    <div>
      <Header variant="homepage" />
      <div className="help-main-section">
        <div className="help-back-icon-container">
          <img
            src="/back-icon.png" // Replace with your icon path
            alt="Back"
            className="back-icon"
            onClick={handleBackClick}
          />
        </div>
        <div className="help-main-container">
          <h1>FAQ</h1>
          <div className="toggle-buttons">
            <div className={`toggle-button ${isClicked1 ? 'clicked' : ''}`}
              onClick={toggleButtonColor1}>Τι είδους θέσεις εργασίας μπορώ να βρω στο CareerHive;</div>
            {isVisible1 &&
              <div className="frame">
                <p>Ανακαλύψτε μια ευρεία γκάμα ευκαιριών εργασίας στο CareerHive προσαρμοσμένες στις επαγγελματικές σας φιλοδοξίες. Από θέσεις στελεχών και μηχανικούς έως θέσεις επαγγελματιών νοσοκόμων και ρόλους προγραμματιστή, επιμελούμε καταχωρίσεις για θέσεις εργασίας με υψηλή αμοιβή που υπερβαίνουν τα 100.000 $ σε διάφορους κλάδους, όπως:</p>
                <li>Εργασίες Λογιστικής</li>
                <li>Εργασίες Οικονομικών</li>
                <li>Εργασίες Μηχανικού</li>
                <li>Θέσεις εργασίας στον τομέα της υγείας</li>
                <li>Θέσεις εργασίας στον τομέα της εστίασης</li>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked2 ? 'clicked' : ''}`}
              onClick={toggleButtonColor2}>Πόσο συχνά προστίθενται νέες λίστες θέσεων εργασίας στις αγγελίες;</div>
            {isVisible2 &&
              <div className="frame">
                <p>Καθημερινά προστίθενται νέες θέσεις εργασίας από τους εγγεγραμμένους με την σελίδα μας επαγγελματίες, γι' αυτό να επισκέπτεστε συχνά την σελίδα των αγγελιών για να βλέπετε τις νέες θέσεις εργασίας όταν αυτές δημοσιεύονται.</p>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked3 ? 'clicked' : ''}`}
              onClick={toggleButtonColor3}>Ποιες είναι οι αποτελεσματικές στρατηγικές για αναζήτηση εργασίας στελεχών;</div>
            {isVisible3 &&
              <div className="frame">
                <p>Η αναζήτηση εργασίας στελεχών απαιτεί έναν συνδυασμό εξατομικευμένων τακτικών αναζήτησης στελεχών, στρατηγικής δικτύωσης και αξιοποίησης των συνδέσεων του κλάδου. Ακολουθούν μερικές βασικές στρατηγικές:</p>
                <li><b>Δικτύωση στελεχών:</b> Το δίκτυό σας είναι η καθαρή σας αξία, ειδικά για θέσεις στελεχών. Συμμετέχετε σε εκδηλώσεις δικτύωσης στελεχών, συνέδρια του κλάδου και γίνετε ενεργό μέλος επαγγελματικών οργανώσεων που σχετίζονται με τον τομέα σας.</li>
                <li><b>Αξιοποιήστε το CareerHive:</b> Βελτιστοποιήστε το προφίλ σας στο CareerHive για να αναδείξετε τις εκτελεστικές δεξιότητες, τα προσόντα και τις εμπειρίες σας.</li>
                <li><b>Εταιρείες αναζήτησης στελεχών:</b> Συνεργαστείτε με αξιόπιστες εταιρείες αναζήτησης στελεχών που ειδικεύονται στον κλάδο σας. Μπορούν να σας προσφέρουν αποκλειστικές θέσεις εργασίας σε στελέχη και εξατομικευμένες υπηρεσίες τοποθέτησης.</li>
              </div>}
          </div>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
