import React, { useState, useRef } from 'react';
import '../css/register.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import format function from date-fns
import { addUser } from '../api'; // Adjust the import path as needed

export default function Register() {

    const [success, setSuccess] = useState(false)

    const [dob] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        location: '',
        dob: '',
        profilePhoto: null,
    });

    const [errors, setErrors] = useState({
        passwordMismatch: false,
        emailInvalid: false,
        emailInUse: false,
        passwordInvalid: false,
        locationInvalid: false,
        dobInvalid: false
    });

    const fileInputRef = useRef(null);

    const handleDateChange = (date) => {
        if (date != null) {
            setFormData({ ...formData, dob: date });
            const today = new Date();
            const minAge = 18; // Minimum age requirement
            const age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            const dayDiff = today.getDate() - date.getDate();

            if (age < minAge || (age === minAge && monthDiff < 0) || (age === minAge && monthDiff === 0 && dayDiff < 0)) {
                setErrors({ ...errors, dobInvalid: true });
            } else {
                setErrors({ ...errors, dobInvalid: false });
            }
        }
    };

    const handleReset = () => {
        setFormData(prevData => ({
            ...prevData,
            profilePhoto: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input value
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                profilePhoto: file
            }));
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
            setErrors({ ...errors, emailInUse: false });
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

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(formData.email);

        if (!isEmailValid) {
            setErrors(prevErrors => ({ ...prevErrors, emailInvalid: true }));
            return;
        }
        setErrors(prevErrors => ({ ...prevErrors, emailInvalid: false }));

        if (formData.password !== formData.confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, passwordMismatch: true }));
            return;
        }
        setErrors(prevErrors => ({ ...prevErrors, passwordMismatch: false }));


        // Format the date to DD-MM-YYYY
        const formattedDob = formData.dob ? format(formData.dob, "yyyy-MM-dd") : '';
        console.log(formattedDob);
        // Access the input fields by their IDs
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');

        // Get the values from the input fields
        const firstNameValue = firstNameInput.value;
        const lastNameValue = lastNameInput.value;

        // Concatenate first and last name
        const fullName = `${firstNameValue} ${lastNameValue}`;

        // Combine form data with other fields
        const userData = {
            name: fullName,
            email: formData.email,
            password: formData.password,
            location: formData.location,
            dob: formattedDob,
            profilepic: formData.profilePhoto,
        };

        try {
            console.log('Sending request...');
            const response = await addUser(userData);
            if (response.status === 409) {
                setErrors({ ...errors, emailInUse: true });
            }
            else if (response.status === 201) {
                setSuccess(true);
                console.log('User registered successfully:', response);

                // Save user information in session storage
                sessionStorage.setItem('user', JSON.stringify({
                    name: fullName,
                    email: formData.email,
                }));

                console.log('Redirecting to homepage...');
                window.location.href = '/epaggelmatias_homepage'; // Adjust the homepage path as needed
            }

        } catch (error) {
            console.error('Error registering user:', error);

        }
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
                            <label htmlFor="profilePhoto" className="file-upload-label">
                                {formData.profilePhoto ? formData.profilePhoto.name : 'Επιλέξτε Εικόνα Προφίλ'}
                            </label>
                            <input
                                type="file"
                                id="profilePhoto"
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
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Όνομα"
                                        value={formData.firstName} // Bind to state
                                        onChange={handleChange2} // Call handleChange2 on change
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group form-group-half">
                                <img src="user.png" alt="User Icon" className="input-icon" />
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Επώνυμο"
                                        value={formData.lastName} // Bind to state
                                        onChange={handleChange2} // Call handleChange2 on change
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.emailInvalid && <div className='error-message-div'><span className="error-message">Εισάγετε έγκυρο email</span></div>}
                        {errors.emailInUse && <div className='error-message-div'><span className="error-message">Το τρέχον email χρησιμοποιείται ήδη</span></div>}
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
                            <img src="location2.png" alt="Location Icon" className="input-icon" />
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Μόνιμη Κατοικία"
                                value={formData.location}
                                onChange={handleChange2}
                                required
                            />

                        </div>
                        {errors.dobInvalid && (
                            <div className="error-message-div"> <span className="error-message">Εισάγετε έγκυρη ημερομηνία γέννησης</span> </div>
                        )}
                        <div className={`form-group ${errors.dobInvalid ? 'error' : ''}`}>
                            <img src="calendar.png" alt="Calendar Icon" className="input-icon" />
                            <DatePicker
                                selected={formData.dob}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Ημερομηνία Γέννησης"
                                class="date-input react-datepicker-ignore-onclickoutside"
                                id="dob"
                                name="dob"

                            />

                        </div>

                        <div class="wrap">
                            {success && (<p>Η εγγραφή έγινε με επιτυχία</p>)}
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