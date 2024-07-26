import React, { useState, useRef } from 'react';
import '../css/register.css'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css'

export default function Register() {

    const [dob, setDob] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dob: '',
        profilePhoto: null,
    });

    const [errors, setErrors] = useState({
        passwordMismatch: false,
        emailInvalid: false,
        passwordInvalid: false,
        phoneInvalid: false,
        dobInvalid: false
    });

    const fileInputRef = useRef(null);

    const handleDateChange = (dates) => {
        const selectedDate = dates[0];
        setFormData({ ...formData, dob: selectedDate });

        const today = new Date();
        const minAge = 18; // Minimum age requirement
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();

        if (age < minAge || (age === minAge && monthDiff < 0) || (age === minAge && monthDiff === 0 && dayDiff < 0)) {
            setErrors({ ...errors, dobInvalid: true });
        } else {
            setErrors({ ...errors, dobInvalid: false });
        }
    }; 

    const handleReset = () => {
        setFormData({ ...formData, profilePhoto: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input value
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profilePhoto: file });
        }
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            // Validate email on change
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailValid = emailRegex.test(value);
            setErrors({ ...errors, emailInvalid: !isEmailValid });
        }

        if (name === 'confirmPassword') {
            // Check for password mismatch
            setErrors({ ...errors, passwordMismatch: value !== formData.password });
        }

        if (name === 'password') {
            // Validate password on change
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            const isPasswordValid = passwordRegex.test(value);
            setErrors({ ...errors, passwordInvalid: !isPasswordValid });
        }

        if (name === 'phone') {
            // Validate phone number on change
            const phoneRegex = /^[0-9]{10}$/;
            const isPhoneValid = phoneRegex.test(value);
            setErrors({ ...errors, phoneInvalid: !isPhoneValid });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate email on submit
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(formData.email);

        if (!isEmailValid) {
            setErrors({ ...errors, emailInvalid: true });
            return;
        } else {
            setErrors({ ...errors, emailInvalid: false });
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ ...errors, passwordMismatch: true });
            return;
        }
        setErrors({ ...errors, passwordMismatch: false });

        // Handle form submission, including file upload
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });

        // Example form submission logic
        console.log('Form data to submit:', formDataToSubmit);

        // Perform submission here, e.g., using fetch or axios
    };


    return (
        <div className="register">

            <main className="register-main-div">
                <div className="logo-container">
                    <a href='/'>
                        <img src="logo.png" alt="Logo" className="logo" />
                    </a>
                </div>
                <div className="register-box">
                    <div className="register-title-box">
                        <h2 className="register-title">Δημιουργία Λογαριασμού</h2>
                    </div>
                    <div className="profile-picture-section">
                        <img
                            src={formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : 'default-avatar.jpeg'}
                            alt="Profile"
                            className="profile-picture"
                        />
                        <div className="file-upload-container">
                            <label htmlFor="profile-photo" className="file-upload-label">
                                {formData.profilePhoto ? formData.profilePhoto.name : 'Επιλέξτε Εικόνα Προφίλ'}
                            </label>
                            <input
                                type="file"
                                id="profile-photo"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </div>
                        {formData.profilePhoto && (
                            <img src="remove.png" alt='Remove Icon' className="remove-photo-icon"
                                onClick={handleReset} />
                        )}
                    </div>
                    <form className="form" action="" onSubmit={handleSubmit}>

                        <div className="form-row">
                            <div className="form-group form-group-half">
                                <img src="user.png" alt="User Icon" className="input-icon" />
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="first-name"
                                        placeholder="Όνομα"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group form-group-half">
                                <img src="user.png" alt="User Icon" className="input-icon" />
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="last-name"
                                        placeholder="Επώνυμο"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.emailInvalid && <div className='error-message-div'><span className="error-message">Εισάγετε έγκυρο email</span></div>}
                        <div className={`form-group ${errors.emailInvalid ? 'error' : ''}`}>
                            <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                            <input type="text"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange2}
                                required />

                        </div>
                        {errors.passwordInvalid &&
                            <div className="error-message-div"><span className="error-message">Ο κωδικός σας πρέπει να περιέχει τουλάχιστον 1 γράμμα και 1 ψηφίο και να έχει τουλάχιστον 8 χαρακτήρες</span></div>}
                        <div className={`form-group ${errors.passwordMismatch || errors.passwordInvalid ? 'error' : ''}`}>
                            <img src="password-icon.png" alt="Password Icon" className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Κωδικός"
                                value={formData.password}
                                onChange={handleChange2}
                                required
                            />

                        </div>
                        {errors.passwordMismatch && (
                            <div className="error-message-div"> <span className="error-message">Οι κωδικοί που έχετε εισάγει δεν ταιριάζουν</span> </div>
                        )}
                        <div className={`form-group ${errors.passwordMismatch ? 'error' : ''}`}>
                            <img src="again.png" alt="Redo Icon" className="input-icon" />
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                placeholder="Επιβεβαίωση Κωδικού"
                                value={formData.confirmPassword}
                                onChange={handleChange2}
                                required
                            />

                        </div>
                        {errors.phoneInvalid && (
                            <div className="error-message-div"> <span className="error-message">Εισάγετε έγκυρο αριθμό τηλεφώνου</span> </div>
                        )}
                        <div className={`form-group ${errors.phoneInvalid ? 'error' : ''}`}>
                            <img src="phone.png" alt="Phone Icon" className="input-icon" />
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Τηλέφωνο Επικοινωνίας"
                                value={formData.phone}
                                onChange={handleChange2}
                                required
                            />

                        </div>
                        {errors.dobInvalid && (
                            <div className="error-message-div"> <span className="error-message">Εισάγετε έγκυρη ημερομηνία γέννησης</span> </div>
                        )}
                        <div className={`form-group ${errors.dobInvalid ? 'error' : ''}`}>
                            <img src="calendar.png" alt="Calendar Icon" className="input-icon" />
                            <Flatpickr
                                data-enable-time
                                id="dob"
                                name="dob"
                                value={dob}
                                onChange={handleDateChange}
                                placeholder="Ημερομηνία Γέννησης"
                                className="date-input"
                                options={{
                                    dateFormat: "Y-m-d", // Only date format, no time
                                    enableTime: false // Disable time picker
                                }}
                                required
                            />

                        </div>

                        <div class="wrap">
                            <button type="submit" className="button-register"
                            >
                                Εγγραφή
                            </button>
                        </div>
                        <div className="login-prompt">
                            <a href="/login">Είστε ήδη μέλος;</a>
                        </div>

                    </form>
                </div>
            </main >
        </div >
    )
}