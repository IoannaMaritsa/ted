import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import '../css/help.css';

export default function Terms() {
  useScrollToTop();
  
  return(
    <div>
      <Header variant="homepage" />
      <div className="article-container">
      
      <div className="article-text">
        <h1>Όροι χρήσης</h1>
        <h2>Περιορισμοί Αναρτήσεων Εργασίας</h2>
        <p>Δεν πρέπει να:</p>
        <ol>
            <li>Δημοσιεύστε πληροφορίες που δεν σχετίζονται με την ανακοίνωση εργασίας.</li>
            <li>Δημοσιεύστε την περιγραφή θέσης εργασίας, εάν δεν είστε πραγματικός εργοδότης και δεν εκπροσωπείτε τον πραγματικό εργοδότη.</li>
            <li>Διεξαγωγή ή προώθηση ερευνών, διαγωνισμών, συστημάτων πυραμίδας ή αλυσιδωτών επιστολών.</li>
            <li>Διαφημίστε ή προσφέρετε να πουλήσετε ή να αγοράσετε οποιαδήποτε αγαθά ή υπηρεσίες για οποιονδήποτε επιχειρηματικό σκοπό.</li>
            <li>Δυσφήμηση, παρενόχληση, κατάχρηση, απειλή ή με άλλο τρόπο παραβίαση των νόμιμων δικαιωμάτων (όπως τα δικαιώματα της ιδιωτικής ζωής και της δημοσιότητας) άλλων.</li>
        </ol>
        <p>Το CareerHive δεν συναινεί στα</p>
        <ol>
            <li>Επαγγελματικές ευκαιρίες.</li>
            <li>Πολυεπίπεδο μάρκετινγκ (MLM).</li>
            <li>Μάρκετινγκ παραπομπής.</li>
            <li>Θέσεις που απαιτούν προκαταβολές (άμεσα ή έμμεσα).</li>
            <li>Πορνογραφία, περιεχόμενο για ενήλικες.</li>
        </ol>
        <div className="split-page">
          <img src="/danger.png" alt="icon1" className="icon" />
          <div className="text-section">
            <p>Η μη συμμόρφωση με οποιονδήποτε από αυτούς τους περιορισμούς θα αποτελέσει αιτία για τον τερματισμό του λογαριασμού σας στο CareerHive.
          Διατηρούμε το απόλυτο δικαίωμα, χωρίς να αιτιολογήσουμε, να αφαιρέσουμε οποιαδήποτε δημοσιευμένη πληροφορία (όπως η ανακοίνωση εργασίας) από το CareerHive.com για οποιονδήποτε λόγο και ανά πάσα στιγμή χωρίς προηγούμενη ειδοποίηση.</p>
          </div>
        </div>
      </div>
    </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
