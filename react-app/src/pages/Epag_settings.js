import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/Epag_settings.css';

const Epag_settings = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);

    const [password, setPassword] = useState('mySecret123!');
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [email, setEmail] = useState('user@example.com');
    const [initialemail, setInitialEmail] = useState(email);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const openModal1 = () => {
        setIsModal1Open(true);
        setInitialEmail(email);
        console.log(initialemail);
    };

    const openModal2 = () => {
        setIsModal2Open(true);
    };

    const closeModal1 = () => {
        console.log(initialemail);
        setEmail(initialemail);
        setIsModal1Open(false);
    };

    const closeModal2 = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsModal2Open(false);
    };

    const handleModal1Click = (e) => {
        // Prevent closing the modal when clicking inside the modal content
        e.stopPropagation();
    };

    const handleModal2Click = (e) => {
        // Prevent closing the modal when clicking inside the modal content
        e.stopPropagation();
    };

    const handleSave1 = () => {
        console.log('Input Value Saved:', email);
        setInitialEmail(email);
        console.log(initialemail);
        closeModal1();
    };

    const handleSave2 = () => {
        console.log('Input Value Saved:', password);
        if (oldpassword === password && newpassword != '' && newpassword === confirmpassword) {
            setPassword(newpassword);
            closeModal2();
        } else if (oldpassword != password) {
            setError1('Πληκτρολογήστε σωστά τον παλιό κωδικό σας!')
        } else if (newpassword === '') {
            setError2('Πληκτρολογήστε έναν νέο κωδικό εισόδου!')
        } else if (newpassword != confirmpassword) {
            setError3('Ο κωδικός επιβεβαίωσης δεν ταιριάζει με τον νέο κωδικό!')
        }
        
    };

    const HandleSave = () => {
        //implement save
    }

    const HandleDiscard = () => {
        setEmail('user@example.com');
        setPassword('mySecret123!');
    }

    useEffect(() => {

        setEmail(initialemail || '');
    }, [initialemail]);

    useEffect(() => {
        setError1(false);
        setError2(false);
        setError3(false);
    }, [oldpassword, newpassword, confirmpassword]);

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="account-settings-page">
                <h2>Γενικές Ρυθμίσεις</h2>
                <div className="settings-main-section">
                    {/* First Half */}
                    <div className="settings-half-section">

                        <span className="label">
                            <img src='/email-yellow.png' alt='email' className="icon" /> Email:
                        </span>
                        <span className="email">{email}</span>
                        <img src='/edit-yellow.png' alt='edit' className="big-icon" title="Edit Email" onClick={openModal1} />

                    </div>

                    {/* Second Half */}
                    <div className="settings-half-section">

                        <span className="label">
                            <img src='/password-yellow.png' alt='password' className="icon" /> Password:
                        </span>
                        <span className="password">
                            {showPassword ? password : '*'.repeat(password.length)}
                        </span>
                        <img src='/edit-yellow.png' alt='edit' className="big-icon" title="Edit Password" onClick={openModal2} />
                        {showPassword ? (
                            <img
                                src='/eye-hide-yellow.png'
                                alt='eyeslash'
                                className="big-icon"
                                onClick={toggleShowPassword}
                                title="Hide Password"
                            />
                        ) : (
                            <img
                                src='/eye-yellow.png'
                                alt='eye'
                                className="big-icon"
                                onClick={toggleShowPassword}
                                title="Show Password"
                            />
                        )}

                    </div>
                </div>
                <div className='settings-button-area'>
                    <button className='settings-button-secondary' onClick={HandleDiscard}>Ακύρωση</button>
                    <button className='settings-button-primary' onClick={HandleSave}>Αποθήκευση</button>
                </div>


                {/* Modals */}
                {isModal1Open && (
                    <div className="modal-overlay" onClick={closeModal1}>
                        <div className="modal-content" onClick={handleModal1Click}>
                            <h2>Επεξεργασία Διεύθυνσης Ηλ. Αλληλογραφίας Επαγγελματία</h2>
                            <br></br>
                            <div className="job-input-group">
                                <label htmlFor="title">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    placeholder={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='settings-button-area'>
                                <button onClick={closeModal1} className='modal-button-close'>Κλείσιμο</button>
                                <button onClick={handleSave1} className="modal-button-confirm">Επιβεβαίωση</button>
                            </div>
                        </div>
                    </div>
                )}

                {isModal2Open && (
                    <div className="modal-overlay" onClick={closeModal2}>
                        <div className="modal-content" onClick={handleModal2Click}>
                            <h2>Επεξεργασία Κωδικού Εισόδου Επαγγελματία</h2>
                            <br></br>
                            <div className="job-input-group">
                                <label htmlFor="password">Προηγούμενος Κωδικός</label>
                                <input
                                    type="text"
                                    value={oldpassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            {error1 && (
                                <div className='modal-error-message'>
                                    {error1}
                                </div>
                            )}
                            <div className="job-input-group">
                                <label htmlFor="password">Νέος Κωδικός</label>
                                <input
                                    type="text"
                                    value={newpassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            {error2 && (
                                <div className='modal-error-message'>
                                    {error2}
                                </div>
                            )}
                            <div className="job-input-group">
                                <label htmlFor="password">Επιβεβαίωση κωδικού</label>
                                <input
                                    type="text"
                                    value={confirmpassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {error3 && (
                                <div className='modal-error-message'>
                                    {error3}
                                </div>
                            )}
                            <div className='settings-button-area'>
                                <button onClick={closeModal2} className='modal-button-close'>Κλείσιμο</button>
                                <button onClick={handleSave2} className="modal-button-confirm">Επιβεβαίωση</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_settings;