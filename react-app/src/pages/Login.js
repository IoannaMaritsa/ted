import React, { useState } from 'react';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const { logIn, isLoggedIn } = useAppContext();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await logIn(email, password);
            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            console.log("token", decoded)
            if(decoded.role === "user") {
            navigate('/epaggelmatias_homepage'); 
            }// Use navigate for redirection
            else if (decoded.role === "admin") {
                navigate('/admin'); 
            }
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login">
            <main className="login-main-div">
                <div className="logo-container">
                <a href={isLoggedIn ? '/epaggelmatias_homepage' : '/'}>
                    <img src="logo.png" alt="Logo" className="logo" />
                </a>
                </div>
                <div className="login-box">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                            <input
                                type="text"
                                id="first"
                                name="first"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group password-group">
                            <img src="password-icon.png" alt="Password Icon" className="input-icon" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Κωδικός"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <img
                                src="/eye-icon.png"
                                alt="Toggle visibility"
                                onClick={togglePasswordVisibility}
                                className="password-toggle-icon"
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div className="wrap">
                            <button type="submit" className="button-login">
                                Σύνδεση
                            </button>
                        </div>
                        <div className="signup-prompt">
                            <span>Δεν είστε μέλος? </span> <a href="/register">Εγγραφείτε τώρα</a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
