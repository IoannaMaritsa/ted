import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import './job_display.css';

const MyJob = ({ id, init_title, init_company, init_location, init_type, init_speciality, init_experience, init_salary, init_detail, init_submissions, onSave }) => {
    const [title, setTitle] = useState(init_title);
    const [company, setCompany] = useState(init_company);
    const [location, setLocation] = useState(init_location);
    const [type, setType] = useState(init_type);
    const [speciality, setSpeciality] = useState(init_speciality);
    const [experience, setExperience] = useState(init_experience);
    const [salary, setSalary] = useState(init_salary);
    const [detail, setDetail] = useState(init_detail);

    const submissions = init_submissions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Effect to update state when props change
    useEffect(() => {
        setTitle(init_title || '');
        setCompany(init_company || '');
        setLocation(init_location || '');
        setType(init_type || '');
        setSpeciality(init_speciality || '');
        setExperience(init_experience || '');
        setSalary(init_salary || '');
        setDetail(init_detail || '');
    }, [init_title, init_company, init_location, init_type, init_speciality, init_experience, init_salary, init_detail]);

    const handleSave = (e) => {
        e.preventDefault();

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;
        
        const job = {
            id: id, 
            title: title, 
            company: company, 
            location: location, 
            date: formattedDate, 
            type: type, 
            specialization: speciality, 
            experience: experience, 
            salary: salary, 
            details: detail, 
            submissions: init_submissions,
            creator_id: 999
        }

        onSave(job);

    };

    useEffect(() => {
        if (type === 'Εθελοντική') {
            setSalary(0);
        }        
    }, [type]);

    const locations = [
        'Αθήνα - Κέντρο',
        'Πειραιάς',
        'Ηράκλειο Κρήτης',
        'Άνω Πατήσια',
        'Νέο Ηράκλειο',
        'Ζωγράφου',
        'Κάτω Πατήσια',
        'Κυψέλη'
    ];

    const types = [
        'Πλήρης',
        'Μερική',
        'Εθελοντική',
    ];
    
    const { setOtherProfile, otherProfile } = useAppContext();

    const navigate = useNavigate();

    const handleProfileClick = (user) => {
        setOtherProfile(user);
        navigate('/epaggelmatias_aggelies/user_profile', { state: { otherProfile: user } });
    };

    useEffect(() => {

    }, [otherProfile]);

    return (
        <div className="black-frame">
            <form onSubmit={handleSave}>
            <div className="job-input-group">
                <label htmlFor="title">Τίτλος</label>
                <input
                    type="text"
                    value={title}
                    placeholder={init_title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
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
                    required
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
                    required
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
                    required
                />
            </div>
            <div className="job-input-group">
                <label htmlFor="salary">Ετήσιος Μισθός</label>
                <input
                    type="number"
                    id="salary"
                    value={type === 'Εθελοντική' ? 0 : salary}
                    placeholder={init_salary}
                    onChange={(e) => setSalary(e.target.value)}
                    disabled={type === 'Εθελοντική'}
                    required
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
            <button className='jobs-create-button' type='submit'>Αποθήκευση</button>
            </form>


            <div className='job_submitions'>
                <h3>Αιτήσεις</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ονοματεπώνυμο</th>
                            <th>Ημερομηνία Αίτησης</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map((submission, idx) => (
                            <tr key={idx} >
                                <td onClick={() => handleProfileClick(submission.user)} className='clickable-td'>{submission.user.name}</td>
                                <td>{submission.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyJob;