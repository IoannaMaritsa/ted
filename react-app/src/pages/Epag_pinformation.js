import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import Breadcrumbs from "../components/Breadcrumbs";
import PrivacyPopup from "../components/PrivacyPopup";
import AddWorkExperiencePopup from "../components/AddWorkExperiencePopup";
import AddStudiesPopup from "../components/AddStudiesPopup";
import AddSkillsPopup from "../components/AddSkillsPopup";
import EditPopup from "../components/EditPopup";

export default function Epag_pinformation() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        profilePic: '/default-avatar.jpeg', // Default profile picture URL
        profession: 'Software Developer',
        email: 'johndoe@gmail.com',
        birthday: '12/12/2002',
        location: 'Athens, Greece',
        workplace: 'Google',

    });

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


    const [privacySettings, setPrivacySettings] = useState({
        work: "private",
        location: "private",
        birthday: "private",
        email: "private",
        workExperience: "private",
        studies: "private",
        skills: "private",
    });
    


    // State to manage modal visibility and current field being edited
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
    const [isAddStudiesModalOpen, setAddStudiesModalOpen] = useState(false);
    const [isAddSkillsModalOpen, setAddSkillsModalOpen] = useState(false);
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

    const handleDeleteExperience = (indexToRemove) => {
        setWorkExperience((prevExperiences) =>
            prevExperiences.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleDeleteStudies = (indexToRemove) => {
        setStudies((prevStudies) =>
            prevStudies.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleDeleteSkills = (indexToRemove) => {
        setSkills((prevSkills) =>
            prevSkills.filter((_, index) => index !== indexToRemove)
        );
    };

    const openEditModal = () => {
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const openAddExperienceModal = () => {
        setAddExperienceModalOpen(true);
    };

    const closeAddExperienceModal = () => {
        setAddExperienceModalOpen(false);
    };

    const handleAddExperience = (newExperience) => {
        setWorkExperience([...workExperience, newExperience]);
    };

    const openAddStudiesModal = () => {
        setAddStudiesModalOpen(true);
    };

    const closeAddStudiesModal = () => {
        setAddStudiesModalOpen(false);
    };

    const handleAddStudies = (newStudy) => {
        setStudies([...studies, newStudy]);
    };

    const openAddSkillsModal = () => {
        setAddSkillsModalOpen(true);
    };

    const closeAddSkillsModal = () => {
        setAddSkillsModalOpen(false);
    };

    const handleAddSkills = (newSkills) => {
        setSkills([...skills, newSkills]);
    };
    
    const handleSaveProfile = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <main className="adminu-main-div">
                <div className="main-container">
                    <div className="inner-container">
                        <div class="a-container">
                            <div class="a-square-div">
                                <div class="a-profile-pic"> <img src={profile.profilePic} alt="Profile"></img></div>
                                <div class="user-text">
                                    <div class="a-name">{profile.name}</div>
                                    <div class="a-profession">{profile.profession}</div>
                                </div>
                                <div className="button-1-cont">

                                    <button className="edit-button" onClick={openEditModal}> Επεξεργασία Προφίλ <img src="/edit-yellow2.png" alt="Message" className="pr-icon3" ></img></button>
                                </div>
                            </div>
                            <div class="a-square-div4">
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/work-icon.png" alt="Icon 1" />
                                    <span class="a-text1">{profile.workplace}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.work)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("work")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/location.png" alt="Icon 2" />
                                    <span class="a-text1">{profile.location}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings.location)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("location")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/birthday.png" alt="Icon 3" />
                                    <span class="a-text1">{profile.birthday}</span>
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
                            <div className="work-experience-row-title2">
                                Επαγγελματική Εμπειρία
                                <img
                                    className="work-experience-privacy-icon"
                                    src={getPrivacyIcon(privacySettings.workExperience)}  // Use a privacy state specific to work experience
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("workExperience")}  // Pass 'workExperience' as the field
                                />
                            </div>
                            {workExperience.length > 0 ? (
                                workExperience.map((experience, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                            <div className="work-role">{experience.role}</div>
                                            <div className="work-company">{experience.company}</div>
                                            <div className="work-duration">{experience.duration}</div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"  // Replace with your delete icon path
                                            alt="Delete"
                                            onClick={() => handleDeleteExperience(index)}  // Call the delete function with the index
                                        />
                                    </div>

                                ))
                            ) : (
                                <p></p>
                            )}
                            <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddExperienceModal} /> {/* Replace with your icon path */}
                                <span className="footer-text" onClick={openAddExperienceModal}  >Προσθήκη Επαγγελματικών Εμπειριών</span>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title2">
                                Σπουδές
                                <img
                                    className="work-experience-privacy-icon2"
                                    src={getPrivacyIcon(privacySettings.studies)}  // Use a privacy state specific to work experience
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("studies")}  // Pass 'workExperience' as the field
                                />
                            </div>
                            {studies.length > 0 ? (
                                studies.map((study, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                            <div className="work-role">{study.school}</div>
                                            <div className="work-company">{study.degree}, {study.major}</div>
                                            <div className="work-duration">{study.duration}</div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"  // Replace with your delete icon path
                                            alt="Delete"
                                            onClick={() => handleDeleteStudies(index)}  // Call the delete function with the index
                                        />
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                            <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddStudiesModal} /> {/* Replace with your icon path */}
                                <span className="footer-text" onClick={openAddStudiesModal}  >Προσθήκη Σπουδών</span>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title2">
                                Δεξιότητες
                                <img
                                    className="work-experience-privacy-icon3"
                                    src={getPrivacyIcon(privacySettings.skills)}  // Use a privacy state specific to work experience
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("skills")}  // Pass 'workExperience' as the field
                                />
                            </div>
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                        <div className="work-role">{skill.name}</div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"  // Replace with your delete icon path
                                            alt="Delete"
                                            onClick={() => handleDeleteSkills(index)}  // Call the delete function with the index
                                        />
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                             <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddSkillsModal} /> {/* Replace with your icon path */}
                                <span className="footer-text" onClick={openAddSkillsModal}  >Προσθήκη Δεξιοτήτων</span>
                            </div>
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
                    <PrivacyPopup isOpen={isModalOpen} onClose={closePrivacyModal} onChangePrivacySetting={changePrivacySetting} currentPrivacy={privacySettings[currentField]} />
                )
                }
                {isEditModalOpen && (
                    <EditPopup isOpen={isEditModalOpen} onClose={closeEditModal} currentProfile={profile} onSave={handleSaveProfile} />
                )
                }
                {isAddExperienceModalOpen && (
                    <AddWorkExperiencePopup isOpen={isAddExperienceModalOpen} onClose={closeAddExperienceModal} onAddExperience={handleAddExperience} />
                )}
                 {isAddStudiesModalOpen && (
                    <AddStudiesPopup isOpen={isAddStudiesModalOpen} onClose={closeAddStudiesModal} onAddStudies={handleAddStudies} />
                )}
                {isAddSkillsModalOpen && (
                    <AddSkillsPopup isOpen={isAddSkillsModalOpen} onClose={closeAddSkillsModal} onAddSkills={handleAddSkills} />
                )}
            </main >
            <MainBottom />
            <Footer />

        </div >
    );
};
