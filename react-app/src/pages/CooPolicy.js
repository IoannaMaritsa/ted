import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import '../css/help.css';


export default function CooPolicy() {
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
            src="/back-icon.png" // Replace with your icon path
            alt="Back"
            className="back-icon"
            onClick={handleBackClick}
          />
        </div>
        <div className="help-main-container">
          <h2>Θέλουμε το CareerHive να αντικατοπτρίζει την καλύτερη εκδοχή της επαγγελματικής ζωής</h2>
          <p>Αυτή είναι μια κοινότητα όπου αντιμετωπίζουμε ο ένας τον άλλον με σεβασμό και βοηθάμε ο ένας τον άλλον να πετύχει.</p>
          <br></br>
          <div className="community-frame">
            <div className="community-box">
              <h5>Μείνετε ασφαλείς</h5>
              <h6>Ξεκινήστε μόνο ασφαλείς συνομιλίες στο CareerHive.</h6>
            </div>
            <div className="community-box">
              <h5>Να είστε αξιόπιστοι</h5>
              <h6>Χρησιμοποιήστε την πραγματική σας ταυτότητα και μοιραστείτε πληροφορίες που είναι πραγματικές και αυθεντικές.</h6>
            </div>
            <div className="community-box">
              <h5>Να είστε επαγγελματίες</h5>
              <h6>Επιτρέπουμε ευρείες συζητήσεις για τον κόσμο της εργασίας, αλλά απλώς κρατήστε τον επαγγελματικό.</h6>
            </div>
          </div>
          <h2>Επαγγελματικές κοινοτικές πολιτικές του CareerHive</h2>
          <p>Σας ευχαριστούμε που χρησιμοποιείτε το CareerHive, όπου οι επαγγελματίες του κόσμου συγκεντρώνονται για να βρουν θέσεις εργασίας, να παραμείνουν ενημερωμένοι, να μάθουν νέες δεξιότητες και να δημιουργήσουν παραγωγικές σχέσεις. Το περιεχόμενο που συνεισφέρετε θα πρέπει να προστεθεί στην κοινότητα του CareerHive με εποικοδομητικό τρόπο.</p>
          <ol>
            <li>Πείτε μας εάν βλέπετε καταχρηστικό περιεχόμενο</li>
            <li>Μην δημοσιεύετε παρενοχλητικό περιεχόμενο</li>
            <li>Μην απειλείτε, υποκινείτε ή προωθείτε τη βία</li>
            <li>Μην μοιράζεστε υλικό που απεικονίζει την εκμετάλλευση παιδιών</li>
            <li>Μην προωθείτε, πουλάτε ή επιχειρείτε να αγοράσετε παράνομα ή επικίνδυνα αγαθά ή υπηρεσίες.</li>
            <li>Μην κοινοποιείτε περιεχόμενο που προωθεί επικίνδυνους οργανισμούς ή άτομα.</li>
          </ol>
          <div className="split-page">
            <img src="/danger.png" alt="icon1" className="icon" />
            <p style={{ marginLeft: '20px', fontStyle: 'italic' }}>Η παραβίαση των πολιτικών της κοινότητάς μας μπορεί να οδηγήσει σε ενέργειες κατά του λογαριασμού ή του περιεχομένου σας</p>
          </div>

        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
