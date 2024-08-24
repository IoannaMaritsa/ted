import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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

    const all_comments = [
        { article_id: 1, author: users.find((person) => person.id === 3), date: '1 minute ago', text:'Very useful!'},
        { article_id: 2, author: users.find((person) => person.id === 3), date: '3 hours ago', text:'I find this very disturbing!'},
        { article_id: 1, author: users.find((person) => person.id === 2), date: '2 days ago', text:'Good Job!'},
    ];

    const { id } = useParams();
    const article = articles.find(article => article.id === parseInt(id));

    if (!article) {
        return <div>Article not found</div>;
    }

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission logic here
        console.log('Article submitted:', { body });
        // Reset the form
        setBody('');
    };

    const comments = all_comments.filter((i ,_) => i.article_id === parseInt(id))

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className='main'>
                <div className="article-container">
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
                    <div className='interest-box'>
                        <button className='interest-button'>Με ενδιαφέρει</button>
                    </div>

                    <div className='article-comment-section'>
                        <h3>Σχόλια</h3>
                        {comments.length === 0 ? (
                            <div className='notification-item'>Το άρθρο δεν έχει ακόμα σχόλια</div>
                        ) : (
                            <>
                                {comments.map((comment, index) => (
                                    <div className='notification-item'>
                                        <img src={comment.author.profilePic} alt={`${comment.author.name}'s profile`} className='profile-pic'/>
                                        <div className='notification-text'>
                                            <div className="notification-time">{comment.date}</div>
                                            <span className="notification-name" onClick={() => handleProfileClick(comment.author)}>{comment.author.name}</span>
                                            <span>{comment.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="input-group">
                        <textarea
                            id="body"
                            value={body}
                            onChange={handleBodyChange}
                            placeholder="Σχολιάστε"
                        />
                    </div>
                    <div className='interest-box'>
                        <button onClick={handleSubmit} className="article-comment-button">Ανάρτηση</button>
                    </div>
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_article;