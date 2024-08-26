import React from 'react';
import './job_display.css';

const Job = ({ id, title, company, location, date, type, speciality, experience, salary, detail }) => {
    return (
        <div className="black-frame">
            <div className='job-display-box'>

                <div className='job-display-sector'>

                    <div className='job-display-time'>
                        <h5>{date}</h5>
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
                            <h4>{speciality}</h4>
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
                    <div className='job-display-info'>
                        <p>
                            <h5>Περισσότερες πληροφορίες:</h5>
                            <h4>{detail}</h4>
                        </p>
                    </div>
                </div>
            </div>
            <div className='job-display-buttons'>
                <button className='job-interest-button'>Με ενδιαφέρει</button>
                <button className='button-primary'>Αίτηση</button>
            </div>
        </div>
    );
};

export default Job;