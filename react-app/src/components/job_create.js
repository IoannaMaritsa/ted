import React from 'react';
import { useState } from 'react';
import './job_display.css';

const Job_create = () => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');
    const [experience, setExperience] = useState('');
    const [salary, setSalary] = useState('');
    const [date, setDate] = useState('');
    const [detail, setDetail] = useState('');

    const locations = [
        'Athens',
        'Peireus',
        'Hrakleio',
    ];

    const types = [
        'Πλήρης',
        'Μερική',
        'Εθελοντισμός',
    ];

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleCompanyChange = (e) => {
        setCompany(e.target.value);
    };

    const handleSpecialityChange = (e) => {
        setSpeciality(e.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
    };

    const handleSalaryChange = (e) => {
        setSalary(e.target.value);
    };

    const handleDetailChange = (e) => {
        setDetail(e.target.value);
    };
    const handleClick = (e) => {
        e.preventDefault();
        //add date
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${month}/${date}/${year}`;
        setDate(formattedDate)
        // Reset the form
        setTitle('');
        setCompany('');
        setDetail('');
        setExperience('');
        setLocation('');
        setSalary('');
        setSpeciality('');
        setType('');
    };
    return (
        <div>
            <div className="black-frame">

                <h2>Δημιουργία Νέας Αγγελίας</h2>
                <div className="job-input-group">
                    <label htmlFor="title">Τίτλος</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="job-input-group">
                    <label htmlFor="company">Επαγγελματικός φορέας</label>
                    <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={handleCompanyChange}
                    />
                </div>
                <div className="job-input-group">
                    <label htmlFor="speciality">Ειδικότητα</label>
                    <input
                        type="text"
                        id="speciality"
                        value={speciality}
                        onChange={handleSpecialityChange}
                    />
                </div>
                <div className="job-input-group">
                    <label htmlFor="location">Περιοχή</label>
                    <select id="location" value={location} onChange={handleLocationChange}>
                        {locations.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="job-input-group">
                    <label htmlFor="location">Απασχόληση</label>
                    <select id="location" value={type} onChange={handleTypeChange}>
                        {types.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="job-input-group">
                    <label htmlFor="experience">Εμπειρία</label>
                    <input
                        type="number"
                        id="experience"
                        value={experience}
                        onChange={handleExperienceChange}
                    />
                </div>
                <div className="job-input-group">
                    <label htmlFor="salary">Ετήσιος Μισθός</label>
                    <input
                        type="number"
                        id="salary"
                        value={salary}
                        onChange={handleSalaryChange}
                    />
                </div>
                <div className="job-input-group">
                    <label htmlFor="detail">Επιπλέον Σχόλια</label>
                    <textarea
                        id="detail"
                        value={detail}
                        onChange={handleDetailChange}
                        placeholder="Δώστε περισσότερες πληροφορίες"
                    />
                </div>
                <button className='button-primary' onClick={handleClick}>Καταχώριση</button>
            </div>
        </div>
    );
};

export default Job_create;