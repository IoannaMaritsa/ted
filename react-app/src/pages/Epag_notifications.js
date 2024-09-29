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
import { getReceivedFriendRequests, getUser, deleteFriendRequest, getFriendRequestByEmails, updateFriendRequestStatus, addContact, getComments, getArticleInterests, getArticle } from '../api';
import getImageUrl from '../hooks/getImageUrl';
import { formatRelativeTime } from '../utils/timeUtils'; 


const NotificationItem = ({ user, time, action, comment, articleId, onAccept, onDecline }) => {

    const navigate = useNavigate();

    // On profile pick navigate to the selected user's profile
    const handleProfileClick = (user) => {
        navigate('/epaggelmatias_network/user_profile', { state: { userEmail: user.email } });
        window.scrollTo(0, 0);
    };

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
                        <img src={getImageUrl(user?.profilepic, "profilepics")} alt={`${user?.name}'s profile`} className="profile-pic" onClick={() => handleProfileClick(user)} />
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


const Epag_notifications = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAppContext();
    const [articles, setArticles] = useState(null);
    const [interests, setInterests] = useState([]);
    const [comments, setComments] = useState([]);

    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    useEffect(() => {
        if (articles === null) {
            fetchArticles();
        }
    }, [articles]);

    useEffect(() => {
        if (articles) {
            fetchInterests();
            fetchComments();
        }
    }, [articles]);
    const [reactions, setReactions] = useState([]);



    const fetchArticles = async () => {
        try {
            const response = await getArticle(user.email);
            setArticles(response);

        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const fetchInterests = async () => {
        if (articles.length === 0) {
            console.error('No articles available to fetch interests for');
            return;
        }

        try {
            // Fetch all interests for the articles
            const interests = await Promise.all(
                articles.map(async (article) => {
                    const reacts = await getArticleInterests(article.id); // Assuming this returns an array
                    if (reacts && reacts.length > 0) {

                        // Map through each interest and extract the user_email and date
                        return await Promise.all(
                            reacts.map(async (react) => {
                                const creationdate = new Date(react.date);
                                if (creationdate < oneMonthAgo) {
                                    return null;
                                }
                                else if (react.user_email === user.email) {
                                    return null;
                                }
                                else {
                                    const user = await getUser(react.user_email); 
                                    return {
                                        article: article.id,
                                        user, 
                                        date: creationdate,
                                        action: 'likes your article'
                                    };
                                }
                            })
                        )
                        .then(results => results.filter(interest => interest !== null));
                    }
                    return []; 
                })
            );

            const flattenedInterests = interests.flat();
            setInterests(flattenedInterests);
        } catch (error) {
            console.error('Error fetching interests:', error);
        }
    };

    const fetchComments = async () => {
        if (articles.length === 0) {
            console.error('No articles available to fetch comments for');
            return;
        }

        try {
            const comments = await Promise.all(
                articles.map(async (article) => {
                    console.log('Fetching comments for article:', article.id);

                    try {
                        const reacts = await getComments(article.id);
                        if (!reacts || reacts.length === 0) {
                            console.error(`No comments found for article ${article.id}`);
                            return [];
                        }

                        return await Promise.all(
                            reacts.map(async (react) => {
                                const creationdate = new Date(react.created_at);
                                if (creationdate < oneMonthAgo) {
                                    return null;
                                }
                                else if (react.author_email === user.email) {
                                    return null;
                                }
                                else {const user = await getUser(react.author_email);
                                return {
                                    article: article.id,
                                    user,  
                                    date: creationdate,
                                    text: react.text,
                                };
                            }
                            })
                        )
                        .then(results => results.filter(comment => comment !== null));
                    } catch (error) {
                        console.error(`Error fetching comments for article ${article.id}:`, error);
                        return [];
                    }
                })
            );

            const flattenedComments = comments.flat().filter(comment => comment !== null);
            setComments(flattenedComments);
            console.log('Flattened comments:', flattenedComments);
        } catch (error) {
            console.error('Error fetching comments', error);
        }
    };


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


    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchArticles();  
                await fetchInterests(); 
                await fetchComments();

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); 
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
            fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Handle reject request
    const handleRejectRequest = async (senderEmail) => {
        try {
            console.log(senderEmail, user.email)
            // Get the friend request by sender and current user email
            const friendRequest = await getFriendRequestByEmails(senderEmail, user.email);
            if (friendRequest) {
                await updateFriendRequestStatus(friendRequest.id, 'rejected');
                await deleteFriendRequest(friendRequest.id);
            }

            fetchFriendRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };




    if (loading) {
        return <div>Loading...</div>;
    }

    // Sort requests by timestamp in descending order 
    const sortedRequests = requests.sort((a, b) => b.time.getTime() - a.time.getTime());

    const combinedData = [...interests, ...comments];
    const sortedReactions = combinedData.sort((a, b) => b.date.getTime() - a.date.getTime());


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

                <h2>Αντιδράσεις στις δημοσιεύσεις μου τον τελευταίο μήνα</h2>
                <div className="notifications-scrollable-list">
                    {sortedReactions.map((reaction, index) => (
                        <NotificationItem
                            key={index}
                            user={reaction.user}
                            time={formatRelativeTime(reaction.date)}
                            action={reaction.action}
                            articleId={reaction.article}
                            comment={reaction.text}
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