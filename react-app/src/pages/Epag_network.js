import React from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import '../css/epag-network.css';
import { useAppContext } from "../context/appContext";
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllContactsByUserEmail, getNonConnectedUsersByEmail, getUser, sendFriendRequest, getSentFriendRequests, getReceivedFriendRequests, updateFriendRequestStatus, addContact, getFriendRequestByEmails, deleteFriendRequest } from "../api";
import getImageUrl from "../hooks/getImageUrl";

export default function Epag_network() {
    const [searchQueryConnected, setSearchQueryConnected] = useState("");
    const [searchQueryOther, setSearchQueryOther] = useState("");
    const [currentPageConnected, setCurrentPageConnected] = useState(1);
    const [currentPageOther, setCurrentPageOther] = useState(1);
    const itemsPerPage = 6;
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const { user } = useAppContext();
    const navigate = useNavigate();


    // Fetch connected and non connected users
    const fetchContacts = async () => {
        try {
            // Fetch connected users
            const contacts = await getAllContactsByUserEmail(user.email);
            const contactEmails = contacts.map(contact => contact.contact_email);
            const contactDetailsPromises = contactEmails.map(email => getUser(email));
            const contactsData = await Promise.all(contactDetailsPromises);
            setConnectedUsers(contactsData);

            // Fetch non-connected users
            const nonContacts = await getNonConnectedUsersByEmail(user.email);
            setOtherUsers(nonContacts);

            // Fetch pending and sent friend requests
            const [sent, received] = await Promise.all([
                getSentFriendRequests(user.email),
                getReceivedFriendRequests(user.email)
            ]);
            setSentRequests(sent);
            setPendingRequests(received);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // On email change fetch the user's contacts
    useEffect(() => {
        fetchContacts();
    }, [user.email]);

    
    // Mark the request as pending
    const isRequestPending = (targetEmail) => {
        return pendingRequests.some(req =>
            (req.sender_email === user.email && req.receiver_email === targetEmail) ||
            (req.receiver_email === user.email && req.sender_email === targetEmail)
        );
    };

    // Mark the request as sent
    const hasSentRequest = (targetEmail) => {
        return sentRequests.some(req => req.receiver_email === targetEmail);
    };


    // Filtering and Pagination for Connected Users
    const filteredConnectedUsers = useMemo(() => {
        const query = (searchQueryConnected || '').toLowerCase();
        return connectedUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const profession = (user.profession || '').toLowerCase();
            const workplace = (user.workplace || '').toLowerCase();
            return name.includes(query) ||
                profession.includes(query) ||
                workplace.includes(query);
        });
    }, [searchQueryConnected, connectedUsers]);

    const totalPagesConnected = Math.ceil(filteredConnectedUsers.length / itemsPerPage);
    const indexOfLastConnectedUser = currentPageConnected * itemsPerPage;
    const indexOfFirstConnectedUser = indexOfLastConnectedUser - itemsPerPage;
    const currentConnectedUsers = filteredConnectedUsers.slice(indexOfFirstConnectedUser, indexOfLastConnectedUser);


    // Filtering, Sorting, and Pagination for Other Users
    const filteredOtherUsers = useMemo(() => {
        const query = (searchQueryOther || '').toLowerCase();
        const filtered = otherUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const profession = (user.profession || '').toLowerCase();
            const workplace = (user.workplace || '').toLowerCase();
            return name.includes(query) ||
                profession.includes(query) ||
                workplace.includes(query);
        });
    
        return filtered.sort((a, b) => {
            const aHasRequest =isRequestPending (a.email);
            const bHasRequest = isRequestPending (b.email);
            const aHasSentRequest = hasSentRequest(a.email);
            const bHasSentRequest = hasSentRequest(b.email);
    
            if (aHasRequest && !bHasRequest) {
                return -1; // a should come before b
            }
            if (!aHasRequest && bHasRequest) {
                return 1; // b should come before a
            }
            if (aHasSentRequest && !bHasSentRequest) {
                return 1; // a should come after b
            }
            if (!aHasSentRequest && bHasSentRequest) {
                return -1; // b should come after a
            }
            return 0; // maintain original order if both have or don't have requests
        });
    }, [searchQueryOther, otherUsers, pendingRequests, sentRequests]);

    const totalPagesOther = Math.ceil(filteredOtherUsers.length / itemsPerPage);
    const indexOfLastOtherUser = currentPageOther * itemsPerPage;
    const indexOfFirstOtherUser = indexOfLastOtherUser - itemsPerPage;
    const currentOtherUsers = filteredOtherUsers.slice(indexOfFirstOtherUser, indexOfLastOtherUser);

    // Handlers for Pagination
    const handlePageChangeConnected = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPagesConnected) {
            setCurrentPageConnected(pageNumber);
        }
    };

    const handlePageChangeOther = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPagesOther) {
            setCurrentPageOther(pageNumber);
        }
    };


    // On profile pick navigate to the selected user's profile
    const handleProfileClick = (user) => {
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail: user.email } });
        window.scrollTo(0, 0);
    };

    // Handle connection request
    const handleConnectClick = async (targetUserEmail) => {
        if (!isRequestPending(targetUserEmail) && !hasSentRequest(targetUserEmail)) {
            try {
                const response = await sendFriendRequest(user.email, targetUserEmail);
                // Update state with new sent request
                setSentRequests(prev => [...prev, { sender_email: user.email, receiver_email: targetUserEmail, status: 'pending' }]);
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        }
    };

    // Handle accept request
    const handleAcceptRequest = async (senderEmail) => {
        try {
            // Fetch the friend request
            const friendRequest = await getFriendRequestByEmails(senderEmail, user.email);

            if (friendRequest) {
                await updateFriendRequestStatus(friendRequest.id, 'accepted');
                await addContact(user.email, senderEmail);
                await addContact(senderEmail, user.email);
                await deleteFriendRequest(friendRequest.id);
            }
            // Reload contacts and non-contacts
            fetchContacts();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Handle reject request
    const handleRejectRequest = async (senderEmail) => {
        try {
            // Get the friend request by sender and current user email
            const friendRequest = await getFriendRequestByEmails(senderEmail, user.email);
            if (friendRequest) {
                await updateFriendRequestStatus(friendRequest.id, 'rejected');
                await deleteFriendRequest(friendRequest.id);  
            }
            // Reload contacts and non-contacts
            fetchContacts();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };


    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="main-wrapper">
                <div className="box-header">
                    <h1 className="title2">Δίκτυο</h1>
                </div>

                {/* Connected Users Section */}
                <div className="user-section">
                    <div className="header-header">
                        <span className="section-title">Συνδέσεις</span>
                        <div className="search-container2">
                            <input
                                type="text"
                                placeholder="Αναζήτηση Συνδεδεμένων Χρηστών"
                                className="search-input"
                                value={searchQueryConnected}
                                onChange={(e) => setSearchQueryConnected(e.target.value)}
                            />
                            <img src="search.png" alt="Search Icon" className="search-icon" />
                        </div>
                    </div>
                    {filteredConnectedUsers.length > 0 ? (
                        <div>
                            <div className="grid-container">
                                {currentConnectedUsers.map(user => (
                                    <div key={user.id} className="box">
                                        <img src={getImageUrl(user.profilepic, "profilepics")} onClick={() => handleProfileClick(user)} alt="Profile Picture" className="e-profile-pic" />
                                        <div className="user-info">
                                            <h3 className="name">{user.name}</h3>
                                            {user.profession && <p className="e-profession">{user.profession}</p>}
                                            {user.workplace && (
                                                <div className="workplace-container">
                                                    <img src="work-icon.png" alt="Workplace Icon" className="workplace-icon" />
                                                    <p className="e-workplace">{user.workplace}</p>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="conn-button"
                                            onClick={() => handleProfileClick(user)}
                                        >
                                            Προβολή Προφίλ
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {totalPagesConnected > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChangeConnected(currentPageConnected - 1)}
                                        disabled={currentPageConnected === 1}
                                    >
                                        Προηγούμενο
                                    </button>
                                    <span>Σελίδα {currentPageConnected} από {totalPagesConnected}</span>
                                    <button
                                        onClick={() => handlePageChangeConnected(currentPageConnected + 1)}
                                        disabled={currentPageConnected === totalPagesConnected}
                                    >
                                        Επόμενο
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-connections">
                            Δεν έχετε συνδέσεις ακόμα
                        </div>
                    )}
                </div>

                {/* Other Users Section */}
                <div className="user-section">
                    <div className="header-header2">
                        <span className="section-title2">Μη Συνδεδεμένοι Χρήστες</span>
                        <div className="search-container2">
                            <input
                                type="text"
                                placeholder="Αναζήτηση Χρηστών"
                                className="search-input"
                                onChange={(e) => setSearchQueryOther(e.target.value)}
                            />
                            <img src="search.png" alt="Search Icon" className="search-icon" />
                        </div>
                    </div>
                    {filteredOtherUsers.length > 0 ? (
                        <div>
                            <div className="grid-container">
                                {currentOtherUsers.map(user => (
                                    <div key={user.id} className="box">
                                        <img src={getImageUrl(user.profilepic, "profilepics")} onClick={() => handleProfileClick(user)} alt="Profile Picture" className="e-profile-pic" />
                                        <div className="user-info">
                                            <h3 className="name">{user.name}</h3>
                                            {user.profession && <p className="e-profession">{user.profession}</p>}
                                            {user.workplace && (
                                                <div className="workplace-container">
                                                    <img src="work-icon.png" alt="Workplace Icon" className="workplace-icon" />
                                                    <p className="e-workplace">{user.workplace}</p>
                                                </div>
                                            )}
                                        </div>
                                        {isRequestPending(user.email) ? (
                                            <div className="button-div-no-299">
                                                <button className="pending-button" onClick={() => handleAcceptRequest(user.email)}>
                                                    Αποδοχή
                                                </button>
                                                <button className="reject-button" onClick={() => handleRejectRequest(user.email)}>
                                                    Απόρριψη
                                                </button>
                                            </div>
                                        ) : hasSentRequest(user.email) ? (

                                            <div className="button-div-no-300">
                                                <span className="sent-button">
                                                    Έχει σταλθεί αίτημα σύνδεσης

                                                </span>
                                                <img src="/pending.png" alt="Message" className="pending-ic" />
                                            </div>
                                        ) : (
                                            <button className="conn-button1" onClick={() => handleConnectClick(user.email)}>
                                                Σύνδεση<img src="/yellow-req.png" alt="Message" className="pr-icon2" />
                                            </button>

                                        )}

                                    </div>
                                ))}
                            </div>

                            {totalPagesOther > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChangeOther(currentPageOther - 1)}
                                        disabled={currentPageOther === 1}
                                    >
                                        Προηγούμενο
                                    </button>
                                    <span>Σελίδα {currentPageOther} από {totalPagesOther}</span>
                                    <button
                                        onClick={() => handlePageChangeOther(currentPageOther + 1)}
                                        disabled={currentPageOther === totalPagesOther}
                                    >
                                        Επόμενο
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-connections">
                            Δεν έχετε συνδέσεις ακόμα
                        </div>
                    )}
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div >
    );
}
