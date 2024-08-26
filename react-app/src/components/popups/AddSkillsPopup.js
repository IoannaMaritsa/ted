import React, { useState } from 'react';
import "../../css/popup.css"; 

const AddSkillsPopup = ({ isOpen, onClose, onAddSkills }) => {
    const [name, setName] = useState('');


    if (!isOpen) return null;

    const handleAddClick = () => {
        if (name) {
            onAddSkills({ name});
            setName('');
            onClose();
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className="add-work-experience-modal">
            <div className="add-work-experience-modal-content3">
                <div className="add-work-experience-modal-header">
                    <div className="add-work-experience-modal-title">Προσθήκη Δεξιοτήτων</div>
                    <img
                        className="add-work-experience-modal-close-btn"
                        src="/close-icon.png" 
                        onClick={onClose}
                        alt="Close"
                    />
                </div>
                <div className="add-work-experience-modal-body">
                <div className="form-group2">
                        <label htmlFor="name">Δεξιότητα</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='π.χ. Εξυπηρέτηση Πελατών'
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

export default AddSkillsPopup;
