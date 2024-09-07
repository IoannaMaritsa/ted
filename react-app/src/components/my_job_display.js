import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { getSubmissionsForJob } from '../api';
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

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${year}-${month}-${day}`;

        const newjob = {
            title: title,
            company: company,
            location: location,
            publish_date: formattedDate,
            type: type,
            profession: profession,
            experience: experience,
            salary: salary,
            details: detail,
        }

        onSave(id, newjob);

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

    const handleProfileClick = (userEmail) => {
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail } });
        window.scrollTo(0, 0);
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