import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
//import { useAppContext } from "../context/appContext";
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/admin.css';
import {exportDataProfile} from '../utils/exportUtils';

import { getUser, getAllContactsByUserEmail, getAllExperiencesForUser, getAllStudiesForUser, getAllSkillsForUser, getJobsOfUser, getCommentsOfUser, getUserInterests, getArticleById} from "../api";
import getImageUrl from "../hooks/getImageUrl";
import { format} from 'date-fns';
import { formatDateRange } from "../utils/timeUtils";

export default function Diax_Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userEmail } = location.state || {};
    const [otherProfile, setOtherProfile] = useState(null);
    const [exportFormat, setExportFormat] = useState('json');
    const [workExperience, setWorkExperience] = useState([]);
    const [studies, setStudies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [jobAds, setJobAds] = useState([]);
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState([]);
    const [interests, setInterests] = useState([]);
    const [contacts, setContacts] = useState([]);

    // Fetch the user's profile data based on the email
    useEffect(() => {
        const fetchProfile = async () => {
            console.error("email", userEmail);
            if (userEmail) {
                try {

                    const profileData = await getUser(userEmail); // Assuming getUser returns a Promise
                    setOtherProfile(profileData);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
        };

        fetchProfile();
    }, [userEmail]);

    const getArticles = async () => {
        try {
            const response = await getArticle(otherProfile.email);
            setArticles(response);
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const getExperiences = async () => {
        try {
            const response = await getAllExperiencesForUser(otherProfile.id);
            setWorkExperience(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getStudies = async () => {
        try {
            const response = await getAllStudiesForUser(otherProfile.id);
            setStudies(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getSkills = async () => {
        try {
            const response = await getAllSkillsForUser(otherProfile.id);
            setSkills(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getJobs = async () => {
        try {

            const newjobs = await getJobsOfUser(otherProfile.email);
            console.log(`Got a job successfully.`);
            if (newjobs.success)
                setJobAds(newjobs.data)

        } catch (error) {
            console.error('Error getting jobs:', error);
        }
    };

    const getArticle = async (id) => {
        try {
            const article = await getArticleById(id);
            return(article.title);
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const getComments = async () => {
        try {
            const comments = await getCommentsOfUser(otherProfile.email);
            
            const comments2 = await Promise.all(
                comments.map(async (comment) => {
                    const article_name = await getArticle(comment.article_id); // Await here to get the resolved value
                    
                    return {
                        article_name,
                        text: comment.text,
                        date: format(new Date(comment.created_at), 'yyyy-MM-dd hh:mm:ss')
                    };
                })
            );
    
            setComments(comments2);
    
        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };

    const getInterest = async () => {
        try {
            const interests = await getUserInterests(otherProfile.email);
            console.log('got interests', interests);
            const interests2 = await Promise.all(
                interests.map(async (interest) => {
                    const article_name = await getArticle(interest.article_id); // Await here to get the resolved value
                    
                    return {
                        article_name,
                        date: format(new Date(interest.date), 'yyyy-MM-dd hh:mm:ss')
                    };
                })
            );
    
            setInterests(interests2);
        } catch (error) {
            console.error('Error getting interests:', error);
        }
    };

    const getContacts = async () => {
        try {
            const contacts = await getAllContactsByUserEmail(otherProfile.email);
            const contactEmails = contacts.map(contact => contact.contact_email);
            const contactDetailsPromises = contactEmails.map(email => getUser(email));
            const contactsData = await Promise.all(contactDetailsPromises);

            setContacts(contactsData); // Store the full contact details in state
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    useEffect(() => {
        getArticles();
        getExperiences();
        getStudies();
        getSkills();
        getJobs();
        getComments();
        getInterest();
        getContacts();
        
    }, [otherProfile]);


    const handleExport = () => {
        const data = {
            otherProfile,
            workExperience,
            studies,
            skills,
            jobAds,
            articles,
            comments,
            interests
        };
        exportDataProfile(data, exportFormat, 'export');
      };

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };
    
    return (
        <div>
            <Header variant="admin" />
            <nav className="breadcrumbs"> <img src="/home.png" className='home-icon' alt="Home" style={{ cursor: 'pointer' }} onClick={handleBackClick}/> &nbsp; / Προφίλ Χρήστη</nav>
            <main className="adminu-main-div">
                <div className="main-container">
                <div className="back-icon-container">
                        <img
                            src="/back-icon.png" // Replace with your icon path
                            alt="Back"
                            className="back-icon"
                            onClick={handleBackClick}
                        />
                    </div>
                    <div className="inner-container">
                        <div class="a-container">
                            <div class="a-square-div">
                                <div class="a-profile-pic"> <img src={getImageUrl(otherProfile?.profilepic, "profilepics")} alt ="Profile"></img></div>
                                <div class="user-text">
                                    <div class="a-name">{otherProfile?.name}</div>
                                    <div class="a-profession">{otherProfile?.profession}</div>
                                </div>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="export-select"
                                >
                                    <option value="json">JSON</option>
                                    <option value="xml">XML</option>
                                </select>
                                <button class="a-export-button" onClick={handleExport}> <img src="export.png" alt="Export Icon" class="export-icon"></img>
                                    Export</button>
                            </div>
                            <div class="a-square-div2">
                                <div class="a-icon-text">
                                    <img class="a-icon" src="work-icon.png" alt="Icon 1" />
                                    <span class="a-text">{otherProfile?.workplace}</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="location.png" alt="Icon 2" />
                                    <span class="a-text" >{otherProfile?.location}</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="birthday.png" alt="Icon 3" />
                                    <span class="a-text">{otherProfile?.dob}</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="email.png" alt="Icon 3" />
                                    <span class="a-text">{otherProfile?.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Επαγγελματική Εμπειρία
                            </div>
                            {(workExperience && workExperience.length > 0) ? (
                                workExperience.map((experience, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{experience.profession}</div>
                                        <div className="work-company">{experience.workplace}</div>
                                        <div className="work-duration"><span>{formatDateRange(experience.start_date, experience.end_date)}</span></div>
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχει διαθέσιμη επαγγελματική εμπειρία</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Σπουδές
                            </div>
                            {(studies && studies.length > 0) ? (
                                studies.map((study, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{study.university}</div>
                                        <div className="work-company">{study.degree}</div>
                                        <div className="work-duration"><span>{study.start_date}</span> - <span>{study.end_date}</span></div>
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχουν διαθέσιμες σπουδές</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Δεξιότητες
                            </div>
                            {(skills && skills.length > 0) ? (
                                skills.map((skill, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{skill.skill_name}</div>
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχουν διαθέσιμες δεξιότητες</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Αγγελίες
                            </div>
                            {(studies && studies.length > 0) ? (
                                jobAds.map((ad, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{ad.title}</div>
                                        <div className="work-duration">{format(ad.publish_date, 'yyyy-MM-dd')}</div>
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχουν διαθέσιμες αγγελίες</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Άρθρα
                            </div>
                            {(articles && articles.length > 0) ? (
                                articles.map((article, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{article.title}</div>
                                        <div className="work-duration">{format(article.publish_date, 'yyyy-MM-dd')}</div>
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχουν διαθέσιμα άρθρα</p>
                            )}
                        </div>
                        <div class="a-container">
                            <div class="a-square-div3">
                                <div className="work-experience-row-title">
                                    Σχόλια
                                    <img src="comments.png" alt="Comments Icon"></img>
                                </div>
                                {(comments && comments.length > 0) ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="post-name">{comment.article_name}</div>
                                            <div className="comment1">"{comment.text}"</div>
                                            <div className="work-duration">{comment.date}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Δεν υπάρχουν διαθέσιμα σχόλια</p>
                                )}
                            </div>
                            <div class="a-square-div4">
                                <div className="work-experience-row-title">
                                    Σημειώσεις Ενδιαφέροντος
                                    <img src="heart.png" alt="Heart Icon"></img>
                                </div>
                                {(interests && interests.length > 0 ) ? (
                                    interests.map((like, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="post-name">{like.article_name}</div>
                                            <div className="work-duration">{like.date}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Δεν υπάρχουν διαθέσιμες σημειώσεις ενδιαφέροντος</p>
                                )}
                            </div>
                        </div>
                        <div class="a-square-div3">
                                <div className="work-experience-row-title">
                                    Συνδέσεις
                                    <img src="/community.png" alt="Comments Icon"></img>
                                </div>
                                {(contacts && contacts.length > 0) ? (
                                    <div className="contacts-page" >
                                    <ul className="contacts-list" >
                                        {contacts?.map((contact, index) => (
                                            <div className="contact" style={{ cursor: 'default' }}>
                                                <img src={getImageUrl(contact.profilepic, "profilepics")} alt="contact-pic" className="contact-icon" />
                                                <li className="profile-sect-contact" key={index}>{contact.name} </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                                ) : (
                                    <p>Δεν υπάρχουν διαθέσιμες συνδέσεις</p>
                                )}
                            </div>
                    </div>
                </div>
            </main>
            <MainBottom />
            <Footer />
        </div>
    );
};
