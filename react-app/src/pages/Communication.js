import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import useScrollToTop from '../hooks/useScrollToTop';
import '../css/help.css';

export default function Communication() {
  useScrollToTop();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here (e.g., send data to a server)
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div>
        <Header variant="homepage" />
        <h1>Επικοινωνήστε μαζί μας</h1>
        <div className="help-split">
            <div className='communication-box'>
            <h2>Φόρμα επικοινωνίας</h2>
            {formSubmitted && <p className="success-message">Thank you for your message!</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <img src="default-avatar.jpeg" alt="Email Icon" className="input-icon" />
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Όνομα'
                        required
                    />
                </div>
                <div className="form-group">
                    <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        required
                    />
                </div>

                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder='Μήνυμα'
                        required
                    ></textarea>

                <button type="submit" className="button-login">
                    Αποστολή
                </button>
            </form>
            </div>
            <div className='article-container'>
                <div className='article-text'>
                    <h2>Μπορείτε να μας βρείτε στην διεύθυνση</h2>
                    <p>Σωκράτους 26Β</p>
                    <p>Ώρες Λειτουργίας: 11:00 - 20:00</p>
                    <p>Για περισσότερες πληροφορίες καλέστε στο 210 1010 101</p>
                </div>
            </div>
        </div>
        <MainBottom />
        <Footer />
    </div>
  );
}