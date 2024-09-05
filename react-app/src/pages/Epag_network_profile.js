import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import { getUser, sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, updateFriendRequestStatus, addContact, removeContact, getFriendRequestByEmails, getAllContactsByUserEmail, deleteFriendRequest } from "../api";
import Breadcrumbs from "../components/Breadcrumbs";
import getImageUrl from "../hooks/getImageUrl";
import { useAppContext } from "../context/appContext";

export default function Epag_network_profile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userEmail } = location.state || {};
    const [sentRequests, setSentRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [otherProfile, setOtherProfile] = useState(null); // State for the profile
    const { user } = useAppContext();
    const [contacts, setContacts] = useState([]); // State for the contacts

    // Log the email value for debugging
    useEffect(() => {
        console.log("userEmail from state:", userEmail);
    }, [userEmail]);

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


    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const contacts = await getAllContactsByUserEmail(user.email);
                setContacts(contacts.map(contact => contact.contact_email));
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, [userEmail]);

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

    const handleMessageClick = () =>
    {
        console.log("Navigating...")
        navigate('/epaggelmatias_messages');
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
                <button className="unfriend-button" onClick={() => handleUnfriendClick(otherProfile?.email)}>
                    Αφαίρεση Σύνδεσης
                    <img src="/unfriend.png" alt="Unfriend" className="unfriend-ic" />
                </button>
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
                                <div className="button-2-cont">
                                {renderConnectionButton()}
                                    <button className="message-button2"  onClick={() => handleMessageClick()}>Μήνυμα
                                        <img src="/mess-icon.png" alt="Message" className="mess-icon2" />
                                    </button>
                                </div>
                            </div>
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
