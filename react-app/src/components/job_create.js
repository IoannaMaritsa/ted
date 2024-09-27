import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { default_locations } from "../context/locations";
import { getAllSkills } from '../api';
import './job_create.css';

const Job_create = ({ c_email, onSave }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [profession, setProfession] = useState('');
    const [location, setLocation] = useState('Αθήνα - Κέντρο');
    const [type, setType] = useState('Πλήρης');
    const [experience, setExperience] = useState('');
    const [salary, setSalary] = useState('');
    const [chosen, setChosen] = useState([]);
    const [detail, setDetail] = useState('');

    const locations = default_locations;

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

    const handleprofessionChange = (e) => {
        setProfession(e.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleExperienceChange = (e) => {
        if (e.target.value >= 0)
            setExperience(e.target.value);
    };

    const handleSalaryChange = (e) => {
        if (e.target.value >= 0)
            setSalary(e.target.value);
    };

    const handleDetailChange = (e) => {
        setDetail(e.target.value);
    };
    const handleClick = (e) => {
        e.preventDefault();
        //add date
        const now = new Date();
        const timestamp = now.toISOString();

        onSave(title, company, location, timestamp, type, profession, experience, salary, chosen, detail, c_email)
        // Reset the form
        setTitle('');
        setCompany('');
        setDetail('');
        setExperience('');
        setLocation('Αθήνα - Κέντρο');
        setSalary('');
        setProfession('');
        setType('Πλήρης');
        setChosen([]);
    };

    //skills

    const [skills, setSkills] = useState([]);

    const skillsPerPage = 12; // 3 rows * 4 columns
    const [currentPage, setCurrentPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const searchSkills = useMemo(() => {
        const query = (searchQuery || '').toLowerCase();
        return skills.filter(skill => {
            const name = (skill.skill_name || '').toLowerCase();
            return name.includes(query);
        });
    }, [searchQuery, skills]);

    const indexOfLastSkill = currentPage * skillsPerPage;
    const indexOfFirstSkill = indexOfLastSkill - skillsPerPage;
    const currentSkills = searchSkills.slice(indexOfFirstSkill, indexOfLastSkill);

    const totalPages = Math.ceil(searchSkills.length / skillsPerPage);


    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRemove = () => {
        setChosen([]);
    };

    // Add selected skill to chosen list
    const AddSkill = (skill) => {
        // Check if skill is already chosen
        if (!chosen.includes(skill)) {
            setChosen((prevChosen) => [...prevChosen, skill]);
        }
    };

    const getSkills = async () => {
        try {
            const response = await getAllSkills();

            setSkills(response);
        } catch (error) {
            console.error('Error getting skills:', error);
        }
    };

    useEffect(() => {
        getSkills();
    }, []);

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
                        <label htmlFor="profession">Ειδικότητα</label>
                        <input
                            type="text"
                            id="profession"
                            value={profession}
                            onChange={handleprofessionChange}
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
                    <div className="add-work-experience-modal-body">
                        <div className='job-input-group-header'>
                            <h3>Προαπαιτούμενες δεξιότητες</h3>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Αναζήτηση Δεξιότητας"
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <img src="/search.png" alt="Search Icon" className="search-icon"></img>
                            </div>
                            </div>
                        <div className="skills-container">
                            <div className="skills-grid">
                                {currentSkills.map((skill, index) => (
                                    <div key={index} className="skill-box" style={{color:'black'}} onClick={() => AddSkill(skill.skill_name)}>
                                        {skill.skill_name}
                                    </div>
                                ))}
                            </div>
                            <div className="pagination" style={{color:'black'}}>
                                <button type="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    Προηγούμενο
                                </button>
                                <span>Σελίδα {currentPage} από {totalPages}</span>
                                <button type="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    Επόμενο
                                </button>
                            </div>
                        </div>

                        {/* Display chosen skills */}
                        <div className="chosen-skills-container">

                            <div className='chosen-skills-head'>
                                <h3>Επιλεγμένες Δεξιότητες</h3>
                                <img src='/reset.png' className='icon' onClick={handleRemove} style={{cursor:'pointer'}}/>
                            </div>
                            {chosen.length > 0 ? (
                                <div className="chosen-skills-grid">
                                    {chosen.map((skill, index) => (
                                        <div key={index} className="chosen-skill-box" style={{color:'black'}}>
                                            {skill}
                                        </div>
                                    ))}
                                </div>

                            ) : (
                                <p>
                                    Δεν έχουν επιλεγεί ακόμα δεξιότητες
                                </p>
                            )}
                        </div>
                    </div>
                    <br></br>
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