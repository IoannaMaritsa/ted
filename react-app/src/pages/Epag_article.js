import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MainBottom from "../components/MainBottom";
import Breadcrumbs from "../components/Breadcrumbs";
import { useAppContext } from "../context/appContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/article_display.css";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  getArticleById,
  getComments,
  getUser,
  getAttachments,
  addInterest,
  removeInterest,
  getUserInterests,
  addComment,
} from "../api";
import getImageUrl from "../hooks/getImageUrl";
import { formatRelativeTime } from "../utils/timeUtils";



const Epag_article = () => {

  const myuser = useAppContext().user;
  const { id } = useParams();
  const navigate = useNavigate();

  const handleProfileClick = (userEmail) => {
    navigate("/epaggelmatias_network/user_profile", {
      state: { userEmail: userEmail },
    });
    window.scrollTo(0, 0);
  };

  const [body, setBody] = useState("");

  const [comments, setComments] = useState([]);
  const [article, setArticle] = useState([]);
  const [author, setAuthor] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [interested, setInterested] = useState(false);

  const getArticle = async (id) => {
    try {
      const response = await getArticleById(id);
      setArticle(response);
    } catch (error) {
      console.error("Error getting articles:", error);
    }
  };

  const getAuthor = async (email) => {
    try {
      const response = await getUser(email);
      setAuthor(response);
    } catch (error) {
      console.error("Error getting author:", error);
    }
  };

  const getArticleAttachments = async (articleId) => {
    try {
      const response = await getAttachments(articleId);
      setAttachments(response);
    } catch (error) {
      console.error("Error getting attachments:", error);
    }
  };

  const getUserByEmail = async (email) => {
    try {
      const response = await getUser(email);
      return response; 
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  };

  const getCommentsOfArticle = async (articleId) => {
    try {
      const response = await getComments(articleId);
      const commentsWithUserDetails = await Promise.all(
        response.map(async (comment) => {
          const user = await getUserByEmail(comment.author_email);
          return { ...comment, user }; 
        })
      );
      setComments(commentsWithUserDetails);
    } catch (error) {
      console.error("Error getting comments:", error);
    }
  };

  const getInterest = async (userEmail, articleId) => {
    try {
      const interests = await getUserInterests(userEmail);
      if (interests.includes(articleId)) {
        setInterested(true);
      }
    } catch (error) {
      console.error("Error getting interests:", error);
    }
  };

  const handleInterestChange = async () => {
    if (!interested) {
      try {
        const response = await addInterest(myuser.email, parseInt(id));
      } catch (error) {
        console.error("Error adding interest:", error);
      }
    } else if (interested) {
      try {
        const response = await removeInterest(myuser.email, parseInt(id));
      } catch (error) {
        console.error("Error removing interest:", error);
      }
    }
    setInterested(!interested);
  };



  useEffect(() => {
    getArticle(parseInt(id));
    getCommentsOfArticle(parseInt(id));
    getAuthor(article.author_email);
    getArticleAttachments(parseInt(id));
    getInterest(myuser.email, parseInt(id));
  }, [article.author_email]);

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      await addComment(parseInt(id), myuser.email, body);
      await getCommentsOfArticle(parseInt(id));
      setBody("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };



  return (
    <div>
      <Header variant="professional" />
      <Breadcrumbs />
      <div className="main">
        <div className="article-container2">
          <div className="interest-box"></div>
          <div className="article-title45">
            <span>{article.title}</span>
            {interested === false ? (
              <button
                className="interest-button36"
                onClick={handleInterestChange}
              >
                Με ενδιαφέρει{" "}
                <img
                  src="/yellow-heart23.png"
                  alt="heart"
                  className="iconp"
                ></img>
              </button>
            ) : (
              <button
                className="interest-button36"
                onClick={handleInterestChange}
              >
                Δεν με ενδιαφέρει
              </button>
            )}
          </div>
          <div className="article-meta">
            <div
              className="article-author1"
              onClick={() => handleProfileClick(author.email)}
            >
              <img
                src={getImageUrl(author?.profilepic, "profilepics")}
                alt="User Icon"
                className="pp12"
              />
              <span>{author.name}</span>
            </div>
            <div className="article-date">
              <img src="/calendar.png" alt="Date icon" className="iconp" />
              {article.publish_date ? (
                <span>{format(article.publish_date, "yyyy-MM-dd")}</span>
              ) : (
                <span>No date available</span>
              )}
            </div>
          </div>
          <p className="article-content">{article.content}</p>
          {attachments.length > 0 && (
            <>
              {attachments.map((attachment, index) => {
                const { type, url } = attachment; 

                if (type.startsWith("image/")) {
                  return (
                    <div className="flex-article" key={index}>
                      <img
                        src={getImageUrl(url, "attachments")}
                        alt={`Attachment ${index + 1}`}
                        className="attachment-image"
                      />
                    </div>
                  );
                } else if (type.startsWith("video/")) {
                  return (
                    <div className="flex-article" key={index}>
                      <video width="500" controls className="attachment-image">
                        <source
                          src={getImageUrl(url, "attachments")}
                          type={type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  );
                } else if (type.startsWith("audio/")) {
                  return (
                    <div key={index}>
                      <audio controls>
                        <source
                          src={getImageUrl(url, "attachments")}
                          type={type}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <p>Unsupported attachment type: {type}</p>
                    </div>
                  );
                }
              })}
            </>
          )}



          <div className="article-comment-section">
            <h3>Σχόλια</h3>
            {comments.length === 0 ? (
              <div className="notification-item">
                Το άρθρο δεν έχει ακόμα σχόλια
              </div>
            ) : (
              <>
                {comments.map((comment, index) => (
                  <div className="notification-item">
                    <img
                      src={getImageUrl(comment.user.profilepic, "profilepics")}
                      alt={`${comment.user.name}'s profile`}
                      className="profile-pic"
                    />
                    <div className="notification-text">
                      <div className="row-text12">
                        <span
                          className="notification-name2"
                          onClick={() =>
                            handleProfileClick(comment.author_email)
                          }
                        >
                          {comment.user.name}
                        </span>
                        <span className="author-date12">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <span>{comment.text}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <form onSubmit={handleSubmitComment}>
            <div className="input-group">
              <textarea
                id="body"
                value={body}
                onChange={handleBodyChange}
                placeholder="Σχολιάστε"
                required
              />
            </div>
            <div className="interest-box">
              <button type="submit" className="article-comment-button2">
                Ανάρτηση
              </button>
            </div>
          </form>
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  );
};

export default Epag_article;
