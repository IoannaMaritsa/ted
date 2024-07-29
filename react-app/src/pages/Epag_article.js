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
        { id: 1, title: 'Sample Article Title 1', author: 'John Doe', date: 'July 25, 2024', content: 'This is a sample article content. It provides a brief overview of the article.' },
        { id: 2, title: 'Sample Article Title 2', author: 'Jane Smith', date: 'July 24, 2024', content: 'This is another sample article content. It provides more details about the article.' },
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