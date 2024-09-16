import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import { getUser, sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, updateFriendRequestStatus, addContact, removeContact, getFriendRequestByEmails, getAllContactsByUserEmail, deleteFriendRequest, getPrivacySettings } from "../api";
import { getArticle, getAllExperiencesForUser, getAllStudiesForUser, getAllSkillsForUser, getJobsOfUser } from "../api";
import Breadcrumbs from "../components/Breadcrumbs";
import getImageUrl from "../hooks/getImageUrl";
import { useAppContext } from "../context/appContext";
import { format } from 'date-fns';
import { formatDateRange, formatRelativeTime} from "../utils/timeUtils";

export default function Epag_network_profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userEmail } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [otherProfile, setOtherProfile] = useState(null); // State for the profile
    const { user, setMessageContact } = useAppContext();
    const [contacts, setContacts] = useState([]); // State for the contacts
    const [workExperience, setWorkExperience] = useState([]);
    const [studies, setStudies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [jobAds, setJobAds] = useState([]);
    const [articles, setArticles] = useState([]);
    const [privacySettings, setPrivacySettings] = useState([]);
    const [iscontact, setIscontact] = useState(false);
    const [othercontacts, setOthercontacts] = useState([]);



    // Log the email value for debugging
    useEffect(() => {
        console.log("userEmail from state:", userEmail);
    }, [userEmail]);

    // Fetch the user's profile data based on the email
    useEffect(() => {
        const fetchProfile = async () => {
            console.error("email", userEmail);
            if (userEmail) {
                if (userEmail === user.email) {
                    navigate(`/epaggelmatias_personal_info`);
                }
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


    useEffect(() => {
        //fetch the my contacts
        const fetchContacts = async () => {
            try {
                const contacts = await getAllContactsByUserEmail(user.email);
                setContacts(contacts.map(contact => contact.contact_email));
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        //fetch the contacts of the picked user
        const fetchOthercontacts = async () => {
            try {
                const contacts = await getAllContactsByUserEmail(otherProfile.email);
                const contactEmails = contacts.map(contact => contact.contact_email);
                const contactDetailsPromises = contactEmails.map(email => getUser(email));
                const contactsData = await Promise.all(contactDetailsPromises);

                setOthercontacts(contactsData); // Store the full contact details in state
            } catch (error) {
                console.error('Error getting articles:', error);
            }
        };

        fetchContacts();
        fetchOthercontacts();
        console.log(othercontacts);
    }, [userEmail, otherProfile]);

    const handleProfileClick = (user) => {
        console.log("email2", user.email);
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail: user.email } });
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const [sent, received] = await Promise.all([
                    getSentFriendRequests(user.email),
                    getReceivedFriendRequests(user.email)
                ]);
                setSentRequests(sent);
                setPendingRequests(received);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, [user.email]);

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

    const getPrivacy = async () => {
        try {
            const response = await getPrivacySettings(otherProfile.email);
            setPrivacySettings(response);
        } catch (error) {
            console.error('Error getting privacy settings:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIscontact(isAlreadyContact(otherProfile?.email));
            try {
                await Promise.all([
                    getArticles(),
                    getExperiences(),
                    getStudies(),
                    getSkills(),
                    getJobs(),
                    getPrivacy()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (otherProfile) {
            fetchData();
        }
    }, [otherProfile]);

    const isRequestPending = (targetEmail) => {
        return pendingRequests.some(req =>
            (req.sender_email === user.email && req.receiver_email === targetEmail) ||
            (req.receiver_email === user.email && req.sender_email === targetEmail)
        );
    };

    const hasSentRequest = (targetEmail) => {
        return sentRequests.some(req => req.receiver_email === targetEmail);
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };

    const handleConnectClick = async (targetUserEmail) => {
        if (!isRequestPending(targetUserEmail) && !hasSentRequest(targetUserEmail)) {
            try {
                const response = await sendFriendRequest(user.email, targetUserEmail);
                console.log("Friend request response:", response);
                // Update state with new sent request
                setSentRequests(prev => [...prev, { sender_email: user.email, receiver_email: targetUserEmail, status: 'pending' }]);
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        }
    };

    const isAlreadyContact = (targetEmail) => {
        return contacts.includes(targetEmail);
    };

    const handleAcceptRequest = async (senderEmail) => {
        try {
            const friendRequest = await getFriendRequestByEmails(senderEmail, user.email);
            if (friendRequest) {
                await updateFriendRequestStatus(friendRequest.id, 'accepted');
                await addContact(user.email, senderEmail);
                await addContact(senderEmail, user.email);
                await deleteFriendRequest(friendRequest.id);
                // Reload requests
                const [sent, received] = await Promise.all([
                    getSentFriendRequests(user.profile),
                    getReceivedFriendRequests(user.profile)
                ]);
                setSentRequests(sent);
                setPendingRequests(received);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleUnfriendClick = async (targetEmail) => {
        try {
            console.log(targetEmail, user.email)
            await removeContact(user.email, targetEmail);
            await removeContact(targetEmail, user.email);
            // Optionally, refresh the contact list
            const contacts = await getAllContactsByUserEmail(user.email);
            setContacts(contacts.map(contact => contact.contact_email));
        } catch (error) {
            console.error('Error removing contact:', error);
        }
    };

    const handleMessageClick = () => {
        setMessageContact(otherProfile)
        navigate(`/epaggelmatias_messages`);
    };

    const handleRejectRequest = async (senderEmail) => {
        try {
            const request = await getFriendRequestByEmails(senderEmail, user.email);
            if (request) {
                await updateFriendRequestStatus(request.id, 'rejected');
                await deleteFriendRequest(request.id);
                // Reload requests
                const [sent, received] = await Promise.all([
                    getSentFriendRequests(user.profile),
                    getReceivedFriendRequests(user.profile)
                ]);
                setSentRequests(sent);
                setPendingRequests(received);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const renderConnectionButton = () => {
        if (isAlreadyContact(otherProfile?.email)) {
            return (
                <div className="button-2-cont">
                    <button className="unfriend-button" onClick={() => handleUnfriendClick(otherProfile?.email)}>
                        Αφαίρεση Σύνδεσης
                        <img src="/unfriend.png" alt="Unfriend" className="unfriend-ic" />
                    </button>
                    <button className="message-button2" onClick={() => handleMessageClick()}>Μήνυμα
                        <img src="/mess-icon.png" alt="Message" className="mess-icon2" />
                    </button>
                </div>

            );
        } else if (isRequestPending(otherProfile?.email)) {
            return (
                <div className="button-div-no-301">
                    <button className="pending-button2" onClick={() => handleAcceptRequest(otherProfile?.email)}>
                        Αποδοχή
                    </button>
                    <button className="reject-button2" onClick={() => handleRejectRequest(otherProfile?.email)}>
                        Απόρριψη
                    </button>
                </div>
            );
        } else if (hasSentRequest(otherProfile?.email)) {
            return (
                <div className="button-div-no-300">
                    <span className="sent-button">
                        Έχει σταλθεί αίτημα σύνδεσης
                    </span>
                    <img src="/pending.png" alt="Pending" className="pending-ic" />
                </div>
            );
        } else {
            return (
                <button className="conn-button2" onClick={() => handleConnectClick(otherProfile?.email)}>
                    Σύνδεση
                    <img src="/yellow-req.png" alt="Friend Request" className="conn-icon2" />
                </button>
            );
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

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
                        <div className="a-container">
                            <div className="a-square-div">
                                <div className="a-profile-pic">
                                    <img src={getImageUrl(otherProfile?.profilepic, "profilepics")} alt="Profile" />
                                </div>
                                <div className="user-text">
                                    <div className="a-name">{otherProfile?.name}</div>
                                    <div className="a-profession">{otherProfile?.profession}</div>
                                </div>
                                <div>
                                    {renderConnectionButton()}

                                </div>
                            </div>
                            {iscontact ? (
                                <div className="a-square-div2">
                                    <div className="a-icon-text">
                                        <img className="a-icon" src="/work-icon.png" alt="Icon 1" />
                                        <span className="a-text">{otherProfile?.workplace}</span>
                                    </div>
                                    <div className="a-icon-text">
                                        <img className="a-icon" src="/location.png" alt="Icon 2" />
                                        <span className="a-text">{otherProfile?.location}</span>
                                    </div>
                                    <div className="a-icon-text">
                                        <img className="a-icon" src="/birthday.png" alt="Icon 3" />
                                        <span className="a-text">{otherProfile?.dob}</span>
                                    </div>
                                    <div className="a-icon-text">
                                        <img className="a-icon" src="/email.png" alt="Icon 3" />
                                        <span className="a-text">{otherProfile?.email}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {(!privacySettings[0]?.work_private || !privacySettings[0]?.location_private || !privacySettings[0]?.birthday_private || !privacySettings[0]?.email_private) && (
                                        <div className="a-square-div2">
                                            {(!privacySettings[0]?.work_private) && (
                                                <div className="a-icon-text">
                                                    <img className="a-icon" src="/work-icon.png" alt="Icon 1" />
                                                    <span className="a-text">{otherProfile?.workplace}</span>
                                                </div>
                                            )}
                                            {(!privacySettings[0]?.location_private) && (
                                                <div className="a-icon-text">
                                                    <img className="a-icon" src="/location.png" alt="Icon 2" />
                                                    <span className="a-text">{otherProfile?.location}</span>
                                                </div>
                                            )}
                                            {(!privacySettings[0]?.birthday_private) && (
                                                <div className="a-icon-text">
                                                    <img className="a-icon" src="/birthday.png" alt="Icon 3" />
                                                    <span className="a-text">{otherProfile?.dob}</span>
                                                </div>
                                            )}
                                            {(!privacySettings[0]?.email_private) && (
                                                <div className="a-icon-text">
                                                    <img className="a-icon" src="/email.png" alt="Icon 3" />
                                                    <span className="a-text">{otherProfile?.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        {(iscontact || (!privacySettings[0]?.workExperience_private)) && (
                            <div className="work-experience-container">
                                <div className="work-experience-row-title">
                                    Επαγγελματική Εμπειρία
                                </div>
                                {workExperience.length > 0 ? (
                                    workExperience.map((experience, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="work-role">{experience.profession}</div>
                                            <div className="work-company">{experience.workplace}</div>
                                            <div className="work-duration"><span>{formatDateRange(experience.start_date, experience.end_date)}</span></div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Δεν υπάρχει διαθέσιμη εργασιακή εμπειρία</p>
                                )}
                            </div>
                        )}
                        {(iscontact || (!privacySettings[0]?.studies_private)) && (
                            <div className="work-experience-container">
                                <div className="work-experience-row-title">
                                    Σπουδές
                                </div>
                                {studies.length > 0 ? (
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
                        )}
                        {(iscontact || (!privacySettings[0]?.skills_private)) && (
                            <div className="work-experience-container">
                                <div className="work-experience-row-title">
                                    Δεξιότητες
                                </div>
                                {skills.length > 0 ? (
                                    skills.map((skill, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="work-role">{skill.skill_name}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Δεν υπάρχουν διαθέσιμα προσόντα</p>
                                )}
                            </div>
                        )}
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Αγγελίες
                            </div>
                            {studies.length > 0 ? (
                                jobAds.map((ad, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{ad.title}</div>
                                        {ad.publish_date ? <div className="work-duration">{format(ad.publish_date, 'yyyy-MM-dd')}</div> : <span>No date available</span>}
                                        {/* <div className="work-duration">{ad.publish_date}</div> */}
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
                            {articles.length > 0 ? (
                                articles.map((article, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{article.title}</div>
                                        {article.publish_date ? <div className="work-duration">{format(article.publish_date, 'yyyy-MM-dd')}</div> : <span>No date available</span>}
                                        {/* <div className="work-duration">{article.publish_date}</div> */}
                                    </div>
                                ))
                            ) : (
                                <p>Δεν υπάρχουν διαθέσιμα άρθρα</p>
                            )}
                        </div>
                        {iscontact && (
                            <div className="work-experience-container">
                                <div className="work-experience-row-title">
                                    Συνδέσεις
                                </div>
                                <div className="contacts-page">
                                    <ul className="contacts-list">
                                        {othercontacts?.map((contact, index) => (
                                            <div className="contact" onClick={() => handleProfileClick(contact)}>
                                                <img src={getImageUrl(contact.profilepic, "profilepics")} alt="contact-pic" className="contact-icon" />
                                                <li className="profile-sect-contact" key={index}>{contact.name} </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </main>
            <MainBottom />
            <Footer />
        </div>
    );
};