import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/Epag_notifications.css'
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getReceivedFriendRequests, getUser, deleteFriendRequest, getFriendRequestByEmails, updateFriendRequestStatus, addContact,  } from '../api';
import getImageUrl from '../hooks/getImageUrl';
import { formatRelativeTime } from '../utils/timeUtils'; // Adjust the path as needed


const NotificationItem = ({ user, time, status, action, comment, articleId, onAccept, onDecline }) => {
    const { setOtherProfile, otherProfile, } = useAppContext();

    const navigate = useNavigate();

      // On profile pick navigate to the selected user's profile
      const handleProfileClick = (user) => {
        console.log("email2", user.email);
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail: user.email } });
        window.scrollTo(0, 0);
    };


    useEffect(() => {
        console.log('Updated otherProfile:', otherProfile);
    }, [otherProfile]);

    return (
        <div className="notification-item">
            
                
                <div className="notification-text">
                    <div className="notification-time">{time}</div>
                    {action === 'sent you a request' ? (
                        <>
                        <div className='another-div'>
                        <img src={getImageUrl(user?.profilepic, "profilepics")} alt={`${user?.name}'s profile`} onClick={() => handleProfileClick(user)} className="profile-pic" />
                            <div className="notification-name1" >
                                <span className="actual-name" onClick={() => handleProfileClick(user)}>{user?.name}</span></div>

                            <div className="request-buttons15">
                                <button className="accept-button15" onClick={() => onAccept(user?.email)}>Αποδοχή</button>
                                <button className="reject-button15" onClick={() => onDecline(user?.email)}>Απόρριψη</button>
                            </div>
                        </div>
                        </>
                    ) : (
                        <span>
                            <img src={getImageUrl(user?.profilepic, "profilepics")} alt={`${user?.name}'s profile`} className="profile-pic" />
                            <span>Ο/Η χρήστης </span><span className="notification-name" onClick={() => handleProfileClick(user)}>{user?.name} </span>
                            {action === 'likes your article' ? (
                                <span>
                                    δήλωσε ότι του/της αρέσει η <Link to={`/epaggelmatias_notifications/epaggelmatias_article/${articleId}`}>δημοσίευση</Link> σας.
                                </span>
                            ) : (
                                <span>
                                    άφησε ένα σχόλιο στην <Link to={`/epaggelmatias_notifications/epaggelmatias_article/${articleId}`}>δημοσίευση</Link> σας:
                                    <div className="comment">
                                        {comment}
                                    </div>
                                </span>
                            )}
                        </span>
                    )}
                </div>
            </div>

    );
};

const convertTimeToSortableValue = (timeString) => {
    const now = new Date();

    if (timeString.includes('minutes ago')) {
        const minutes = parseInt(timeString.split(' ')[0]);
        return now.getTime() - minutes * 60 * 1000;
    } else if (timeString.includes('hours ago')) {
        const hours = parseInt(timeString.split(' ')[0]);
        return now.getTime() - hours * 60 * 60 * 1000;
    } else if (timeString.includes('day ago')) {
        return now.getTime() - 24 * 60 * 60 * 1000;
    } else if (timeString.includes('days ago')) {
        const days = parseInt(timeString.split(' ')[0]);
        return now.getTime() - days * 24 * 60 * 60 * 1000;
    } else {
        return now.getTime(); // If the format is unknown, treat as now
    }
};

const Epag_notifications = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAppContext();

    const users = [
        {
            id: 3,
            profilePic: '/default-avatar.jpeg',
            name: 'Charlie Brown',
            profession: 'Product Manager',
            workplace: 'Innovate Co.',
        },
        {
            id: 4,
            profilePic: '/default-avatar.jpeg',
            name: 'David Wilson',
            profession: 'Marketing Specialist',
            workplace: 'AdVantage Agency',
        },
        {
            id: 5,
            profilePic: '/default-avatar.jpeg',
            name: 'Eve Davis',
            profession: 'Data Analyst',
            workplace: 'Data Insights Corp.',
        }
    ];

    
    const fetchFriendRequests = async () => {
        try {
            // Fetch all incoming friend requests
            const receivedRequests = await getReceivedFriendRequests(user.email);
            const requestsWithUserInfo = await Promise.all(
                receivedRequests.map(async (request) => {
                    // Fetch user profile info based on the sender's email
                    const senderuser = await getUser(request.sender_email);
                    return {
                        senderuser,
                        time: new Date(request.created_at), // Convert timestamp to a comparable number
                    };
                })
            );
            console.log(requestsWithUserInfo)
            setRequests(requestsWithUserInfo);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);


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
            // Reload friend requests
            fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Handle reject request
    const handleRejectRequest = async (senderEmail) => {
        try {
            console.log(senderEmail,user.email)
            // Get the friend request by sender and current user email
            const friendRequest = await getFriendRequestByEmails(senderEmail, user.email);
            if (friendRequest) {
                await updateFriendRequestStatus(friendRequest.id, 'rejected');
                await deleteFriendRequest(friendRequest.id);  
            }
            // Reload friend requests
            fetchFriendRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };




    if (loading) {
        return <div>Loading...</div>;
    }

    const reactions = [
        { user: users.find((person) => person.id === 3), time: '10 days ago', action: 'likes your article', articleId: '1' },
        { user: users.find((person) => person.id === 4), time: '3 hours ago', action: 'left a comment on your article', comment: 'Great article! Really insightful.', articleId: '2' },
        { user: users.find((person) => person.id === 5), time: '7 hours ago', action: 'likes your article', articleId: '3' },
    ];

    // Sort requests by timestamp in descending order (newest first)
    const sortedRequests = requests.sort((a, b) => b.time.getTime() - a.time.getTime());
    const sortedReactions = reactions.sort((a, b) => convertTimeToSortableValue(b.time) - convertTimeToSortableValue(a.time));

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="notifications-page">
                <h2>Αιτήματα Σύνδεσης</h2>
                <div className="notifications-scrollable-list">
                    {sortedRequests?.length === 0 ? (
                        <div className="notification-item">Δεν υπάρχουν διαθέσιμα αιτήματα</div>
                    ) : (
                        sortedRequests?.map((request, index) => (
                            <NotificationItem
                                key={index}
                                user={request.senderuser}
                                time={formatRelativeTime(request.time)}
                                action="sent you a request"
                                onAccept={() => handleAcceptRequest(request.senderuser.email)}
                                onDecline={() => handleRejectRequest(request.senderuser.email)}
                            />
                        ))
                    )}

                </div>

                <h2>Αντιδράσεις στις δημοσιεύσεις μου</h2>
                <div className="notifications-scrollable-list">
                    {sortedReactions.map((reaction, index) => (
                        <NotificationItem
                            key={index}
                            user={reaction.user}
                            time={reaction.time}
                            action={reaction.action}
                            comment={reaction.comment}
                            articleId={reaction.articleId}
                        />
                    ))}
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_notifications;