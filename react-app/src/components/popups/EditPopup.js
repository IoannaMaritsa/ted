import React, { useState } from 'react';
import "../../css/popup.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import getImageUrl from "../../hooks/getImageUrl";

// Popup for profile edit
const EditPopup = ({ isOpen, onClose, currentProfile, onSave }) => {
    const [profilePic, setProfilePic] = useState();
    const [name, setName] = useState(currentProfile.name || '');
    const [profession, setProfession] = useState(currentProfile.profession || '');
    const [workplace, setWorkplace] = useState(currentProfile.workplace || '');
    const [location, setLocation] = useState(currentProfile.location || '');
    const [birthday, setBirthday] = useState(currentProfile.dob ? new Date(currentProfile.dob) : null);


    if (!isOpen) return null;
    console.log(currentProfile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file); 
        }
    };

    const handleSave = async () => {
        const formData = new FormData();

        formData.append('name', name !== currentProfile.name ? name : currentProfile.name);
        formData.append('profession', profession !== currentProfile.profession ? profession : currentProfile.profession);
        formData.append('workplace', workplace !== currentProfile.workplace ? workplace : currentProfile.workplace);
        formData.append('location', location !== currentProfile.location ? location : currentProfile.location);
        formData.append('dob', birthday ? format(birthday, 'yyyy-MM-dd') : currentProfile.birthday);
        formData.append('previousPic', currentProfile.profilepic);

        if (profilePic && typeof profilePic === 'object') {
            formData.append('profilepic', profilePic);  
            console.log('pic', profilePic);
        }

        try {
            await onSave(formData); 
            onClose(); 
        } catch (error) {
            console.error('Error saving profile:', error);
        }
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
                            <span className="span2" htmlFor="profilePic">Φωτογραφία Προφίλ</span>
                            <div className="profile-pic-container">
                                {!profilePic ? (<img src={getImageUrl(currentProfile?.profilepic, "profilepics")} alt="Profile" className="profile-pic-preview" />) :

                                    (<img
                                        src={profilePic ? URL.createObjectURL(profilePic) : 'default-avatar.jpeg'}
                                        alt="Profile"
                                        className="profile-pic-preview"
                                    />)
                                }

                                <div className="profile-pic-controls">
                                    <input
                                        id="profilePicInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="profile-pic-input2"
                                        style={{ display: 'none' }} 
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

                            <span className="span2" htmlFor="profession">Όνοματεπώνυμο</span>
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

                            <span className="span2" htmlFor="profession">Ιδιότητα</span>
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
                            <span className="span2">Πληροφορίες</span>
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
                                className="datepicker1"
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
