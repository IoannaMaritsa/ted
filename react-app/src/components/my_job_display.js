import React from 'react';
import { useState } from 'react';
import './job_display.css';

const MyJob = ({ index, init_title, init_company, init_location, init_type, init_speciality, init_experience, init_salary, init_detail, onSave }) => {
    const [title, setTitle] = useState(init_title);
    const [company, setCompany] = useState(init_company);
    const [location, setLocation] = useState(init_location);
    const [date, setDate] = useState();
    const [type, setType] = useState(init_type);
    const [speciality, setSpeciality] = useState(init_speciality);
    const [experience, setExperience] = useState(init_experience);
    const [salary, setSalary] = useState(init_salary);
    const [detail, setDetail] = useState(init_detail);

    const handleSave = () => {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;
        setDate(formattedDate)
        onSave({ index, title, company, location, date, type, speciality, experience, salary, detail });
    };

    const locations = [
        init_location,
        'Athens',
        'Peireus',
        'Hrakleio',
    ];

    const types = [
        init_type,
        'Πλήρης',
        'Μερική',
        'Εθελοντισμός',
    ];
    console.log(init_speciality);
    return (
        <div className="black-frame">
            <div className="job-input-group">
                <label htmlFor="title">Τίτλος</label>
                <input
                    type="text"
                    value={title}
                    placeholder={init_title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="company">Επαγγελματικός φορέας</label>
                <input
                    type="text"
                    id="company"
                    value={company}
                    placeholder={init_company}
                    onChange={(e) => setCompany(e.target.value)}
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="speciality">Ειδικότητα</label>
                <input
                    type="text"
                    id="speciality"
                    value={speciality}
                    placeholder={init_speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="location">Περιοχή</label>
                <select id="location" value={location} onChange={(e) => setLocation(e.target.value)} >
                    {locations.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div className="job-input-group">
                <label htmlFor="location">Απασχόληση</label>
                <select id="location" value={type} onChange={(e) => setType(e.target.value)}>
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
                    placeholder={init_experience}
                    onChange={(e) => setExperience(e.target.value)}
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="salary">Ετήσιος Μισθός</label>
                <input
                    type="number"
                    id="salary"
                    value={salary}
                    placeholder={init_salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="detail">Επιπλέον Σχόλια</label>
                <textarea
                    id="detail"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder={init_detail}
                />
            </div>
            <button className='jobs-create-button' onClick={handleSave}>Αποθήκευση</button>
        </div>
    );
};

export default MyJob;