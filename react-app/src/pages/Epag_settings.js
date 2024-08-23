import React, { useState } from 'react';
import Header from '../components/Header';
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/Epag_settings.css';

const Epag_settings = () => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
                        <span className="email">user@example.com</span>
                        <img src='/edit-yellow.png' alt='edit' className="big-icon" title="Edit Email" />

                    </div>

                    {/* Second Half */}
                    <div className="settings-half-section">

                        <span className="label">
                            <img src='/password-yellow.png' alt='password' className="icon" /> Password:
                        </span>
                        <span className="password">
                            {showPassword ? 'mySecret123!' : '********'}
                        </span>
                        <img src='/edit-yellow.png' alt='edit' className="big-icon" title="Edit Password" />
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
                    <button className='settings-button-secondary'>Ακύρωση</button>
                    <button className='settings-button-primary'>Αποθήκευση</button>
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_settings;