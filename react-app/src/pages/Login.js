import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'
import '../css/login.css'

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    return (
        <div className="login">

            <main className="login-main-div">
                <div className="logo-container">
                    <a href='/'>
                        <img src="logo.png" alt="Logo" className="logo" />
                    </a>
                </div>
                <div className="login-box">
                    <form className="form" action="">
                        <div className="form-group">
                            <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                            <input type="text"
                                id="first"
                                name="first"
                                placeholder="Email" required />
                        </div>
                        <div className="form-group password-group">
                            <img src="password-icon.png" alt="Email Icon" className="input-icon" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Κωδικός"
                                required
                            />
                            <img
                                src="/eye-icon.png"  // Path to your eye icon image
                                alt="Toggle visibility"
                                onClick={togglePasswordVisibility}
                                className="password-toggle-icon"
                            />
                        </div>
                        <div class="wrap">
                            <button type="submit" className="button-login"
                                onclick="solve()">
                                Σύνδεση
                            </button>
                        </div>
                        <div className="signup-prompt">
                            <span>Δεν είστε μέλος; </span>   <a href="/register">Εγγραφείτε τώρα</a>
                        </div>
                    </form>
                </div>
            </main >
        </div >
    )
}