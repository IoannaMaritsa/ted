import React, { useState } from 'react';
import "../../css/popup.css"; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const AddStudiesPopup = ({ isOpen, onClose, onAddStudies }) => {
    const [school, setSchool] = useState('');
    const [degree, setDegree] = useState('');
    const [major, setMajor] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [duration, setDuration] = useState('');

    if (!isOpen) return null;

    const calculateDuration = (start, end) => {
        if (!start || !end) return '';

        const startYear = format(start, 'yyyy');
        const endYear = format(end, 'yyyy');

        return `${startYear} - ${endYear}`;
    };

    const handleAddClick = () => {
        if (school && degree && major && duration) {
            const cduration = calculateDuration(start, end);
            onAddStudies({ school, degree, major, duration: cduration });
            setSchool('');
            setDegree('');
            setMajor('');
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
            <div className="add-work-experience-modal-content2">
                <div className="add-work-experience-modal-header">
                    <div className="add-work-experience-modal-title">Προσθήκη Σπουδών</div>
                    <img
                        className="add-work-experience-modal-close-btn"
                        src="/close-icon.png" 
                        onClick={onClose}
                        alt="Close"
                    />
                </div>
                <div className="add-work-experience-modal-body">
                <div className="form-group2">
                        <label htmlFor="school">Πανεπιστήμιο</label>
                        <input
                            id="school"
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            placeholder='π.χ. Harvard'
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="degree">Είδος Πτυχίου</label>
                        <input
                            id="degree"
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder='π.χ. Προπτυχιακό'
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="major">Πεδίο Σπουδών</label>
                        <input
                            id="major"
                            type="text"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            placeholder='π.χ. Επιστήμη Υπολογιστών'
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="start">Χρονια Έναρξης</label>
                        <DatePicker
                            id="start"
                            selected={start}
                            onChange={(date) => {
                                setStart(date);
                                if (end) {
                                    setDuration(calculateDuration(date, start));
                                }
                            }}
                            dateFormat="yyyy"
                            showYearPicker
                            placeholderText="Επιλέξτε έτος"
                        />
                    </div>
                    <div className="form-group2">
                        <label htmlFor="end">Χρονια Λήξης </label>
                        <DatePicker
                            id="end"
                            selected={end}
                            onChange={(date) => {
                                setEnd(date);
                                if (start) {
                                    setDuration(calculateDuration(start, date));
                                }
                            }}
                            dateFormat="yyyy"
                            showYearPicker
                            placeholderText="Επιλέξτε έτος"
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

export default AddStudiesPopup;
