import React from 'react';
import Header from '../components/Header';
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/Epag_notifications.css'
import { Link } from 'react-router-dom';

const onAccept = (e) => {
    console.log('Request accepted')
};

const onDecline = (e) => {
    console.log('Request declined')
};

const NotificationItem = ({ profilePic, name, time, action, comment, articleId }) => (
    <div className="notification-item">
        <img src={profilePic} alt={`${name}'s profile`} className="profile-pic" />
        <div className="notification-text">
            <div className="time">{time}</div>
            {action === 'sent you a request' ? (
                <>
                    <span className="name">{name}</span>
                    <div className="request-buttons">
                        <button className="accept-button" onClick={onAccept}>Αποδοχή</button>
                        <button className="decline-button" onClick={onDecline}>Απόρριψη</button>
                    </div>
                </>
            ) : (
                <span>
                    <span>Ο/Η χρήστης </span><span className="name">{name} </span>
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

const Epag_notifications = () => {

    const requests = [
        { profilePic: '/images/user1.jpg', name: 'John Doe', time: '2 hours ago' },
        { profilePic: '/images/user2.jpg', name: 'Jane Smith', time: '5 hours ago' },
        { profilePic: '/images/user3.jpg', name: 'Alice Johnson', time: '1 day ago' },
        // Add more requests as needed
    ];

    const reactions = [
        { profilePic: '/images/user4.jpg', name: 'Bob Brown', time: '10 minutes ago', action: 'likes your article', articleId: '1' },
        { profilePic: '/images/user5.jpg', name: 'Tom White', time: '3 hours ago', action: 'left a comment on your article', comment: 'Great article! Really insightful.', articleId: '2' },
        { profilePic: '/images/user6.jpg', name: 'Emily Green', time: '7 hours ago', action: 'likes your article', articleId: '3' },
    ];

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="notifications-page">
                <h2>Αιτήματα Σύνδεσης</h2>
                <div className="notifications-scrollable-list">
                    {requests.map((request, index) => (
                        <NotificationItem
                            key={index}
                            profilePic={request.profilePic}
                            name={request.name}
                            time={request.time}
                            action="sent you a request"
                        />
                    ))}
                </div>

                <h2>Αντιδράσεις στις δημοσιεύσεις μου</h2>
                <div className="notifications-scrollable-list">
                    {reactions.map((reaction, index) => (
                        <NotificationItem
                            key={index}
                            profilePic={reaction.profilePic}
                            name={reaction.name}
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