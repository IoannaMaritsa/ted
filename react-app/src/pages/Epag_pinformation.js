import React, { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import Breadcrumbs from "../components/Breadcrumbs";
import PrivacyPopup from "../components/popups/PrivacyPopup";
import AddWorkExperiencePopup from "../components/AddWorkExperiencePopup";
import AddStudiesPopup from "../components/popups/AddStudiesPopup";
import AddSkillsPopup from "../components/popups/AddSkillsPopup";
import EditPopup from "../components/popups/EditPopup";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import { getAllExperiencesForUser, getAllStudiesForUser, getAllSkillsForUser, updateUser, addExperience, deleteExperience, addStudy, deleteStudy, addSkillToUser, deleteSkillFromUser, getPrivacySettings, updatePrivacy } from "../api";
import getImageUrl from "../hooks/getImageUrl";
import { formatDateRange } from "../utils/timeUtils";

export default function Epag_pinformation() {
    const { user } = useAppContext();
    const [workExperience, setWorkExperience] = useState([]);
    const [studies, setStudies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [privacySettings, setPrivacySettings] = useState([]);

    const getExperiences = async () => {
        try {
            const response = await getAllExperiencesForUser(user.id);
            setWorkExperience(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getStudies = async () => {
        try {
            const response = await getAllStudiesForUser(user.id);
            setStudies(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getSkills = async () => {
        try {
            const response = await getAllSkillsForUser(user.id);
            setSkills(response);
        } catch (error) {
            console.error('Error getting experiences:', error);
        }
    };

    const getPrivacy = async () => {
        try {
            const response = await getPrivacySettings(user.email);
            setPrivacySettings(response);
        } catch (error) {
            console.error('Error getting privacy settings:', error);
        }
    };

    useEffect(() => {
        getExperiences();
        getStudies();
        getSkills();
        getPrivacy();
    }, [user]);

    

    // States to manage modal visibility
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
    const [isAddStudiesModalOpen, setAddStudiesModalOpen] = useState(false);
    const [isAddSkillsModalOpen, setAddSkillsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);


    const openPrivacyModal = (field) => {
        setCurrentField(field);
        setModalOpen(true);
    };

    const closePrivacyModal = () => {
        setModalOpen(false);
        setCurrentField(null);
    };

    // Function to update privacy settings
    const changePrivacySetting = async (newPrivacy) => {
        try {
            updatePrivacy(user.email, currentField, newPrivacy);
        } catch (error) {
            console.error('Error updating privacy settings:', error);
        }
        closePrivacyModal();
        await getPrivacy();
        window.location.reload();
    };


    // Function to get icon based on privacy setting
    const getPrivacyIcon = (privacy) => {
        if (privacy)
            return "/private.png";
        else 
            return "/planet.png";

    };

    // Delete handlers
    const handleDeleteExperience = async (id) => {
        try {
            await deleteExperience(id);
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
        getExperiences();
    };

    const handleDeleteStudies = async (id) => {
        try {
            await deleteStudy(id);
        } catch (error) {
            console.error('Error deleting study:', error);
        }
        getStudies();
    };

    const handleDeleteSkills = async (userid, skillid) => {
        try {
            await deleteSkillFromUser(userid, skillid);
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
        getSkills();
    };

    // Functions for closing and opening the modals
    const openEditModal = () => {
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        window.location.reload();
    };

    const openAddStudiesModal = () => {
        setAddStudiesModalOpen(true);
    };

    const closeAddStudiesModal = () => {
        setAddStudiesModalOpen(false);
    };
    const openAddExperienceModal = () => {
        setAddExperienceModalOpen(true);
    };

    const closeAddExperienceModal = () => {
        setAddExperienceModalOpen(false);
    };

    const openAddSkillsModal = () => {
        setAddSkillsModalOpen(true);
    };

    const closeAddSkillsModal = () => {
        setAddSkillsModalOpen(false);
    };


    // Functions to add new rows
    const handleAddExperience = async (newExperience) => {
        try {
            await addExperience(user.id, newExperience.profession, newExperience.workplace, newExperience.start_date, newExperience.end_date);
        } catch (error) {
            console.error('Error adding experience:', error);
        }
        getExperiences();
    };

    const handleAddStudies = async (newStudy) => {
        try {
            await addStudy(user.id, newStudy.university, newStudy.degree, newStudy.start_date, newStudy.end_date);
        } catch (error) {
            console.error('Error adding study:', error);
        }
        getStudies();
    };


    const handleAddSkills = async (newSkills) => {
        try {
            await Promise.all(
                newSkills.map(async (newSkill) => {
                    await addSkillToUser(user.id, newSkill);
                })
            );
            
        } catch (error) {
            console.error('Error adding skill:', error);
        }
        getSkills();
    };

    // Function to update the profile
    const handleSaveProfile = async (updatedProfile) => {
        try {
            await updateUser(user.email, updatedProfile);
        } catch (error) {
            console.error('Error adding experience:', error);
        }
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
                                <div class="a-profile-pic"> <img src={getImageUrl(user?.profilepic, "profilepics")} alt="Profile" /></div>
                                <div class="user-text">
                                    <div class="a-name">{user.name}</div>
                                    <div class="a-profession">{user.profession}</div>
                                </div>
                                <div className="button-1-cont">

                                    <button className="edit-button" onClick={openEditModal}> Επεξεργασία Προφίλ <img src="/edit-yellow2.png" alt="Message" className="pr-icon3" ></img></button>
                                </div>
                            </div>
                            <div class="a-square-div4">
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/work-icon.png" alt="Icon 1" />
                                    <span class="a-text1">{user.workplace}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings[0]?.work_private)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("work_private")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/location.png" alt="Icon 2" />
                                    <span class="a-text1">{user.location}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings[0]?.location_private)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("location_private")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/birthday.png" alt="Icon 3" />
                                    <span class="a-text1">{user.dob}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings[0]?.birthday_private)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("birthday_private")}
                                    />
                                </div>
                                <div class="a-icon-text1">
                                    <img class="a-icon1" src="/email.png" alt="Icon 4" />
                                    <span class="a-text1">{user.email}</span>
                                    <img
                                        className="a-icon-right"
                                        src={getPrivacyIcon(privacySettings[0]?.email_private)}
                                        alt="Privacy Icon"
                                        onClick={() => openPrivacyModal("email_private")}
                                    />
                                </div>
                            </div>



                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title2">
                                Επαγγελματική Εμπειρία
                                <img
                                    className="work-experience-privacy-icon"
                                    src={getPrivacyIcon(privacySettings[0]?.workExperience_private)}
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("workExperience_private")}
                                />
                            </div>
                            {workExperience.length > 0 ? (
                                workExperience.map((experience, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                            <div className="work-role">{experience.profession}</div>
                                            <div className="work-company">{experience.workplace}</div>
                                            <div className="work-duration"><span>{formatDateRange(experience.start_date, experience.end_date)}</span></div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"
                                            alt="Delete"
                                            onClick={() => handleDeleteExperience(experience.id)}
                                        />
                                    </div>

                                ))
                            ) : (
                                <p></p>
                            )}
                            <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddExperienceModal} />
                                <span className="footer-text" onClick={openAddExperienceModal}  >Προσθήκη Επαγγελματικών Εμπειριών</span>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title2">
                                Σπουδές
                                <img
                                    className="work-experience-privacy-icon2"
                                    src={getPrivacyIcon(privacySettings[0]?.studies_private)}
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("studies_private")}
                                />
                            </div>
                            {studies.length > 0 ? (
                                studies.map((study, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                            <div className="work-role">{study.university}</div>
                                            <div className="work-company">{study.degree}</div>
                                            <div className="work-duration"><span>{study.start_date}</span> - <span>{study.end_date}</span></div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"
                                            alt="Delete"
                                            onClick={() => handleDeleteStudies(study.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                            <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddStudiesModal} />
                                <span className="footer-text" onClick={openAddStudiesModal}  >Προσθήκη Σπουδών</span>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title2">
                                Δεξιότητες
                                <img
                                    className="work-experience-privacy-icon3"
                                    src={getPrivacyIcon(privacySettings[0]?.skills_private)}
                                    alt="Privacy Icon"
                                    onClick={() => openPrivacyModal("skills_private")}
                                />
                            </div>
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div key={index} className="work-experience-row2">
                                        <div className="work-experience-info">
                                            <div className="work-role">{skill.skill_name}</div>
                                        </div>
                                        <img
                                            className="delete-icon"
                                            src="/trash.png"
                                            alt="Delete"
                                            onClick={() => handleDeleteSkills(user.id, skill.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                            <div className="work-experience-footer" >
                                <img src="/yellow-add.png" alt="Icon" className="footer-icon" onClick={openAddSkillsModal} />
                                <span className="footer-text" onClick={openAddSkillsModal}  >Προσθήκη Δεξιοτήτων</span>
                            </div>
                        </div>


                    </div>
                </div>
                {isModalOpen && (
                    <PrivacyPopup isOpen={isModalOpen} onClose={closePrivacyModal} onChangePrivacySetting={changePrivacySetting} currentPrivacy={privacySettings.find(setting => setting.hasOwnProperty(currentField))?.[currentField]} />
                )
                }
                {isEditModalOpen && (
                    <EditPopup isOpen={isEditModalOpen} onClose={closeEditModal} currentProfile={user} onSave={handleSaveProfile} />
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
