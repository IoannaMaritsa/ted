import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getArticleById , getComments , getUser , getAttachments} from '../api';
import getImageUrl from '../hooks/getImageUrl';

function DateTime(date, time) {
    this.date = date; // Date in YYYY-MM-DD format
    this.time = time; // Time in HH:MM:SS format
}

const getCurrentDate = () => {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
};



const Epag_article = () => {
    const myuser = useAppContext().user;

    const { setOtherProfile, otherProfile } = useAppContext();

    const navigate = useNavigate();

    const handleProfileClick = (user) => {
        setOtherProfile(user);
        navigate('/user_profile', { state: { otherProfile: user } });
    };

    useEffect(() => {
        console.log('Updated otherProfile:', otherProfile);
    }, [otherProfile]);

    const [body, setBody] = useState('');

    const [comments, setComments] = useState([]);
    const [article, setArticle] = useState([]);
    const [author, setAuthor] = useState([]);
    const [attachments, setAttachments] = useState([]);

    const getArticle = async (id) => {
        try {
            const response = await getArticleById(id);
            setArticle(response);
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const getAuthor = async (email) => {
        try {
            const response = await getUser(email);
            setAuthor(response);
        } catch (error) {
            console.error('Error getting author:', error);
        }
    };

    const getArticleAttachments = async (articleId) => {
        try {
            const response = await getAttachments(articleId);
            setAttachments(response);
        } catch (error) {
            console.error('Error getting attachments:', error);
        }
    };

    const getCommentsOfArticle = async (articleId) => {
        try {
            const response = await getComments(articleId);
            setComments(response);
        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };

    const { id } = useParams();

    useEffect(() => {
        getArticle(parseInt(id));
        getCommentsOfArticle(parseInt(id));
        getAuthor(article.author_email)
        getArticleAttachments(parseInt(id));
        console.log(article);
    }, [article.author_email]);

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentDateTime = new DateTime(getCurrentDate(), getCurrentTime());

        const newComment = {
            article_id: parseInt(id),  // Example article ID
            author: myuser,  // Example user
            datetime: currentDateTime,  // Example date
            text: body  // Example comment text
        };
        setComments([...comments, newComment]);

        console.log('Article submitted:', { body });
        // Reset the form
        setBody('');
    };

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className='main'>
                <div className="article-container">
                    <div className='interest-box'>
                        <button className='interest-button'>Με ενδιαφέρει</button>
                    </div>
                    <div className="article-text">
                        <h1>{article.title}</h1>
                    </div>
                    <div className="article-meta">
                        <div className="article-author1" onClick={() => handleProfileClick(author)}>
                            <img src={getImageUrl(author?.profilepic, "profilepics")} alt="User Icon" className="icon" />
                            <span>{author.name}</span>
                        </div>
                        <div className="article-date">
                            <img src="/calendar.png" alt="Date icon" className="icon" />
                            <span>{article.publish_date}</span>
                        </div>
                    </div>
                    <p className="article-content">{article.content}</p>
                    {attachments.length > 0 && (
                        <div className="attachments">
                            <h3>Επισυναπτόμενα αρχεία:</h3>
                            {attachments.map((attachment, index) => (
                                <img key={index} src={getImageUrl(attachment?.url, "attachments")} alt={`Attachment ${index + 1}`} className='article-image' />
                            ))}
                        </div>
                    )}

                    {/* {article.attachments.videos.length > 0 && (
                        <div className="attachments">
                            <h3>Βίντεο</h3>
                            {article.attachments.videos.map((video, index) => (
                                <video width="500" key={index} controls>
                                    <source src={`/${video}`} type="video/mp4" className='video' />
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                        </div>
                    )} */}
{/* 
                    {article.attachments.audios.length > 0 && (
                        <div className="attachments">
                            <h3>Ήχοι</h3>
                            {article.attachments.audios.map((audio, index) => (
                                <audio key={index} controls>
                                    <source src={`/${audio}`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            ))}
                        </div>
                    )} */}

                    <div className='article-comment-section'>
                        <h3>Σχόλια</h3>
                        {comments.length === 0 ? (
                            <div className='notification-item'>Το άρθρο δεν έχει ακόμα σχόλια</div>
                        ) : (
                            <>
                                {comments.map((comment, index) => (
                                    <div className='notification-item'>
                                        {/* <img src={comment.author.profilePic} alt={`${comment.author.name}'s profile`} className='profile-pic' /> */}
                                        <div className='notification-text'>
                                            {comment.datetime.date === getCurrentDate() ? (
                                                <div className="notification-time">{comment.datetime.time}</div>
                                            ) : (
                                                <div className="notification-time">{comment.datetime.date}</div>
                                            )}
                                            
                                            <span className="notification-name" onClick={() => handleProfileClick(comment.author)}>{comment.author.name}</span>
                                            <span>{comment.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <textarea
                            id="body"
                            value={body}
                            onChange={handleBodyChange}
                            placeholder="Σχολιάστε"
                            required
                        />
                    </div>
                    <div className='interest-box'>
                        <button type='submit' className="article-comment-button">Ανάρτηση</button>
                    </div>
                    </form>
                </div>
                
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_article;