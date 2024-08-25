import React, { useState } from 'react';
import "../css/popup.css"; // Adjust the path as needed
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import format function for date formatting

const AddWorkExperiencePopup = ({ isOpen, onClose, onAddExperience }) => {
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [duration, setDuration] = useState('');

    if (!isOpen) return null;

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';

        const startMonth = format(start, 'MMM yyyy');
        const endMonth = format(end, 'MMM yyyy');

        return `${startMonth} - ${endMonth}`;
    };

    const handleAddClick = () => {
        if (role && company && duration) {
            const cduration = calculateDuration(start, end);
            onAddExperience({ role, company, duration: cduration });
            setRole('');
            setCompany('');
            setStart(null);
            setEnd(null);
            setDuration('');
            onClose();
        } else {
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
                        src="/close-icon.png" // Replace with your close icon path
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
                                if (end) {
                                    setDuration(calculateDuration(date, end));
                                }
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
                                if (start) {
                                    setDuration(calculateDuration(start, date));
                                }
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
