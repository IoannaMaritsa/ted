import React, { useState } from 'react';
import { loginUser } from '../api';
import '../css/login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        try {
            await loginUser(email, password);
            // Redirect or show success message
            window.location.href = '/epaggelmatias_homepage'; // Redirect to a protected route or dashboard
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        }
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
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                            <input type="text"
                                id="first"
                                name="first"
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group password-group">
                            <img src="password-icon.png" alt="Email Icon" className="input-icon" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Κωδικός"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <img
                                src="/eye-icon.png"  // Path to your eye icon image
                                alt="Toggle visibility"
                                onClick={togglePasswordVisibility}
                                className="password-toggle-icon"
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div class="wrap">
                            <button type="submit" className="button-login">
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