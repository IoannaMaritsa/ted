import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import '../css/help.css';
import { useState } from 'react';

export default function Help() {
  useScrollToTop();

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  const [isVisible5, setIsVisible5] = useState(false);

  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isClicked4, setIsClicked4] = useState(false);
  const [isClicked5, setIsClicked5] = useState(false);

  const toggleVisibility1 = () => {
    setIsVisible1(!isVisible1);
  };

  const toggleVisibility2 = () => {
    setIsVisible2(!isVisible2);
  };

  const toggleVisibility3 = () => {
    setIsVisible3(!isVisible3);
  };

  const toggleVisibility4 = () => {
    setIsVisible4(!isVisible4);
  };

  const toggleVisibility5 = () => {
    setIsVisible5(!isVisible5);
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
  const toggleButtonColor4 = () => {
    toggleVisibility4();
    setIsClicked4(!isClicked4);
  };
  const toggleButtonColor5 = () => {
    toggleVisibility5();
    setIsClicked5(!isClicked5);
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
        <div className="help-main-container">
          <h1>Κέντρο Βοήθειας </h1>
          <div className="toggle-buttons">
            <div className={`toggle-button ${isClicked1 ? 'clicked' : ''}`}
              onClick={toggleButtonColor1}>Πως μπορώ να επεξεργαστώ τα προσωπικά μου στοιχεία;</div>
            {isVisible1 &&
              <div className="frame">
                <p>Αν θέλετε να επεξεργαστείτε τα προσωπικά σας στοιχεία σας, αρκεί να πλοηγηθείτε στην καρτέλα 'Προσωπικά στοιχεία' που βρίσκεται στην κορυφή της σελίδας σας αφού πρώτα έχετε συνδεθεί στον επαγγελματικό σας λογαριασμό. Εφόσον θέλετε να επεξεργαστείτε πληροφορίες σας που έχουν να κάνουν με την εικόνα προφίλ, το ονοματεπώνυμο, το επάγγελμα, τον εργασιακό χώρο, την τοποθεσία ή την ημερομηνία γέννησης σας, χρειάζεται να πατήσετε το κουμπί επεξεργασία προφίλ που βρίσκεται στο πάνω δεξιά πλαίσιο. Έπειτα θα χρειαστεί αφού επεξεργαστείτε τις αντίστοιχες πληροφορίες, να αποθηκεύσετε την τρέχουσα εκδοχή του προφίλ σας. </p>
                <p style={{ fontStyle: 'italic', color: 'red' }}>Προσοχή! Αν δεν κάνετε αποθήκευση τότε οι αλλαγές σας δεν θα αποθηκευτούν! </p>
                <p>Εάν επιθυμείτε να αλλάξετε το email ή τον κωδικό πρόσβασης που έχετε ορίσει κατά την δημιουργία του λογαριασμού σας, τότε θα χρειαστεί να πλοηγηθείτε στην καρτέλα των Ρυθμίσεων που βρίσκεται στην κορυφή της σελίδας και έπειτα να πατήσετε στον αντίστοιχο εικονίδιο επεξεργασίας που βρίσκεται στο δεξί μέρος του πλαισίου των στοιχείων σας. Αφού ακολουθήσετε τις αντίστοιχες οδηγίες του αναδυόμενου πλαισίου και εξεργαστείτε τα στοιχεία σας χρειάζεται να επιβεβαιώσετε ότι επιθυμείτε να οριστικοποιηθούν οι αλλαγές που κάνατε.</p>
                <p style={{ fontStyle: 'italic', color: 'red' }}> Προσοχή! Η μη επιβεβαίωση των αλλαγών σας συνάδει με την απόρριψη τους.</p>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked2 ? 'clicked' : ''}`}
              onClick={toggleButtonColor2}>Έναρξη συζήτησης με άλλον επαγγελματία</div>
            {isVisible2 &&
              <div className="frame">
                Προκειμένου να είστε σε θέση να ξεκινήσετε μία συζήτηση με έναν άλλο επαγγελματία θα πρέπει πρώτα να τον προσθέσετε στις συνδέσεις σας.
                <ol>
                  <li> Πλοηγηθείτε στην καρτέλα 'Δίκτυο', η οποία βρίσκεται στην κορυφή της σελίδας σας.</li>
                  <li>Αν ο επαγγελματίας με τον οποίο επιθυμείτε να ξεκινήσετε συζήτηση βρίσκεται ήδη στις συνδέσεις σας τότε επιλέξτε το κουμπί 'Προβολή προφίλ" που του αντιστοιχεί.</li>
                  <li>Εάν ο επαγγελματίας δεν βρίσκεται στις συνδέσεις σας τότε πλοηγηθείτε στην λίστα των μη συνδεδεμένων χρηστών και εφόσον εντοπίσετε το προφίλ του πατήστε το κουμπί 'Σύνδεση". Για να  προστεθεί ο χρήστες στην λίστα των συνδεδεμένων χρηστών σας θα πρέπει πρώτα να αποδεχθεί το αίτημά σας και έπειτα μπορείτε να κάνετε την διαδικασία που περιγράφει το Βήμα 2.</li>
                  <li>Στην σελίδα προφίλ του συγκεκριμένου χρήστη θα βρείτε το κουμπί 'Μήνυμα', πατώντας το οποίο θα βρεθείτε στην περιοχή των μηνυμάτων όπου θα έχετε την δυνατότητα να αλληλεπιδράσετε μαζί του.</li>
                </ol>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked3 ? 'clicked' : ''}`}
              onClick={toggleButtonColor3}>Πώς μπορώ να κάνω αίτηση για μια θέση εργασίας στο CareerHive;</div>
            {isVisible3 &&
              <div className="frame">
                <p>Πλοηγηθείτε στην καρτέλα 'Αγγελίες' που βρίσκεται στην κορυφή της σελίδας σας και έπειτα πατήστε πάνω στην επιλογή 'Αγγελίες άλλων' που βρίσκεται στο πρώτο κατακόρυφο μενού. Εκεί θα είστε σε θέση να περιηγηθείτε σε όλες τις αγγελίες που έχουν αναρτηθεί από συνδεδεμένους με εσάς χρήστες και μη. Αφού εντοπίσετε την
                  αγγελία εργασίας που σας ενδιαφέρει, επιλέξτε την και στο κάτω μέρος του πλαισίου με τις πληροφορίες σχετικά με την θέση εργασίας αυτή θα βρείτε το κουμπί 'Αίτηση'.</p>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked4 ? 'clicked' : ''}`}
              onClick={toggleButtonColor4}>Πως αναρτώ μία Αγγελία;</div>
            {isVisible4 &&
              <div className="frame">
                <p>Αν θέλετε να αναρτήσετε μία αγγελία, χρειάζεται πρώτα να συνδεθείτε στον επαγγελματικό σας λογαριασμό και έπειτα να πλοηγηθείτε στις καρτέλα με τις αγγελίες. Στο πρώτο κατακόρυφο μενού είναι απαραίτητο να επιλέξετε την επιλογή 'Αγγελίες μου' και έπειτα να σιγουρευτείτε ότι είναι επιλεγμένο το πλαίσιο '+ Νέα Αγγελία'. Αφού καταχωρίσετε όλες τις απαιτούμενες πληροφορίες σχετικά με την θέση εργασίας που επιθυμείτε να αναρτήσετε, πατήστε το κουμπί 'Καταχώριση'.</p>
                <p style={{ fontStyle: 'italic', color: 'red' }}>Προσοχή! Μη καταχώριση της Αγγελίας συνάδει με την απόρριψη της και συνεπώς δεν θα αποθηκευτεί.</p>
                Για να ελέγξετε τυχόν αιτήσεις προσλήψεων που έχουν καταχωρηθεί από άλλους χρήστες:
                <ol>
                  <li>Πλοηγηθείτε στις αγγελίες σας.</li>
                  <li>Εντοπίστε την αντίστοιχη αγγελία.</li>
                  <li>Κατεβείτε στο κάτω μέρος τις σελίδας στην περιοχή των αιτήσεων.</li>
                </ol>
              </div>}
            <br></br>
            <div className={`toggle-button ${isClicked5 ? 'clicked' : ''}`}
              onClick={toggleButtonColor5}>Πως αναρτώ ένα άρθρο;</div>
            {isVisible5 &&
              <div className="frame">
                Εάν επιθυμείτε να αναρτήσετε ένα άρθρο με το οποίο θα μπορούν να αλληλεπιδράσουν οι συνδεδεμένοι με εσάς επαγγελματίες αρκεί να:
                <ol>
                  <li>Πλοηγηθείτε στην 'Αρχική Σελίδα' στο πάνω μέρος τις οποίας θα βρείτε το πλαίσιο: 'Δημιουργία νέου άρθρου'.</li>
                  <li>Να δώσετε έναν τίτλο στο άρθρο σας.</li>
                  <li>Να περιγράψετε αναλυτικά το θέμα που σας απασχολεί και επισυνάψτε τυχόν αρχεία (εικόνες, βίντεο, αρχεία ήχου) που θα σας βοηθήσουν να επιχειρηματολογήσετε τις ιδέες σας. </li>
                  <li>Τέλος μη ξεχάσετε να πατήσετε το κουμπί Ανάρτηση.</li>
                </ol>
                <p style={{ fontStyle: 'italic', color: 'red' }}>Προσοχή! Μη ανάρτηση του άρθρου σας συνάδει με την απόρριψη του και συνεπώς δεν θα αποθηκευτεί.</p>
              </div>}

          </div>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
