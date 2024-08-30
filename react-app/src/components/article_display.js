import React from 'react';
import { Link } from 'react-router-dom';
import './article_display.css';

const users= [
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
  {
    id: 999,
    profilePic: '/default-avatar.jpeg',
    name: 'Λάκης Λαλάκης',
},
];

const Article = ({ id, title, author_id, date, content, onDelete }) => {

  const author = users.find(user => user.id === author_id)?.name || 'Unknown Author';

  const handleDeleteClick = () => {
    onDelete(id); // Call the delete function passed as a prop
};

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
      {author_id === 999 && (
        <div className='send-right'>
          <img src="/remove.png" alt="Image Icon" className='big-icon' onClick={handleDeleteClick} />
        </div>
      )}
    </div>
  );
};

export default Article;