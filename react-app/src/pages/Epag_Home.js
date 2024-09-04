import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Article from '../components/article_display';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import '../css/epag-home.css';

export default function Epag_Home() {
    const { user } = useAppContext();
    const [articles, setArticles] = useState([
        {
            id: '1',
            title: 'Article 1',
            author_id: 1,
            date: '2024-07-26',
            content: 'This is the content of the first article. It is a brief description of the article.'
        },
        {
            id: '2',
            title: 'Article 2',
            author_id: 2,
            date: '2024-07-25',
            content: 'This is the content of the second article. It is a brief description of the article.'
        },
        {
            id: '3',
            title: 'Article 3',
            author_id: 3,
            date: '2024-07-28',
            content: 'This is the content of the third article. It is a brief description of the article.'
        },
        {
            id: '4',
            title: 'Article 4',
            author_id: 999,
            date: '2024-07-25',
            content: 'This is the content of the second article. It is a brief description of the article.'
        },
        {
            id: '5',
            title: 'Article 5',
            author_id: 999,
            date: '2024-07-28',
            content: 'This is the content of the third article. It is a brief description of the article.'
        },
        // Add more articles as needed
    ]);

    // Base URL and bucket name
    const baseURL = 'https://deenohwgdmmzsnyvpnxz.supabase.co';
    const bucketName = 'profilepics';

    // Original URL (saved in the profilepic field)
    const originalProfilePicUrl = user?.profilepic;

    // Add '/public/' to the URL path if necessary
    const profileImageUrl = originalProfilePicUrl
        ? originalProfilePicUrl.replace(
            `${baseURL}/storage/v1/object/${bucketName}/`,
            `${baseURL}/storage/v1/object/public/${bucketName}/`
        )
        : `${baseURL}/storage/v1/object/public/${bucketName}/default-avatar.jpeg`;

    const user_info = {
        id: user.id,
        profilePic: profileImageUrl,
        name: user.name,
        workplace: user.workplace || "Google",
        profession: user.profession || "Software Developer",
        location: user.location,
        birthday: user.dob,
        email: user.email,
        experiences: [{ profession: 'Software Engineer', workplace: 'Google', date: 'Jan 2020 - Dec 2021' }, { profession: 'Frontend Developer', workplace: 'Microsoft', date: 'Jan 2019 - Dec 2019' }],
        studies: [{ university: 'Ekpa', degree: 'Undergraduate Degree, Software Engineering', date: '2016 - 2020' }, { university: 'Harvard', degree: 'Masters, Comp Sci', date: '2020 - 2024' }],
        skills: ['Customer Satisfaction', 'C++ Knowledge', 'Python Knowledge', 'React Framework']
    }

    const sortedArticles = articles.filter((i, _) => i.author_id !== user_info.id).sort((a, b) => new Date(b.date) - new Date(a.date));

    const [my_articles, setMy_articles] = useState(articles.filter((i, _) => i.author_id === user_info.id).sort((a, b) => new Date(b.date) - new Date(a.date)));

    useEffect(() => {
        setMy_articles(articles.filter((i, _) => i.author_id === user_info.id).sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, [my_articles]);


    const handleDeleteArticle = (articleId) => {
        setArticles(articles.filter(article => article.id !== articleId));
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


    useEffect(() => {
        console.log(attachedFiles)
    }, [attachedFiles]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setBody(e.target.value);
    };

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const type = e.target.accept.includes('image') ? 'image' :
                e.target.accept.includes('video') ? 'video' :
                    'audio';

            setAttachedFiles((prevFiles) => [
                ...prevFiles,
                { type, name: file.name }
            ]);
            console.log(`Attached ${type}:`, file);
        }
    };

    const handleFileUpload = (type) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = (index) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }

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
                                <img src={profileImageUrl} alt="avatar" className="profile_image" />
                                <div className="text-section2">
                                    <span className="profile-sect-name">{user_info.name}</span>
                                    <span className="profile-sect-prof">{user_info.profession}</span>
                                </div>
                            </div>
                        </div>
                        <div className="side-bar-part">
                            <span className="profile-sect-headhead">Πληροφορίες</span>
                            <span className="profile-sect-head">Επαγγελματικός Φορέας</span>
                            <span className="profile-sect-bot">{user_info.workplace}</span>
                            <span className="profile-sect-head">Τοποθεσία</span>
                            <span className="profile-sect-bot">{user_info.location}</span>
                            <span className="profile-sect-head">Ημ.Γέννησης</span>
                            <span className="profile-sect-bot">{user_info.birthday}</span>
                            <span className="profile-sect-head">Email</span>
                            <span className="profile-sect-bot">{user_info.email}</span>
                        </div>
                        <div className="side-bar-part">
                            <span className="profile-sect-headhead">Επαγγελματική εμπειρία</span>
                            {user_info.experiences.map((experience, index) => (
                                <div className="home-user-info">
                                    <span className="home-user-info-h3">
                                        {experience.profession}
                                    </span>
                                    <p className="home-user-info-h4">
                                        {experience.workplace}
                                    </p>
                                    <p className="home-user-info-h5">
                                        {experience.date}
                                    </p>
                                </div>
                            ))}

                        </div>
                        <div className="side-bar-part">
                            <span className="profile-sect-headhead">Σπουδές</span>
                            {user_info.studies.map((study, index) => (
                                <div className="home-user-info">
                                    <span className="home-user-info-h3">
                                        {study.university}
                                    </span>
                                    <p className="home-user-info-h4">
                                        {study.degree}
                                    </p>
                                    <p className="home-user-info-h5">
                                        {study.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="side-bar-part">
                            <span className="profile-sect-headhead">Δεξιότητες</span>
                            {user_info.skills.map((skill, index) => (
                                <ul className="home-user-info-ul">
                                    <li>
                                        {skill}
                                    </li>
                                </ul>
                            ))}
                        </div>
                    </div>
                    <div className="side-bar-section">
                        <div className="network-title">
                            <img src="/community.png" alt="avatar" className="network-icon" />
                            <span className="profile-sect-headhead">Δίκτυο</span>
                        </div>
                        <div className="contacts-page">
                            <ul className="contacts-list">
                                {contacts.map((contact, index) => (
                                    <div className="contact" onClick={() => handleProfileClick(contact)}>
                                        <img src={contact.profilePic} alt="contact-pic" className="contact-icon" />
                                        <li className="profile-sect-contact" key={index}>{contact.name} </li>
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
                                <span className="article-creator-ttitle">Δημιουργία νέου άρθρου</span>
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
                                <button onClick={() => handleFileUpload('image')} >
                                    <img src="/photo-icon.png" alt="Attach Image" className="photicon" />
                                </button>
                                <button onClick={() => handleFileUpload('video')}>
                                    <img src="/video-icon.png" alt="Attach Video" className="vidicon" />
                                </button>
                                <button onClick={() => handleFileUpload('audio')}>
                                    <img src="/audio-icon.png" alt="Attach Audio" className="audicon" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </div>
                            {attachedFiles.length > 0 && (
                                <div className="attached-files">
                                    <span className="attach-title">Επισυναπτόμενα αρχεία:</span>
                                    <ul>
                                        {attachedFiles.map((file, index) => (
                                            <li className="attach-li"key={index}>
                                                <span className="attach-type" > {file.type.toUpperCase()}: </span>
                                                <span className="attach-name"> {file.name} </span>
                                                <img className="yellow-trash" type="button" src="/yellow-trash.png" alt="delete" onClick={() => handleRemoveFile(index)} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="articles-page">
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
                    </div>
                    <div className="articles-page">
                        <h2>Άρθρα άλλων επαγγελματιών</h2>
                        {sortedArticles.map((article, index) => (
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
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    )
}
