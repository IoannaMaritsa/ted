import React from 'react';
import './job_display.css';

const Job = ({ id, title, company, location, date, type, speciality, experience, salary, detail }) => {
    return (
        <div className="article">
            <h2 className="article-title">{title}</h2>
            <div className="article-meta">
                <div className="article-author">
                    <img src="/user.png" alt="User Icon" className="icon" />
                    <span>{company}</span>
                    <span>{location}</span>
                    <span>{date}</span>
                </div>
                <div className="article-date">
                    <img src="/calendar.png" alt="Date icon" className="icon" />
                    <span>{type}</span>
                    <span>{speciality}</span>
                    <span>{experience}</span>
                </div>
            </div>
            <p className="article-content">{salary}</p>
            <p className="article-content">{detail}</p>
            <button className='interest-button'>Με ενδιαφέρει</button>
            <button className='button-primary'>Apply</button>
        </div>
    );
};

export default Job;