import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { getAllUsers } from '../api';
import './article_display.css';



const Article = ({ id, title, author_email, date, content, onDelete }) => {

  const user_info = useAppContext().user;
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error getting articles:', error);
    }
  };

  const author = users.find(user => user.email === author_email)?.name || 'Unknown Author';

  const handleDeleteClick = () => {
    onDelete(id); // Call the delete function passed as a prop
  };

  useEffect(() => {
    getUsers();
  }, []);

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
      <p className="article-content">{content.substring(0, 250)}...</p>
      {author_email === user_info.email && (
        <div className='send-right'>
          <img src="/remove.png" alt="Image Icon" className='big-icon' onClick={handleDeleteClick} />
        </div>
      )}
    </div>
  );
};

export default Article;