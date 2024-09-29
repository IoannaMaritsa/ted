import React, { useState } from 'react';
import "../css/popup.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Popup for work experience addition
const AddWorkExperiencePopup = ({ isOpen, onClose, onAddExperience }) => {
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    if (!isOpen) return null;

    const handleAddClick = () => {
        if (role && company && start && end) {
            onAddExperience({ profession: role, workplace: company, start_date:start, end_date:end });
            setRole('');
            setCompany('');
            setStart(null);
            setEnd(null);
            onClose();
        }
        else if (role && company && start){
            onAddExperience({ profession: role, workplace: company, start_date:start});
            setRole('');
            setCompany('');
            setStart(null);
            onClose();
        } 
        else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className="add-work-experience-modal">
            <div className="add-work-experience-modal-content">
                <div className="add-work-experience-modal-header">
                    <div className="add-work-experience-modal-title">Προσθήκη Επαγγελματικών Εμπειριών</div>
                    <img
                        className="add-work-experience-modal-close-btn"
                        src="/close-icon.png" 
                        onClick={onClose}
                        alt="Close"
                    />
                </div>
                <div className="add-work-experience-modal-body">
                <div className="form-group2">
                        <label htmlFor="role">Ρόλος</label>
                        <input
                            id="role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder='π.χ. Αναλυτής Συστήματος'
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="company">Όνομα Εταιρείας</label>
                        <input
                            id="company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder='π.χ. Facebook'
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="start">Ημερομηνία Έναρξης</label>
                        <DatePicker
                            id="start"
                            selected={start}
                            onChange={(date) => {
                                setStart(date);
                            }}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Επιλέξτε μήνα και έτος"
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="end">Ημερομηνία Λήξης</label>
                        <DatePicker
                            id="end"
                            selected={end}
                            onChange={(date) => {
                                setEnd(date);
                            }}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            placeholderText="Επιλέξτε μήνα και έτος"
                        />
                    </div>
                 
                </div>
                <div className="add-work-experience-modal-footer">
                    <button onClick={handleAddClick}>Προσθήκη</button>
                </div>
            </div>
        </div>
    );
};

export default AddWorkExperiencePopup;
