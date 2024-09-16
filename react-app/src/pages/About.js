import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import '../css/help.css';

export default function About() {
  useScrollToTop();

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <Header variant="homepage" />
      <div className="help-secondary-section">
        <div className="help-back-icon-container">
          <img
            src="/back-icon.png" // Replace with your icon path
            alt="Back"
            className="back-icon"
            onClick={handleBackClick}
          />
        </div>
        <div className="help-main-container">
          <div className="split-page">
            <div className="about-text-section">
              <h1>Πληροφορίες για το CareerHive</h1>
              <p>Το CareerHive είναι ο κορυφαίος ιστότοπος θέσεων εργασίας στον κόσμο με περισσότερους από 800.000 μοναδικούς επισκέπτες.
                Το CareerHive δίνει προτεραιότητα στα άτομα που αναζητούν εργασία, παρέχοντάς τους δωρεάν πρόσβαση για την αναζήτηση θέσεων εργασίας, τη δημοσίευση βιογραφικών και τη διερεύνηση εταιρειών.
                Καθημερινά συνδέουμε εκατομμύρια άτομα με νέες ευκαιρίες.
              </p>
            </div>
            <div className="about-image-section">
              <img src="/about.png" alt="Right Section" className="image" />
            </div>
          </div>

          <div className="split-page">
            <div className="about-image-section">
              <img src="/businessleader.jpg" alt="Left Section" className="image" />
            </div>
            <div className="about-text-section">
              <h1>Η ηγεσία μας</h1>
              <p>
                Η ηγετική ομάδα της CareerHive είναι πολυποίκιλη, αφοσιωμένη και δεσμευμένη στην ενίσχυση των εργαζομένων μας για την εκπλήρωση της αποστολής μας: Να βοηθάμε τους ανθρώπους να βρίσκουν θέσεις εργασίας. Καλλιεργώντας ισχυρές σχέσεις και συνεργασία, εξυπηρετούν και υποστηρίζουν τα άτομα που αναζητούν εργασία, τους εργοδότες, την κοινωνία και τους εργαζομένους μας.
              </p>
            </div>
          </div>

          <div className="split-page">
            <div className="about-text-section">
              <h1>Οι δεσμεύσεις μας</h1>
              <p>
                Οι δεσμεύσεις μας περί περιβάλλοντος, κοινωνικών ζητημάτων και διακυβέρνησης (Environmental, Social & Governance – ESG) έχουν σκοπό να οδηγήσουν σε ένα εργασιακό μέλλον που θα είναι δίκαιο και χωρίς διακρίσεις. Ως ο κορυφαίος ιστότοπος θέσεων εργασίας στον κόσμο και η πρωταγωνιστική πλατφόρμα αντιστοιχίσεων και προσλήψεων, προσπαθούμε να δημιουργήσουμε έναν θετικό αντίκτυπο στην κοινωνία, συνδέοντας άτομα με καλύτερες δουλειές για τη βελτίωση της ζωής τους.
              </p>
            </div>
            <div className="about-image-section">
              <img src="/activist.jpg" alt="Right Section" className="image" />
            </div>
          </div>
        </div>
      </div>

      <MainBottom />
      <Footer />
    </div>
  )
}
