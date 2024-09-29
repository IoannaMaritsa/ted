import React, { useState, useEffect, useMemo } from 'react';
import { getAllSkills, getAllSkillsForUser } from '../../api';
import { useAppContext } from "../../context/appContext";
import "../../css/popup.css";

// Popup for skill addition
const AddSkillsPopup = ({ isOpen, onClose, onAddSkills }) => {
    const { user } = useAppContext();
    const [skills, setSkills] = useState([]);
    const [chosen, setChosen] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const skillsPerPage = 12;
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
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddClick = () => {
        if (chosen.length > 0) {
            onAddSkills(chosen);
            onClose();
        } else {
            alert('Παρακαλώ προσθέστε δεξιότητες');
        }
    };

    const handleRemove = () => {
        setChosen([]);
    };

    // Add selected skill to chosen list
    const AddSkill = (skillname) => {
        // Check if skill is already chosen
        if (!chosen.includes(skillname)) {
            setChosen((prevChosen) => [...prevChosen, skillname]);
        }
    };

    const getSkills = async () => {
        try {
            // Filter out skills that the user already has
            const response = await getAllSkills();
            const userskills = await getAllSkillsForUser(user.id);

            if (userskills && userskills.length > 0) {
                const filteredSkills = response.filter(skill => {
                    return !userskills.some(userSkill => userSkill.skill_name === skill.skill_name);
                });

                setSkills(filteredSkills);
            }
            else setSkills(response);


            setIsLoading(false);
        } catch (error) {
            console.error('Error getting skills:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSkills();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="add-work-experience-modal">
            <div className="add-skill-modal-content3">
                <div className="add-work-experience-modal-header">
                    <div className="add-work-experience-modal-title">Προσθήκη Δεξιοτήτων</div>
                    <img
                        className="add-work-experience-modal-close-btn"
                        src="/close-icon.png"
                        onClick={onClose}
                        alt="Close"
                    />
                </div>
                <div className="add-work-experience-modal-body">
                    <div className="send-right">
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
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <>
                                <div className="skills-grid">
                                    {currentSkills.map((skill, index) => (
                                        <div key={index} className="skill-box" onClick={() => AddSkill(skill.skill_name)}>
                                            {skill.skill_name}
                                        </div>
                                    ))}
                                </div>
                                <div className="pagination">
                                    <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                                        Προηγούμενο
                                    </button>
                                    <span>Σελίδα {currentPage} από {totalPages}</span>
                                    <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Επόμενο
                                    </button>
                                </div>
                            </>
                        )}

                    </div>

                    <div className="chosen-skills-container">

                        <div className='chosen-skills-head'>
                            <h3>Επιλεγμένες Δεξιότητες</h3>
                            <img src='/again.png' style={{ cursor: 'pointer' }} className='icon' onClick={handleRemove} />
                        </div>
                        {chosen.length > 0 && (
                            <div className="chosen-skills-grid">
                                {chosen.map((skill, index) => (
                                    <div key={index} className="chosen-skill-box">
                                        {skill}
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>
                </div>
                <div className="add-work-experience-modal-footer">
                    <button onClick={handleAddClick}>Προσθήκη</button>
                </div>
            </div>
        </div>
    );
};

export default AddSkillsPopup;