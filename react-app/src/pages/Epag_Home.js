import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Article from '../components/article_display';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, user } from "../context/appContext";
import { addArticle, getArticle, deleteArticle, getOtherUsersArticles } from '../api';
import '../css/epag-home.css';

export default function Epag_Home() {
    
    const user_info = useAppContext();

    const getArticles = async (userId) => {
        try {
            const response = await getOtherUsersArticles(userId);
            setArticles(response.data);
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const getMyArticles = async (userId) => {
        try {
            const response = await getArticle(userId);
            setMy_articles(response.data);
            
        } catch (error) {
            console.error('Error getting articles:', error);
        }
    };

    const [articles, setArticles] = useState(getArticles(user_info.id)); // Initialize with an empty array
    const [my_articles, setMy_articles] = useState(getMyArticles(user_info.id)); // Initialize with an empty array

    useEffect(() => {
        console.log('the id is:',user_info);
        console.log('the article table is:',articles);
        console.log(my_articles);
    }, []);

    const handleDeleteArticle = async (articleId) => {
        try {
            const response = await deleteArticle(articleId);
            console.log('article deleted successfully');
        }
        catch (error) {
            console.error('Error deleting article:', error);
            // You might want to show an error message to the user here
        }
    };

    const contacts = [
        {
            id: 1,
            profilePic: '/default-avatar.jpeg',
            name: 'Alice Johnson',
        },
        {
            id: 2,
            profilePic: '/default-avatar.jpeg',
            name: 'Bob Smith',
        },
        {
            id: 3,
            profilePic: '/default-avatar.jpeg',
            name: 'Charlie Brown',
        },
        {
            id: 4,
            profilePic: '/default-avatar.jpeg',
            name: 'David Wilson',
        },
        {
            id: 5,
            profilePic: '/default-avatar.jpeg',
            name: 'Eve Davis',
        },
        {
            id: 6,
            profilePic: '/default-avatar.jpeg',
            name: 'Jojo Siwa',
        },
        {
            id: 7,
            profilePic: '/default-avatar.jpeg',
            name: 'Charles White',
        },
    ];

    const { setOtherProfile, otherProfile } = useAppContext();

    const navigate = useNavigate();

    const handleProfileClick = (user) => {
        setOtherProfile(user);
        navigate('/user_profile', { state: { otherProfile: user } });
    };

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const handleFileUpload = (type) => {
        const input = document.createElement('input');
        input.type = 'file';

        if (type === 'image') {
            input.accept = 'image/*';
        } else if (type === 'video') {
            input.accept = 'video/*';
        } else if (type === 'audio') {
            input.accept = 'audio/*';
        }

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setAttachedFiles((prevFiles) => [
                    ...prevFiles,
                    { type, name: file.name }
                ]);
                console.log(`Attached ${type}:`, file);
                // You can add additional logic here to handle the file, such as uploading it to a server
            }
        };

        input.click();
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const formattedDate = `${year}-${month}-${date}`;
        // Handle the form submission logic here
        const article = {
            id: articles.length + 1,
            title: title,
            author_id: user_info.id,
            date: formattedDate,
            content: body.substring(0, 50)
        }
        // Reset the form
        setArticles([...articles, article]);

        setTitle('');
        setBody('');
        setAttachedFiles([]);
    };

    return (
        <div>
            <Header />
            <nav className="breadcrumbs"><img src="/home.png" className='home-icon' alt="Home" /> &nbsp;/</nav>
            <div className="split-epag">
                <div className="side-bar">
                    <div className="side-bar-section">
                        <div className="side-bar-part">
                            <div className="split-page">
                                <img src="/user.png" alt="avatar" className="profile_image" />
                                <div className="text-section">
                                    <h4>{user_info.name}</h4>
                                    <h5>{user_info.profession}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="side-bar-part">
                            <h5>Επαγγελματικός Φορέας</h5>
                            <h6>{user_info.workplace}</h6>
                            <h5>Τοποθεσία</h5>
                            <h6>{user_info.location}</h6>
                            <h5>Ημ.Γέννησης</h5>
                            <h6>{user_info.birthday}</h6>
                            <h5>Email</h5>
                            <h6>{user_info.email}</h6>
                        </div>
                        <div className="side-bar-part">
                            <h4>Επαγγελματική εμπειρία</h4>
                            {/* {user_info.experiences.map((experience, index) => (
                                <div className="home-user-info">
                                    <p className="home-user-info-h3">
                                        {experience.profession}
                                    </p>
                                    <p className="home-user-info-h4">
                                        {experience.workplace}
                                    </p>
                                    <p className="home-user-info-h5">
                                        {experience.date}
                                    </p>
                                </div>
                            ))} */}

                        </div>
                        <div className="side-bar-part">
                            <h4>Σπουδές</h4>
                            {/* {user_info.studies.map((study, index) => (
                                <div className="home-user-info">
                                    <p className="home-user-info-h3">
                                        {study.university}
                                    </p>
                                    <p className="home-user-info-h4">
                                        {study.degree}
                                    </p>
                                    <p className="home-user-info-h5">
                                        {study.date}
                                    </p>
                                </div>
                            ))} */}
                        </div>
                        <div className="side-bar-part">
                            <h4>Δεξιότητες</h4>
                            {/* {user_info.skills.map((skill, index) => (
                                <ul className="home-user-info-ul">
                                    <li>
                                        {skill}
                                    </li>
                                </ul>
                            ))} */}
                        </div>
                    </div>
                    <div className="side-bar-section">
                        <div className="network-title">
                            <img src="/community.png" alt="avatar" className="network-icon" />
                            <span>Δίκτυο</span>
                        </div>
                        <div className="contacts-page">
                            <ul className="contacts-list">
                                {contacts.map((contact, index) => (
                                    <div className="contact" onClick={() => handleProfileClick(contact)}>
                                        <img src={contact.profilePic} alt="contact-pic" className="contact-icon" />
                                        <li key={index}>{contact.name} </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="main-section">
                    <div className="article-creator">
                        <form onSubmit={handleSubmit}>
                            <div className="article-creator-top">
                                <h2>Δημιουργία νέου άρθρου</h2>
                                <button type="submit" className="submit-button">Ανάρτηση</button>
                            </div>


                            <div className="input-group">
                                <label htmlFor="title">Τίτλος</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="Δώστε έναν τίτλο στο άρθρο σας"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="body">Κύριο Μέρος</label>
                                <textarea
                                    id="body"
                                    value={body}
                                    onChange={handleBodyChange}
                                    placeholder="Περιγράψτε αναλυτικά το θέμα"
                                    required
                                />
                            </div>
                            <div className="icon-group">
                                <p>Επισύναψη αρχείου:</p>
                                <button onClick={() => handleFileUpload('image')}>
                                    <img src="/icons-image.png" alt="Attach Image" />
                                </button>
                                <button onClick={() => handleFileUpload('video')}>
                                    <img src="/video.png" alt="Attach Video" />
                                </button>
                                <button onClick={() => handleFileUpload('audio')}>
                                    <img src="/audiofile.png" alt="Attach Audio" />
                                </button>
                            </div>
                            {attachedFiles.length > 0 && (
                                <div className="attached-files">
                                    {attachedFiles.map((file, index) => (
                                        <div key={index} className="attached-file">
                                            {file.type === 'image' && <img src="/icons-image.png" alt="Image Icon" />}
                                            {file.type === 'video' && <img src="/video.png" alt="Video Icon" />}
                                            {file.type === 'audio' && <img src="/audiofile.png" alt="Audio Icon" />}
                                            <span>{file.name}</span>
                                            <button className="remove-button" onClick={() => handleRemoveFile(index)}>
                                                <img src="/remove.png" alt="Image Icon" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </form>
                    </div>
                    {my_articles.length > 0 && (<div className="articles-page">
                    <h2>Τα άρθρα μου</h2>
                    {my_articles.map((article, index) => (
                        <Article
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            author_id={article.author_id}
                            date={article.date}
                            content={article.content}
                            onDelete={handleDeleteArticle}
                        />
                    ))}
                    </div>)}
                    {articles.length > 0 && (
                    <div className="articles-page">
                        <h2>Άρθρα άλλων επαγγελματιών</h2>
                        {articles.map((article, index) => (
                            <Article
                                key={index}
                                id={article.id}
                                title={article.title}
                                author_id={article.author_id}
                                date={article.date}
                                content={article.content}
                            />
                        ))}
                    </div>
                    )}
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    )
}
