import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/Epag_settings.css';
import { useAppContext } from '../context/appContext';
import '../css/popup.css';
import { checkPassword, updatePassword, updateEmail, getUser } from '../api';

const Epag_settings = () => {

    const { user, setUser } = useAppContext();
    const [showPassword, setShowPassword] = useState(false);

    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [isModal3Open, setIsModal3Open] = useState(false);

    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');


    const [password, setPassword] = useState('');
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [email, setEmail] = useState('');
    const [initialemail, setInitialEmail] = useState(email);


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

    const handleModalClick = (e) => {
        // Prevent closing the modal when clicking inside the modal content
        e.stopPropagation();
    };

    const handleSave1 = async () => {
        setErrorEmail('');  // Reset the error state
        try {
            if (email === user?.email) {
                setErrorEmail("Το email δεν έχει αλλάξει");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = emailRegex.test(email);

            if(!isEmailValid) {
                setErrorEmail("Εισάγετε έγκυρο email");
                return;
            }
            // Call the API to update email in the database

            const result = await updateEmail(user?.email, email);
            console.log("result",result);
            if (result) {
                // Update the user in the app context
                const updatedUser = { ...user, email };

                console.log("updated user",updatedUser);
                console.log("old user",user);
                console.log("set user valid", setUser);
                setUser(updatedUser);

                console.log("user", user);
                const newToken = result;
                console.log("new token2", newToken);
                localStorage.setItem('token', newToken);
    
                setInitialEmail(email);
                closeModal1();
            } else {
                setErrorEmail(result.message || "Η ενημέρωση του email απέτυχε.");
            }
        } catch (error) {
            console.error("Error saving email:", error);
            setErrorEmail("Παρουσιάστηκε σφάλμα κατά την ενημέρωση του email.");
        }
    }

    const handleSave2 = async () => {
        setError1('');
        setError2('');
        setError3('');

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        const isPasswordValid = passwordRegex.test(newpassword);


        // Check if the old password matches the one stored in the database
        const passwordCheck = await checkPassword(user?.email, oldpassword);
        console.log(passwordCheck)
        if (!passwordCheck || passwordCheck.error) {
            setError1('Πληκτρολογήστε σωστά τον παλιό κωδικό σας');
        } else if (newpassword === '') {
            setError2('Πληκτρολογήστε έναν νέο κωδικό εισόδου');
        } else if (!isPasswordValid) {
            setError2('Πληκτρολογήστε έγκυρο κωδικό εισόδου');
        } else if (newpassword === oldpassword) {
            setError2('Ο νέος κωδικός σας πρέπει να είναι διαφορετικός απο τον παλιό');
        } else if (confirmpassword === '') {
            setError3('Επιβεβαιώστε τον κωδικό σας');
        } else if (newpassword !== confirmpassword) {
            setError3('Ο κωδικός επιβεβαίωσης δεν ταιριάζει με τον νέο κωδικό');
        } else {
            setPassword(newpassword);
            const result = await updatePassword(user?.email, newpassword);
            console.log('Password updated:', newpassword);
            closeModal2();
        }

    };

    const HandleSave = () => {
        //implement save
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
                <div className="box-header">
                    <h1 className="title2">Ρυθμίσεις</h1>
                </div>
                <div className="settings-main-section">
                    {/* First Half */}
                    <div className="settings-half-section">

                        <div className="label12">
                            <img src='/email-icon.png' alt='email' className="icon12" /><span className='text12'>Email</span>
                            <span className="email15">{user?.email}</span>
                            <img src='/edit-yellow.png' alt='edit' className="big-icon15" title="Edit Email" onClick={openModal1} />
                        </div>


                    </div>

                    {/* Second Half */}
                    <div className="settings-half-section">

                        <div className="label12">
                            <img src='/password-icon.png' alt='password' className="icon12" /> <span className='text12'>Password</span>
                            <span className="email15">
                                *****************
                            </span>
                            <img src='/edit-yellow.png' alt='edit' className="big-icon15" title="Edit Password" onClick={openModal2} />
                        </div>


                    </div>
                </div>


                {/* Modals */}
                {isModal1Open && (
                    <div className="modal-overlay" onClick={closeModal1}>
                        <div className="add-work-experience-modal-content6" onClick={handleModalClick}>
                            <div className="add-work-experience-modal-header">
                                <div className="add-work-experience-modal-title">Επεξεργασία Προφίλ</div>
                                <img
                                    className="add-work-experience-modal-close-btn"
                                    src="/close-icon.png"
                                    onClick={closeModal1}
                                    alt="Close"
                                />
                            </div>
                            <div className="details-section2">

                                <div className="form-group2">
                                    <span className="span2" htmlFor="email">Email</span>
                                    <input
                                        id="email"
                                        name ="email"
                                        type="email"
                                        value={email}
                                        placeholder={user?.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            {errorEmail && (
                                        <div className='modal-error-message'>
                                            {errorEmail}
                                        </div>
                                    )}
                            <div className="add-work-experience-modal-footer">
                                <button onClick={handleSave1} >Αποθήκευση</button>
                            </div>
                        </div>
                    </div>
                )}

                {isModal2Open && (
                    <div className="modal-overlay" onClick={closeModal2}>
                        <div className="add-work-experience-modal-content5" onClick={handleModalClick}>
                            <div className="add-work-experience-modal-header">
                                <div className="add-work-experience-modal-title">Επεξεργασία Κωδικού</div>
                                <img
                                    className="add-work-experience-modal-close-btn"
                                    src="/close-icon.png"
                                    onClick={closeModal2}
                                    alt="Close"
                                />
                            </div>
                            <div className="add-work-experience-modal-body">
                                <div className="details-section2">

                                    <div className="form-group2">
                                        <span className="span2">Προηγούμενος Κωδικός</span>
                                        <input
                                            name ="oldpassword"
                                            id="oldpassword"
                                            type="password"
                                            value={oldpassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            placeholder="Εισάγετε τον παλιό σας κωδικό"
                                        />
                                    </div>


                                    {error1 && (
                                        <div className='modal-error-message'>
                                            {error1}
                                        </div>
                                    )}


                                    <div className="form-group2">
                                        <span className="span2" >Νέος Κωδικός</span>
                                        <input
                                            name="newpassword"
                                            id="newpassword"
                                            type="password"
                                            value={newpassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Εισάγετε νέο κωδικό"
                                        />
                                    </div>


                                    {error2 && (
                                        <div className='modal-error-message'>
                                            {error2}
                                        </div>
                                    )}


                                    <div className="form-group2">
                                        <span className="span2" htmlFor="confirmpassword"> Επιβεβαίωση Κωδικού</span>
                                        <input
                                            id ="confirmpassword"
                                            name="confirmpassword"
                                            type="password"
                                            value={confirmpassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Εισάγετε τον νέο κωδικό ξανά"
                                        />
                                    </div>


                                    {error3 && (
                                        <div className='modal-error-message'>
                                            {error3}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="add-work-experience-modal-footer">
                                <button onClick={handleSave2} >Αποθήκευση</button>
                            </div>
                        </div>
                    </div>
                )}

                {isModal3Open && (
                    <div className="modal-overlay" onClick={() => setIsModal3Open(false)}>
                        <div className="modal-content" onClick={handleModalClick}>
                            <h2>Είστε σίγουροι ότι θέλετε να προχωρήσετε;</h2>
                            <h3>Η αλλαγές σας θα αποθηκευτούν οριστικά.</h3>
                            <br></br>
                            <div className='settings-button-area'>
                                <button onClick={() => setIsModal3Open(false)} className='modal-button-close'>Όχι</button>
                                <button onClick={HandleSave} className="modal-button-confirm">Ναι</button>
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