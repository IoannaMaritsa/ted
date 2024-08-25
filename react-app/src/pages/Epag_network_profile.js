import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate} from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import Breadcrumbs from "../components/Breadcrumbs";

export default function Epag_network_profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { otherProfile } = location.state || {};

    const [workExperience, setWorkExperience] = useState([
        { company: 'Google', role: 'Software Engineer', duration: 'Jan 2020 - Dec 2021' },
        { company: 'Microsoft', role: 'Frontend Developer', duration: 'Jan 2019 - Dec 2019' },
        // Add more entries as needed
    ]);

    const [studies, setStudies] = useState([
        { school: "National and Kapodistrian University of Athens", degree: "Undergraduate Degree", major: "Software Engineering", duration: "2016 - 2020" },
        { school: "Harvard", degree: "Masters", major: "Comp Sci", duration: "2020 - 2024" },
        // Add more entries as needed
    ]);

    const [skills, setSkills] = useState([
        { name: "Customer Satisfaction" },
        { name: "C++ Knowledge" },
        { name: "Python Knowledge" },
        { name: "React Framework" },
        // Add more entries as needed
    ]);

    const [jobAds, setJobAds] = useState([
        { name: "Ζητείται Software Developer", date: "10/07/2024" },
        { name: "Ζητείται Backend Developer για μόνιμη απασχόληση", date: "13/02/2020" },

        // Add more entries as needed
    ]);

    const [articles, setArticles] = useState([
        { name: "Τάσεις Ανάπτυξης Λογισμικού για το 2024: Από την Τεχνητή Νοημοσύνη μέχρι την Αυτοματοποίηση", date: "30/11/2023" },
        { name: "Ο Ρόλος των DevOps στη Σύγχρονη Ανάπτυξη Λογισμικού: Βελτιώνοντας την Απόδοση και τη Συνεργασία", date: "23/09/2019" },
        { name: "Ανασκόπηση των Νέων Τεχνολογιών: Πώς τα Frameworks και οι Γλώσσες Προγραμματισμού Εξελίσσονται για να Ικανοποιήσουν τις Σύγχρονες Ανάγκες", date: "20/08/2019" }

        // Add more entries as needed
    ]);


    const handleBackClick = () => {
       navigate(-1); // Navigate to the previous page
    };



    return (
        <div>
             <Header variant="professional" />
            <Breadcrumbs />
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
                                <div class="a-profile-pic"> <img src={otherProfile.profilePic} alt="Profile"></img></div>
                                <div class="user-text">
                                    <div class="a-name">{otherProfile.name}</div>
                                    <div class="a-profession">Software Engineer</div>
                                </div>
                                <div className="button-1-cont">
                                    <button className="connect-button"> Σύνδεση <img src="/friend-req.png" alt="Friend Request" className="pr-icon1"></img></button>
                                    <button className="message-button"> Μήνυμα <img src="/mess-icon.png" alt="Message" className="pr-icon2"></img></button>
                                </div>
                            </div>
                            <div class="a-square-div2">
                                <div class="a-icon-text">
                                    <img class="a-icon" src="/work-icon.png" alt="Icon 1" />
                                    <span class="a-text">Google</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="/location.png" alt="Icon 2" />
                                    <span class="a-text" >Athens, Greece</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="/birthday.png" alt="Icon 3" />
                                    <span class="a-text">2002-12-12</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="/email.png" alt="Icon 3" />
                                    <span class="a-text">{otherProfile.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Επαγγελματική Εμπειρία
                            </div>
                            {workExperience.length > 0 ? (
                                workExperience.map((experience, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{experience.role}</div>
                                        <div className="work-company">{experience.company}</div>
                                        <div className="work-duration">{experience.duration}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No work experience available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Σπουδές
                            </div>
                            {studies.length > 0 ? (
                                studies.map((study, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{study.school}</div>
                                        <div className="work-company">{study.degree}, {study.major}</div>
                                        <div className="work-duration">{study.duration}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No studies available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Δεξιότητες
                            </div>
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{skill.name}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No skills available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Αγγελίες
                            </div>
                            {studies.length > 0 ? (
                                jobAds.map((ad, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{ad.name}</div>
                                        <div className="work-duration">{ad.date}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No job ads available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Άρθρα
                            </div>
                            {articles.length > 0 ? (
                                articles.map((article, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{article.name}</div>
                                        <div className="work-duration">{article.date}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No articles available</p>
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
