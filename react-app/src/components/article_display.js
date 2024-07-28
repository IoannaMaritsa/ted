import React from 'react';
import './article_display.css';

const Article = ({ title, author, date, content }) => {
  return (
    <div className="article">
      <h2 className="article-title">{title}</h2>
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