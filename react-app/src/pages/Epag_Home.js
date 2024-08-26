import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Article from '../components/article_display';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import '../css/epag-home.css';

export default function Epag_Home() {
    const articles = [
        {
            id: '1',
            title: 'Article 1',
            author: 'John Doe',
            date: '2024-07-26',
            content: 'This is the content of the first article. It is a brief description of the article.'
        },
        {
            id: '2',
            title: 'Article 2',
            author: 'Jane Smith',
            date: '2024-07-25',
            content: 'This is the content of the second article. It is a brief description of the article.'
        },
        {
            id: '3',
            title: 'Article 3',
            author: 'Jojo Siwa',
            date: '2024-07-28',
            content: 'This is the content of the third article. It is a brief description of the article.'
        },
        {
            id: '4',
            title: 'Article 4',
            author: 'Λάκης Λαλάκης',
            date: '2024-07-25',
            content: 'This is the content of the second article. It is a brief description of the article.'
        },
        {
            id: '5',
            title: 'Article 5',
            author: 'Λάκης Λαλάκης',
            date: '2024-07-28',
            content: 'This is the content of the third article. It is a brief description of the article.'
        },
        // Add more articles as needed
    ];

    const user_info = {
        id : 999,
        profilePic: '/default-avatar.jpeg',
        name: 'Λάκης Λαλάκης',
        profession: 'Πολιτικός Μηχανικός',
        workplace: 'NASA',
        location: 'Τρίπολη',
        birthday: '27-07-1960',
        email: 'lalakis@example.com',
        experiences: [{ profession: 'Software Engineer', workplace: 'Google', date: 'Jan 2020 - Dec 2021' }, { profession: 'Frontend Developer', workplace: 'Microsoft', date: 'Jan 2019 - Dec 2019' }],
        studies: [{ university: 'Ekpa', degree: 'Undergraduate Degree, Software Engineering', date: '2016 - 2020' }, { university: 'Harvard', degree: 'Masters, Comp Sci', date: '2020 - 2024' }],
        skills: ['Customer Satisfaction', 'C++ Knowledge', 'Python Knowledge', 'React Framework']
    }

    const sortedArticles = articles.filter((i, _) => i.author !== user_info.name).sort((a, b) => new Date(b.date) - new Date(a.date));

    const my_articles = articles.filter((i, _) => i.author === user_info.name).sort((a, b) => new Date(b.date) - new Date(a.date));

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

    useEffect(() => {
        console.log('Updated otherProfile:', otherProfile);
    }, [otherProfile]);

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
        // Handle the form submission logic here
        console.log('Article submitted:', { title, body, attachedFiles });
        // Reset the form
        setTitle('');
        setBody('');
        setAttachedFiles([]);
    };

    return (
        <div>
            <Header variant="professional" />
            <nav className="breadcrumbs"><img src="/home.png" className='home-icon' alt="Home"/> &nbsp;/</nav>
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
                            {user_info.experiences.map((experience, index) => (
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
                            ))}

                        </div>
                        <div className="side-bar-part">
                            <h4>Σπουδές</h4>
                            {user_info.studies.map((study, index) => (
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
                            ))}
                        </div>
                        <div className="side-bar-part">
                            <h4>Δεξιότητες</h4>
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
                    <div className="articles-page">
                        <h2>Τα άρθρα μου</h2>
                        {my_articles.map((article, index) => (
                            <Article
                                key={index}
                                id={article.id}
                                title={article.title}
                                author={article.author}
                                date={article.date}
                                content={article.content}
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
                                author={article.author}
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
