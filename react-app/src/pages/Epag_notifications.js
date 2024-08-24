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

const NotificationItem = ({ user, time, status, action, comment, articleId, onAccept, onDecline }) => {
    const { setOtherProfile, otherProfile } = useAppContext();

    const navigate = useNavigate();

    const handleProfileClick = (user) => {
        setOtherProfile(user);
        navigate('/epaggelmatias_notifications/user_profile', { state: { otherProfile: user } });
    };

    useEffect(() => {
        console.log('Updated otherProfile:', otherProfile);
    }, [otherProfile]);

    return (
        <div className="notification-item">
            <img src={user.profilePic} alt={`${user.name}'s profile`} className="profile-pic" />
            <div className="notification-text">
                <div className="notification-time">{time}</div>
                {action === 'sent you a request' ? (
                    <>
                        <span className="notification-name" onClick={() => handleProfileClick(user)}>{user.name}</span>
                        {status === 'pending' && (
                            <div className="request-buttons">
                                <button className="accept-button" onClick={onAccept}>Αποδοχή</button>
                                <button className="decline-button" onClick={onDecline}>Απόρριψη</button>
                            </div>
                        )}
                        {status === 'accepted' && <span>Το αίτημα έγινε αποδεχτό.</span>}
                    </>
                ) : (
                    <span>
                        <span>Ο/Η χρήστης </span><span className="notification-name" onClick={() => handleProfileClick(user)}>{user.name} </span>
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

    const users = [
        {
            id: 1,
            profilePic: '/default-avatar.jpeg',
            name: 'Alice Johnson',
            profession: 'Software Engineer',
            workplace: 'Tech Solutions Inc.',
        },
        {
            id: 2,
            profilePic: '/default-avatar.jpeg',
            name: 'Bob Smith',
            profession: 'Graphic Designer',
            workplace: 'Creative Studio Ltd.',
        },
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

    const [requests, setRequests] = useState([
        { user: users.find((person) => person.id === 1), time: '2 days ago', status: 'pending' },
        { user: users.find((person) => person.id === 5), time: '5 hours ago', status: 'pending' },
        { user: users.find((person) => person.id === 2), time: '1 minute ago', status: 'pending' },
        // Add more requests as needed
    ]);

    const handleAccept = (index) => {
        setRequests(prevRequests => {
            const newRequests = [...prevRequests];
            newRequests[index].status = 'accepted';
            return newRequests;
        });
        console.log('Request accepted');
    };

    const handleDecline = (index) => {
        setRequests(prevRequests => prevRequests.filter((_, i) => i !== index));
        console.log('Request declined');
    };

    const reactions = [
        { user: users.find((person) => person.id === 3), time: '10 days ago', action: 'likes your article', articleId: '1' },
        { user: users.find((person) => person.id === 4), time: '3 hours ago', action: 'left a comment on your article', comment: 'Great article! Really insightful.', articleId: '2' },
        { user: users.find((person) => person.id === 5), time: '7 hours ago', action: 'likes your article', articleId: '3' },
    ];

    const sortedRequests = requests.sort((a, b) => convertTimeToSortableValue(b.time) - convertTimeToSortableValue(a.time));
    const sortedReactions = reactions.sort((a, b) => convertTimeToSortableValue(b.time) - convertTimeToSortableValue(a.time));

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="notifications-page">
                <h2>Αιτήματα Σύνδεσης</h2>
                <div className="notifications-scrollable-list">
                    {sortedRequests.length === 0 ? (
                        <div className="notification-item">Δεν υπάρχουν διαθέσιμα αιτήματα</div>
                    ) : (
                        <>
                            {requests.map((request, index) => (
                                <NotificationItem
                                    key={index}
                                    user={request.user}
                                    time={request.time}
                                    status={request.status}
                                    action="sent you a request"
                                    onAccept={() => handleAccept(index)}
                                    onDecline={() => handleDecline(index)}
                                />
                            ))}
                        </>
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