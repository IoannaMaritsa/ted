import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useState, useEffect, useLayoutEffect } from "react";
import { getAllUsers, addViewtoArticle , getUser} from "../api";
import "./article_display.css";

const Article = ({ id, title, author_email, date, content, onDelete }) => {
  const navigate = useNavigate();
  const user_info = useAppContext().user;
  const [author, setAuthor] = useState("");

  const getUsers = async () => {
    try {
      let author1 = await getUser(author_email);
      setAuthor(author1.name)

    } catch (error) {
      console.error("Error getting articles:", error);
    }
  };
  
  const handleDeleteClick = () => {
    onDelete(id); 
  };


  // Add view to article on click
  const addView = async () => {
    try {
      const response = await addViewtoArticle(user_info.email, id);
    } catch (err) {
      console.error("Error adding view:", err);
    }
  };

  const handleArticleClick = async () => {
    addView();
    navigate(`/epaggelmatias_article/${id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getUsers();
  }, []);


  const handleProfileClick = () => {
    navigate("/epaggelmatias_network/user_profile", {
      state: { userEmail: author_email },
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="article">
      <div className="article-meta">
        <a className="link" onClick={handleArticleClick}>
          <h2 className="article-title">{title}</h2>
        </a>
        <div className="article-date">
          <img src="/calendar.png" alt="Date icon" className="iconp" />
          <span>{date}</span>
        </div>
      </div>
      <div className="article-author">
        <img src="/user.png" alt="User Icon" className="iconp" />
        <span onClick={handleProfileClick}>{author}</span>
      </div>
      <p className="article-content">{content.substring(0, 250)}... </p>
      {author_email === user_info.email && (
        <div className="send-right2">
          <div className="icon-circle2">
            <img
              src="/trash.png"
              alt="Image Icon"
              className="icontr"
              onClick={handleDeleteClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
