import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from 'react';
import { getAllUsers } from '../api';
import './article_display.css';



const Article = ({ id, title, author_email, date, content, onDelete }) => {

  const navigate = useNavigate();
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

  const handleProfileClick = () => {
    navigate('/epaggelmatias_network/user_profile', { state: { userEmail: author_email } });
    window.scrollTo(0, 0);
  };

  return (
    <div className="article">

      <div className="article-meta">
        <Link to={`/epaggelmatias_article/${id}`} className="link">
          <h2 className="article-title">{title}</h2>
        </Link>
        <div className="article-date">
          <img src="/calendar.png" alt="Date icon" className="iconp" />
          <span>{date}</span>
        </div>
      </div>
      <div className="article-author">
        <img src="/user.png" alt="User Icon" className="iconp" />
        <span onClick={handleProfileClick}>{author}</span>
      </div>
      <p className="article-content">{content.substring(0, 250)}...</p>
      {author_email === user_info.email && (
        <div className='send-right2'>
          <div className='icon-circle2'>
          <img src="/trash.png" alt="Image Icon" className='icontr' onClick={handleDeleteClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;