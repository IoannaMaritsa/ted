import React, { useState } from 'react';
import "../../css/popup.css"; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import format function for date formatting

const EditPopup = ({ isOpen, onClose, currentProfile, onSave }) => {
    const [profilePic, setProfilePic] = useState(currentProfile.profilePic || '');
    const [name, setName] = useState(currentProfile.name || '');
    const [profession, setProfession] = useState(currentProfile.profession || '');
    const [workplace, setWorkplace] = useState(currentProfile.workplace || '');
    const [location, setLocation] = useState(currentProfile.location || '');
    const [birthday, setBirthday] = useState(currentProfile.birthday ? new Date(currentProfile.birthday) : null);
    const [imageFile, setImageFile] = useState(null); 


    if (!isOpen) return null;
    console.log(currentProfile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file)); // Create a URL for the selected image
            setProfilePic(URL.createObjectURL(file)); // Update profilePic state with the file URL
        }
    };

    const handleSave = () => {
        // Merge the updated data with the existing profile
        const updatedProfile = {
            ...currentProfile, // Existing profile data
            profilePic: profilePic !== currentProfile.profilePic ? profilePic : currentProfile.profilePic,
            profession: profession !== currentProfile.profession ? profession : currentProfile.profession,
            workplace: workplace !== currentProfile.workplace ? workplace : currentProfile.workplace,
            location: location !== currentProfile.location ? location : currentProfile.location,
            birthday: birthday ? format(birthday, 'yyyy-MM-dd') : currentProfile.birthday,
        };

        onSave(updatedProfile); // Pass the updated profile to the onSave function
        onClose(); // Close the popup
    };

    return (
        <div className="add-work-experience-modal">
            <div className="add-work-experience-modal-content4">
                <div className="add-work-experience-modal-header">
                    <div className="add-work-experience-modal-title">Επεξεργασία Προφίλ</div>
                    <img
                        className="add-work-experience-modal-close-btn"
                        src="/close-icon.png" 
                        onClick={onClose}
                        alt="Close"
                    />
                </div>
                <div className="add-work-experience-modal-body">
                    <div className="details-section">
                        <div className="form-group2">
                            <span className= "span2" htmlFor="profilePic">Φωτογραφία Προφίλ</span>
                            <div className="profile-pic-container">
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="profile-pic-preview"
                                />
                                <div className="profile-pic-controls">
                                    <input
                                        id="profilePicInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="profile-pic-input2"
                                        style={{ display: 'none' }} // Hide the default file input
                                    />
                                    <button
                                        onClick={() => document.getElementById('profilePicInput').click()}
                                        className="profile-pic-button"
                                    >
                                        Επιλέξτε Φωτογραφία
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="details-section">
                        <div className="form-group2">

                            <span className= "span2" htmlFor="profession">Όνοματεπώνυμο</span>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Εισάγετε ονοματεπώνυμο"
                            />
                        </div>
                    </div>
                    <div className="details-section">
                        <div className="form-group2">

                            <span className= "span2" htmlFor="profession">Ιδιότητα</span>
                            <input
                                id="profession"
                                type="text"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                placeholder="Εισάγετε ιδιότητα"
                            />
                        </div>
                    </div>
                    <div className="details-section2">
                        <div className="form-group2">
                            <span className= "span2">Πληροφορίες</span>
                            <div className="form-group-label">
                                <img src="/work-icon.png" alt="Workplace Icon" className="form-group-icon" />
                                <span>Εργασιακός Χώρος</span>
                            </div>
                            <input
                                id="workplace"
                                type="text"
                                value={workplace}
                                onChange={(e) => setWorkplace(e.target.value)}
                                placeholder="Εισάγετε εργασιακό χώρο"
                            />
                        </div>
                        <div className="form-group2">
                            <div className="form-group-label">
                                <img src="/location.png" alt="Location Icon" className="form-group-icon" />
                                <span>Τοποθεσία</span>
                            </div>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Εισάγετε χώρο κατοικίας"
                            />
                        </div>
                        <div className="form-group2">
                            <div className="form-group-label">
                                <img src="/birthday.png" alt="Birthday Icon" className="form-group-icon" />
                                <span>Ημερομηνία Γέννησης</span>
                            </div>
                            <DatePicker
                                id="birthday"
                                className ="datepicker1"
                                selected={birthday}
                                onChange={(date) => setBirthday(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText={birthday ? format(birthday, 'yyyy-MM-dd') : 'Επιλέξτε ημερομηνία'}
                                showDayMonthYearPicker
                            />
                        </div>
                    </div>
                </div>
                <div className="add-work-experience-modal-footer">
                    <button onClick={handleSave} >Αποθήκευση</button>
                </div>
            </div>
        </div>
    );
};

export default EditPopup;
