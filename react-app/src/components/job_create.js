import React from 'react';
import { useState , useEffect} from 'react';
import './job_create.css';

const Job_create = ({ id, onSave }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [location, setLocation] = useState('Αθήνα - Κέντρο');
    const [type, setType] = useState('Πλήρης');
    const [experience, setExperience] = useState('');
    const [salary, setSalary] = useState('');
    const [detail, setDetail] = useState('');

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
        const formattedDate = `${year}-${month}-${date}`;

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
            submissions: [],
            creator_id: 999
        }
        onSave(job)
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

    useEffect(() => {
        if (type === 'Εθελοντική') {
            setSalary(0);
        }        
    }, [type]);
    return (
        <div>
            <div className="black-frame">
                <form onSubmit={handleClick}>
                    <h2>Δημιουργία Νέας Αγγελίας</h2>
                    <div className="job-input-group">
                        <label htmlFor="title">Τίτλος</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>
                    <div className="job-input-group">
                        <label htmlFor="company">Επαγγελματικός φορέας</label>
                        <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={handleCompanyChange}
                            required
                        />
                    </div>
                    <div className="job-input-group">
                        <label htmlFor="speciality">Ειδικότητα</label>
                        <input
                            type="text"
                            id="speciality"
                            value={speciality}
                            onChange={handleSpecialityChange}
                            required
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
                        <label htmlFor="type">Απασχόληση</label>
                        <select id="type" value={type} onChange={handleTypeChange}>
                            {types.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="job-input-group">
                        <label htmlFor="experience">Προαπαιτούμενη Εμπειρία σε Έτη</label>
                        <input
                            type="number"
                            id="experience"
                            value={experience}
                            onChange={handleExperienceChange}
                            required
                            min={0}
                        />
                    </div>
                    <div className="job-input-group">
                        <label htmlFor="salary">Ετήσιος Μισθός</label>
                        <input
                            type="number"
                            id="salary"
                            value={type === 'Εθελοντική' ? 0 : salary}
                            onChange={handleSalaryChange}
                            disabled={type === 'Εθελοντική'}
                            required
                            min={0}
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
                    <button className='jobs-create-button' type='submit'>Καταχώριση</button>
                </form>
            </div>

        </div>
    );
};

export default Job_create;