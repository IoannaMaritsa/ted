import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import Breadcrumbs from "../components/Breadcrumbs";

export default function Epag_pinformation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: 'John Doe',
        profilePic: '/default-avatar.jpeg', // Default profile picture URL
        email: 'johndoe@gmail.com'
    });
    const [exportFormat, setExportFormat] = useState('json');

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

    const [privacySettings, setPrivacySettings] = useState({
        work: "private",
        location: "private",
        birthday: "private",
        email: "private",
    });


    // State to manage modal visibility and current field being edited
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);

    // Function to open modal and set current field
    const openPrivacyModal = (field) => {
        setCurrentField(field);
        setModalOpen(true);
    };

    // Function to close modal
    const closePrivacyModal = () => {
        setModalOpen(false);
        setCurrentField(null);
    };

    const changePrivacySetting = (newPrivacy) => {
        setPrivacySettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                [currentField]: newPrivacy,
            };
            console.log("Updated Privacy Settings:", updatedSettings); // Debugging
            return updatedSettings;
        });
        closePrivacyModal();
    };


    // Function to get icon based on privacy setting
    const getPrivacyIcon = (privacy) => {
        switch (privacy) {
            case "public":
                return "/planet.png";
            case "friends":
                return "/friends.png";
            case "private":
            default:
                return "/private.png";
        }
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
                                <div class="a-profile-pic"> <img src={profile.profilePic} alt="Profile"></img></div>
                                <div class="user-text">
                                    <div class="a-name">{profile.name}</div>
                                    <div class="a-profession">Software Engineer</div>
                                </div>
                                <div className="button-1-cont">

                                    <button className="edit-button"> Επεξεργασία Προφίλ <img src="/edit-yellow2.png" alt="Message" className="pr-icon3"></img></button>
                                </div>
                            </div>
                            <div class="a-square-div4">
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/work-icon.png" alt="Icon 1" />
                                    <span class="a-text1">Google</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.work)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("work")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/location.png" alt="Icon 2" />
                                    <span class="a-text1">Athens, Greece</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.location)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("location")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/birthday.png" alt="Icon 3" />
                                    <span class="a-text1">2002-12-12</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.birthday)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("birthday")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/email.png" alt="Icon 4" />
                                    <span class="a-text1">{profile.email}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.email)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("email")}
                                    />
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
                {isModalOpen && (
                    <div className="privacy-modal">
                        <div className="privacy-modal-content">
                            <div className="privacy-modal-header">
                                <div className="privacy-modal-title">Επεξεργασία Ιδιωτικότητας</div>
                                <img className="privacy-modal-close-btn" src="close-icon.png" onClick={closePrivacyModal}>
                                </img>
                            </div>

                            <div className="privacy-row">
                                <img className="privacy-row-icon" src="/icon1.png" alt="Icon 1" />
                                <div className="privacy-row-text">
                                    <span className="bold">Public</span>
                                    <span className="regular">Visible to everyone</span>
                                </div>
                                <input type="radio" name="privacy" value="public" className="privacy-row-radio" />
                            </div>
                            <div className="privacy-row">
                                <img className="privacy-row-icon" src="/icon2.png" alt="Icon 2" />
                                <div className="privacy-row-text">
                                    <span className="bold">Friends Only</span>
                                    <span className="regular">Visible to friends only</span>
                                </div>
                                <input type="radio" name="privacy" value="friends" className="privacy-row-radio" />
                            </div>
                            <div className="privacy-row">
                                <img className="privacy-row-icon" src="/icon3.png" alt="Icon 3" />
                                <div className="privacy-row-text">
                                    <span className="bold">Private</span>
                                    <span className="regular">Visible only to you</span>
                                </div>
                                <input type="radio" name="privacy" value="private" className="privacy-row-radio" />
                            </div>
                            <button >Save</button>
                        </div>
                    </div>
                 
    )
}
            </main >
            <MainBottom />
            <Footer />

        </div >
    );
};
