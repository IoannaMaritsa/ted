import React from 'react';
import { Link } from 'react-router-dom';
import './article_display.css';

const Article = ({ id, title, author, date, content }) => {
  return (
    <div className="article">
      <Link to={`/epaggelmatias_article/${id}`} className="link">
        <h2 className="article-title">{title}</h2>
      </Link>
      <div className="article-meta">
        <div className="article-author">
          <img src="/user.png" alt="User Icon" className="icon" />
          <span>{author}</span>
        </div>
        <div className="article-date">
          <img src="/calendar.png" alt="Date icon" className="icon" />
          <span>{date}</span>
        </div>
      </div>
      <p className="article-content">{content}</p>
    </div>
  );
};

export default Article;