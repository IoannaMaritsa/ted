import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer'
import '../css/login.css'

export default function Login() {
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
                        <div className="form-group">
                            <img src="password-icon.png" alt="Password Icon" className="input-icon" />
                            <input type="password"
                                id="password"
                                name="password"
                                placeholder="Κωδικός" required />
                        </div>
                        <div class="wrap">
                            <button type="submit" className="button-login"
                                onclick="solve()">
                                Σύνδεση
                            </button>
                        </div>
                        <div className="signup-prompt">
                            <span>Δεν είστε μέλος; </span>   <a href="/signup">Εγγραφείτε τώρα</a>
                        </div>
                    </form>
                </div>
            </main >
        </div >
    )
}