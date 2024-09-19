import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { default_locations } from "../context/locations";
import { getSubmissionsForJob } from '../api';
import { getAllSkills, getAllSkillsForJob } from '../api';
import { format } from 'date-fns';
import './job_display.css';

const MyJob = ({ id, init_title, init_company, init_location, init_type, init_profession, init_experience, init_salary, init_detail, onSave }) => {
    const [title, setTitle] = useState(init_title);
    const [company, setCompany] = useState(init_company);
    const [location, setLocation] = useState(init_location);
    const [type, setType] = useState(init_type);
    const [profession, setProfession] = useState(init_profession);
    const [experience, setExperience] = useState(init_experience);
    const [salary, setSalary] = useState(init_salary);
    const [chosen, setChosen] = useState([]);
    const [detail, setDetail] = useState(init_detail);

    const [submissions, setSubmissions] = useState([]);

    const getSubmissions = async (articleId) => {
        try {

            const subs = await getSubmissionsForJob(articleId);
            console.log('sub', subs);
            console.log(`Got a submissions successfully.`);
            if (subs.success)
                setSubmissions(subs.data)

        } catch (error) {
            console.error('Error getting submissions:', error);
        }
        console.log(submissions);
    };

    useEffect(() => {
        getSubmissions(id);
    }, [id]);

    // Effect to update state when props change
    useEffect(() => {
        setTitle(init_title || '');
        setCompany(init_company || '');
        setLocation(init_location || '');
        setType(init_type || '');
        setProfession(init_profession || '');
        setExperience(init_experience || '');
        setSalary(init_salary || '');
        setDetail(init_detail || '');
    }, [init_title, init_company, init_location, init_type, init_profession, init_experience, init_salary, init_detail]);

    const handleSave = (e) => {
        e.preventDefault();

        const now = new Date();
        const timestamp = now.toISOString();

        const newjob = {
            title: title,
            company: company,
            location: location,
            publish_date: timestamp,
            type: type,
            profession: profession,
            experience: experience,
            salary: salary,
            details: detail,
        }

        onSave(id, newjob, chosen);

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

    const getSkillsforjob = async () => {
        try {
            const response = await getAllSkillsForJob(id);

            const currentSkills = new Set(chosen);

            for (const skill of response) {
                currentSkills.add(skill.skill_name);
            }

            setChosen(Array.from(currentSkills));
        } catch (error) {
            console.error('Error getting skills:', error);
        }
    };

    useEffect(() => {
        getSkills();
        getSkillsforjob();
    }, []);

    useEffect(() => {
        if (type === 'Εθελοντική') {
            setSalary(0);
        }
    }, [type]);

    const locations = default_locations;

    const types = [
        'Πλήρης',
        'Μερική',
        'Εθελοντική',
    ];

    const { setOtherProfile, otherProfile } = useAppContext();

    const navigate = useNavigate();

    const handleProfileClick = (userEmail) => {
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail } });
        window.scrollTo(0, 0);
    };

    useEffect(() => {

    }, [otherProfile]);

    console.log("chosen", chosen);

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
                    <label htmlFor="profession">Ειδικότητα</label>
                    <input
                        type="text"
                        id="profession"
                        value={profession}
                        placeholder={init_profession}
                        onChange={(e) => setProfession(e.target.value)}
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
                        onChange={(e) => e.target.value >= 0 ? setExperience(e.target.value) : 0}
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
                        onChange={(e) => e.target.value >= 0 ? setSalary(e.target.value) : 0}
                        disabled={type === 'Εθελοντική'}
                        required
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
                                <div key={index} className="skill-box" style={{ color: 'black' }} onClick={() => AddSkill(skill.skill_name)}>
                                    {skill.skill_name}
                                </div>
                            ))}
                        </div>
                        <div className="pagination" style={{ color: 'black' }}>
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
                            <img src='/reset.png' className='icon' onClick={handleRemove} style={{ cursor: 'pointer' }} />
                        </div>
                        {chosen.length > 0 ? (
                            <div className="chosen-skills-grid">
                                {chosen.map((skill, index) => (
                                    <div key={index} className="chosen-skill-box" style={{ color: 'black' }}>
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
                    {submissions.length > 0 ?
                        (<tbody>
                            {submissions.map((submission, idx) => (
                                <tr key={idx} >
                                    <td onClick={() => handleProfileClick(submission.users.email)} className='clickable-td'>{submission.users.name}</td>
                                    <td>{format(submission.submission_date, 'yyyy-MM-dd')}</td>
                                </tr>
                            ))}
                        </tbody>) : (<p style={{ color: '#fff' }}>Δεν υπάρχουν αιτήσεις για αυτή την αγγελία</p>)}
                </table>
            </div>
        </div>
    );
};

export default MyJob;