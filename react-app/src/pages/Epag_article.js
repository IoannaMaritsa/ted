import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


const Epag_article = () => {

    const [body, setBody] = useState('');

    const articles = [
        { id: 1, title: 'Sample Article Title 1', author: 'John Doe', date: 'July 25, 2024', content: 'This is a sample article content. It provides a brief overview of the article.', attachments: { images: ['businessleader.jpg', 'activist.jpg'], videos: [], audios: [] } },
        { id: 2, title: 'Sample Article Title 2', author: 'Jane Smith', date: 'July 24, 2024', content: 'This is another sample article content. It provides more details about the article.', attachments: { images: [], videos: [], audios: [] } },
        // Add more articles as needed
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
                        <div className="article-author">
                            <img src="/user.png" alt="User Icon" className="icon" />
                            <span>{article.author}</span>
                        </div>
                        <div className="article-date">
                            <img src="/calendar.png" alt="Date icon" className="icon" />
                            <span>{article.date}</span>
                        </div>
                    </div>
                    <p className="article-content">{article.content}</p>
                    {article.attachments.images.length > 0 && (
                        <div className="attachments">
                            {article.attachments.images.length !== 0 && (
                                <>
                                    <h3>Φωτογραφίες</h3>
                                    {article.attachments.images.map((image, index) => (
                                        <img key={index} src={`/${image}`} alt={`Attachment ${index + 1}`} className='article-image' />
                                    ))}
                                </>
                            )}
                            {article.attachments.videos.length !== 0 && (
                                <>
                                    <h3>Βίντεο</h3>
                                    {article.attachments.videos.map((video, index) => (
                                        <video key={index} src={`/${video}`} alt={`Attachment ${index + 1}`} className='article-image' />
                                    ))}
                                </>
                            )}
                            {article.attachments.audios.length !== 0 && (
                                <>
                                    <h3>Ήχοι</h3>
                                    {article.attachments.audios.map((audio, index) => (
                                        <audio key={index} src={`/${audio}`} alt={`Attachment ${index + 1}`} className='article-image' />
                                    ))}
                                </>
                            )}

                        </div>
                    )}

                    {article.attachments.videos.length > 0 && (
                        <div className="attachments">
                            <h3>Videos</h3>
                            {article.attachments.videos.map((video, index) => (
                                <video key={index} controls>
                                    <source src={`/${video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ))}
                        </div>
                    )}

                    {article.attachments.audios.length > 0 && (
                        <div className="attachments">
                            <h3>Audios</h3>
                            {article.attachments.audios.map((audio, index) => (
                                <audio key={index} controls>
                                    <source src={`/${audio}`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            ))}
                        </div>
                    )}
                    <button className='interest-button'>Με ενδιαφέρει</button>

                    <div className="input-group">
                        <textarea
                            id="body"
                            value={body}
                            onChange={handleBodyChange}
                            placeholder="Σχολιάστε"
                        />
                    </div>
                    <button onClick={handleSubmit} className="button-primary">Ανάρτηση</button>
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
};

export default Epag_article;