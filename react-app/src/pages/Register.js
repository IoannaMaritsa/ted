import React, { useState , useRef} from 'react';
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
        passwordMismatch: false
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] }); // Handle file input
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'confirmPassword') {
            // Check for password mismatch
            if (value !== formData.password) {
                setErrors({ passwordMismatch: true });
            } else {
                setErrors({ passwordMismatch: false });
            }
        }
    };

    const handleDateChange = (dates) => {
        setFormData({ ...formData, dateOfBirth: dates[0] });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrors({ passwordMismatch: true });
            return;
        }
        setErrors({ passwordMismatch: false });

        // Handle form submission, including file upload
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSubmit.append(key, formData[key]);
        });

        // Example form submission logic
        // You might want to use fetch or axios for actual submission
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
                        <div className="form-group">
                            <img src="email-icon.png" alt="Email Icon" className="input-icon" />
                            <input type="text"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className={`form-group ${errors.passwordMismatch ? 'error' : ''}`}>
                            <img src="password-icon.png" alt="Password Icon" className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Κωδικός"
                                value={formData.password}
                                onChange={handlePassChange}
                                required
                            />

                        </div>
                        <div className={`form-group ${errors.passwordMismatch ? 'error' : ''}`}>
                            <img src="again.png" alt="Redo Icon" className="input-icon" />
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                placeholder="Επιβεβαίωση Κωδικού"
                                value={formData.confirmPassword}
                                onChange={handlePassChange}
                                required
                            />

                        </div>
                        <div className="form-group">
                            <img src="phone.png" alt="Phone Icon" className="input-icon" />
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Τηλέφωνο Επικοινωνίας"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>
                        <div className="form-group">
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
                        {errors.passwordMismatch && (
                            <div className="error-message">Passwords do not match!</div>
                        )}
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