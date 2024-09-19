import React from 'react';
import './job_display.css';
import { useState, useEffect } from 'react';
import { addSubmission, getSubmissionsForJob, addViewToJob, getAllSkillsForJob } from '../api';
import { useAppContext } from "../context/appContext";

const Job = ({ id, title, company, location, publish_date, type, profession, experience, salary, detail }) => {

    const myuser = useAppContext().user;
    const [submissions, setSubmissions] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [skills, setSkills] = useState([]);

    const getSubmissions = async (jobId) => {
        try {
            const subs = await getSubmissionsForJob(jobId);
            if (subs.success)
                setSubmissions(subs.data)

        } catch (error) {
            console.error('Error getting submissions:', error);
        }
    };

    const getSkillsforjob = async () => {
        try {
            const response = await getAllSkillsForJob(id);

            const currentSkills = new Set();

            for (const skill of response) {
                currentSkills.add(skill.skill_name);
            }

            setSkills(Array.from(currentSkills));
        } catch (error) {
            console.error('Error getting skills:', error);
        }
    };

    useEffect(() => {
        setSubmitted(submissions.some(submission => submission.users.email === myuser.email));
        console.log(submitted);
    }, [submissions, myuser.email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = new Date();
        const timestamp = now.toISOString();

        try {
            await addSubmission(id, myuser.email, timestamp);
            console.log('added sbmission successfully');
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    }

    useEffect(() => {
        addViewToJob(myuser.email, id);
        getSubmissions(id);
        getSkillsforjob();
    }, [id]);



    return (
        <div className="black-frame">
            <div className='job-display-box'>

                <div className='job-display-sector'>

                    <div className='job-display-time'>
                        <h5>{publish_date}</h5>
                    </div>
                    <div className='job-display-info'>
                        <h2>{title}</h2>
                    </div>
                    <div className='job-display-info-group'>
                        <div className='job-display-info'>
                            <img src="/work-icon.png" alt="User Icon" className="icon" />
                            <h4>{company}</h4>
                        </div>
                        <div className='job-display-info'>
                            <img src="/location.png" alt="User Icon" className="icon" />
                            <h4>{location}</h4>
                        </div>
                        <div className='job-display-info'>
                            <img src="/user.png" alt="User Icon" className="icon" />
                            <h4>{profession}</h4>
                        </div>
                    </div>
                </div>
                <div className='job-display-sector'>
                    <div className='job-display-info'>
                        <img src="/clock.png" alt="User Icon" className="icon" />
                        <h4>Απασχόληση: {type}</h4>
                    </div>

                    <div className='job-display-info'>
                        <img src="/experience.png" alt="User Icon" className="icon" />
                        <h4>Προαπαιτούμενη εμπειρία: {experience} έτη</h4>
                    </div>
                    <div className='job-display-info'>
                        <img src="/salary.png" alt="User Icon" className="icon" />
                        <h4>Ετήσιος μισθός: {salary} €</h4>
                    </div>
                </div>
                <div className='job-display-sector'>
                    <div className="chosen-skills-container" style={{marginBottom:'30px'}}>

                        <div className='chosen-skills-head'>
                            <h3>Επιλεγμένες Δεξιότητες</h3>
                        </div>
                        {skills.length > 0 ? (
                            <div className="chosen-skills-grid">
                                {skills.map((skill, index) => (
                                    <div key={index} className="chosen-skill-box" style={{ color: 'black' }}>
                                        {skill}
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <p>
                                Δεν έχουν επιλεγεί δεξιότητες
                            </p>
                        )}
                    </div>
                </div>
                <div className='job-display-sector'>
                    <div className='job-display-info'>
                        <p>
                            <h4>Περισσότερες πληροφορίες:</h4>
                            <>{detail}</>
                        </p>
                    </div>
                </div>
            </div>

            {submitted ? (
                <div>Έχετε υποβάλει ήδη αίτηση για αυτήν την αγγελία</div>
            ) : (
                <div className='send-right'>
                    <button onClick={(e) => handleSubmit(e)} className='button-primary'>Αίτηση</button>
                </div>
            )}

        </div>
    );
};

export default Job;