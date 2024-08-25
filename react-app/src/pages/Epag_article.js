import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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

const myuser = {
    id: 189,
    profilePic: '/default-avatar.jpeg',
    name: 'Λάκης Λαλάκης',
}
const users = [
    {
        id: 1,
        profilePic: '/default-avatar.jpeg',
        name: 'John Doe',
    },
    {
        id: 2,
        profilePic: '/default-avatar.jpeg',
        name: 'Jane Smith',
    },
    {
        id: 3,
        profilePic: '/default-avatar.jpeg',
        name: 'Charlie Brown',
    }
];

const Epag_article = () => {

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

    const articles = [
        { id: 1, title: 'Sample Article Title 1', author: users.find((person) => person.id === 1), date: 'July 25, 2024', content: 'This is a sample article content. It provides a brief overview of the article.', attachments: { images: ['businessleader.jpg', 'activist.jpg'], videos: [], audios: [] } },
        { id: 2, title: 'Sample Article Title 2', author: users.find((person) => person.id === 2), date: 'July 24, 2024', content: 'This is another sample article content. It provides more details about the article.', attachments: { images: [], videos: ['big_buck_bunn.mp4'], audios: ['sample3.MP3'] } },
        // Add more articles as needed
    ];

    const [all_comments, setAll_comments] = useState([
        { article_id: 1, author: users.find((person) => person.id === 3), datetime: new DateTime('2024-08-25', '12:30'), text: 'Very useful!' },
        { article_id: 2, author: users.find((person) => person.id === 3), datetime: new DateTime('2009-07-28', '08:15'), text: 'I find this very disturbing!' },
        { article_id: 1, author: users.find((person) => person.id === 2), datetime: new DateTime('2017-01-01', '18:45'), text: 'Good Job!' },
    ]);

    const { id } = useParams();
    const article = articles.find(article => article.id === parseInt(id));

    if (!article) {
        return (
            <div>
                <Header variant="professional" />
                <Breadcrumbs />
                <div className='main'>Article not found</div>
                <MainBottom />
                <Footer />
            </div>
        );
    }

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
        setAll_comments([...all_comments, newComment]);

        console.log('Article submitted:', { body });
        // Reset the form
        setBody('');
    };

    const sortComments = (comments) => {
        comments.sort((a, b) => new Date(`${b.datetime.date}T${b.datetime.time}:00`) - new Date(`${a.datetime.date}T${a.datetime.time}:00`));
        
        return comments;
    }

    const comments = sortComments(all_comments.filter((i, _) => i.article_id === parseInt(id)));

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
                        <div className="article-author1" onClick={() => handleProfileClick(article.author)}>
                            <img src={article.author.profilePic} alt="User Icon" className="icon" />
                            <span>{article.author.name}</span>
                        </div>
                        <div className="article-date">
                            <img src="/calendar.png" alt="Date icon" className="icon" />
                            <span>{article.date}</span>
                        </div>
                    </div>
                    <p className="article-content">{article.content}</p>
                    {article.attachments.images.length > 0 && (
                        <div className="attachments">
                            <h3>Φωτογραφίες</h3>
                            {article.attachments.images.map((image, index) => (
                                <img key={index} src={`/${image}`} alt={`Attachment ${index + 1}`} className='article-image' />
                            ))}
                        </div>
                    )}

                    {article.attachments.videos.length > 0 && (
                        <div className="attachments">
                            <h3>Βίντεο</h3>
                            {article.attachments.videos.map((video, index) => (
                                <video width="500" key={index} controls>
                                    <source src={`/${video}`} type="video/mp4" className='video' />
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                        </div>
                    )}

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
                    )}

                    <div className='article-comment-section'>
                        <h3>Σχόλια</h3>
                        {comments.length === 0 ? (
                            <div className='notification-item'>Το άρθρο δεν έχει ακόμα σχόλια</div>
                        ) : (
                            <>
                                {comments.map((comment, index) => (
                                    <div className='notification-item'>
                                        <img src={comment.author.profilePic} alt={`${comment.author.name}'s profile`} className='profile-pic' />
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