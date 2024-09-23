import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MainBottom from "../components/MainBottom";
import Article from "../components/article_display";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import getImageUrl from "../hooks/getImageUrl";
import { format } from "date-fns";
import { formatDateRange } from "../utils/timeUtils";
import {
  addArticle,
  getArticle,
  getUser,
  deleteArticle,
  getOtherUsersArticles,
  getAllContactsByUserEmail,
  getAllExperiencesForUser,
  getAllStudiesForUser,
  getAllSkillsForUser,
  addAttachment,
} from "../api";
import "../css/epag-home.css";

export default function Epag_Home() {
  const user_info = useAppContext().user;
  const [articles, setArticles] = useState([]); // Initialize with an empty array
  const [my_articles, setMy_articles] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [studies, setStudies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contacts, setContacts] = useState([]);

  const getArticles = async (userEmail) => {
    try {
      const response = await getOtherUsersArticles(userEmail);
      setArticles(response);
    } catch (error) {
      console.error("Error getting articles:", error);
    }
  };

  const getMyArticles = async (userEmail) => {
    try {
      const response = await getArticle(userEmail);
      setMy_articles(response);
    } catch (error) {
      console.error("Error getting articles:", error);
    }
  };

  const getExperiences = async (userId) => {
    try {
      const response = await getAllExperiencesForUser(userId);
      setExperiences(response);
    } catch (error) {
      console.error("Error getting experiences:", error);
    }
  };

  const getStudies = async (userId) => {
    try {
      const response = await getAllStudiesForUser(userId);
      setStudies(response);
    } catch (error) {
      console.error("Error getting experiences:", error);
    }
  };

  const getSkills = async (userId) => {
    try {
      const response = await getAllSkillsForUser(userId);
      setSkills(response);
    } catch (error) {
      console.error("Error getting experiences:", error);
    }
  };

  const getContacts = async (userEmail) => {
    try {
      const contacts = await getAllContactsByUserEmail(userEmail);
      const contactEmails = contacts.map((contact) => contact.contact_email);
      const contactDetailsPromises = contactEmails.map((email) =>
        getUser(email)
      );
      const contactsData = await Promise.all(contactDetailsPromises);

      setContacts(contactsData); // Store the full contact details in state
    } catch (error) {
      console.error("Error getting articles:", error);
    }
  };

  useEffect(() => {
    getArticles(user_info.email);
    getContacts(user_info.email);
    getMyArticles(user_info.email);
    getExperiences(user_info.id);
    getStudies(user_info.id);
    getSkills(user_info.id);
  }, []);

  const handleDeleteArticle = async (articleId) => {
    try {
      await deleteArticle(articleId);
      await getMyArticles(user_info.email);
    } catch (error) {
      console.error("Error deleting article:", error);
      // You might want to show an error message to the user here
    }
  };

  const { setOtherProfile, otherProfile } = useAppContext();

  const navigate = useNavigate();

  // On profile pick navigate to the selected user's profile
  const handleProfileClick = (user) => {
    navigate("/epaggelmatias_network/user_profile", {
      state: { userEmail: user.email },
    });
    window.scrollTo(0, 0);
  };

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const maxArticles = 6;
  let currentArticles = 0;


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type;

      setAttachedFiles((prevFiles) => [
        ...prevFiles,
        { type: type, file: file },
      ]);
    }
  };

  const handleFileUpload = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === "image" ? "image/*" : type === "video" ? "video/*" : "audio/*";
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    // Handle the form submission logic here
    let articleId;
    try {
      articleId = await addArticle(title, user_info.email, now, body);

      for (const attachment of attachedFiles) {
        const { type, file } = attachment;

        try {
          await addAttachment(articleId, type, file);
        } catch (error) {
          console.error(
            `Error adding attachment for article ID ${articleId}:`,
            error
          );
        }
      }

      await getMyArticles(user_info.email);

      setTitle("");
      setBody("");
      setAttachedFiles([]);
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  return (
    <div>
      <Header />
      <nav className="breadcrumbs">
        <img src="/home.png" className="home-icon" alt="Home" /> &nbsp;/
      </nav>
      <div className="split-epag">
        <div className="side-bar">
          <div className="side-bar-section">
            <div className="side-bar-part">
              <div className="split-page">
                <img
                  src={getImageUrl(user_info.profilepic, "profilepics")}
                  alt="avatar"
                  className="profile_image"
                />
                <div className="text-section2">
                  <span className="profile-sect-name">{user_info.name}</span>
                  <span className="profile-sect-prof">
                    {user_info.profession}
                  </span>
                </div>
              </div>
            </div>
            <div className="side-bar-part">
              <span className="profile-sect-headhead">Πληροφορίες</span>
              <span className="profile-sect-head">Επαγγελματικός Φορέας</span>
              <span className="profile-sect-bot">{user_info.workplace}</span>
              <span className="profile-sect-head">Τοποθεσία</span>
              <span className="profile-sect-bot">{user_info.location}</span>
              <span className="profile-sect-head">Ημ.Γέννησης</span>
              <span className="profile-sect-bot">{user_info.dob}</span>
              <span className="profile-sect-head">Email</span>
              <span className="profile-sect-bot">{user_info.email}</span>
            </div>
            <div className="side-bar-part">
              <span className="profile-sect-headhead">
                Επαγγελματική εμπειρία
              </span>
              {experiences.map((experience, index) => (
                <div className="home-user-info">
                  <span className="home-user-info-h3">
                    {experience.profession}
                  </span>
                  <p className="home-user-info-h4">{experience.workplace}</p>
                  <p className="home-user-info-h5">
                    <span>
                      {formatDateRange(
                        experience.start_date,
                        experience.end_date
                      )}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <div className="side-bar-part">
              <span className="profile-sect-headhead">Σπουδές</span>
              {studies.map((study, index) => (
                <div className="home-user-info">
                  <span className="home-user-info-h3">{study.university}</span>
                  <p className="home-user-info-h4">{study.degree}</p>
                  <p className="home-user-info-h5">
                    <span>{study.start_date}</span> -{" "}
                    <span>{study.end_date}</span>
                  </p>
                </div>
              ))}
            </div>
            <div className="side-bar-part">
              <span className="profile-sect-headhead">Δεξιότητες</span>
              {skills.map((skill, index) => (
                <ul className="home-user-info-ul">
                  <li>{skill.skill_name}</li>
                </ul>
              ))}
            </div>
          </div>
          <div className="side-bar-section">
            <div className="network-title">
              <img src="/community.png" alt="avatar" className="network-icon" />
              <span className="profile-sect-headhead">Συνδέσεις</span>
            </div>
            <div className="contacts-page">
              <ul className="contacts-list">
                {contacts?.map((contact, index) => (
                  <div
                    className="contact"
                    onClick={() => handleProfileClick(contact)}
                  >
                    <img
                      src={getImageUrl(contact.profilepic, "profilepics")}
                      alt="contact-pic"
                      className="contact-icon"
                    />
                    <li className="profile-sect-contact" key={index}>
                      {contact.name}{" "}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="main-section">
          <div className="article-creator">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="article-creator-top">
                <span className="article-creator-ttitle">
                  Δημιουργία νέου άρθρου
                </span>
                <button
                  type="submit"
                  id="submitArticleButton"
                  className="submit-button"
                >
                  Ανάρτηση
                </button>
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
                <button
                  type="button"
                  id="attachFileButton"
                  onClick={() => handleFileUpload("image")}
                >
                  <img
                    src="/photo-icon.png"
                    alt="Attach Image"
                    className="photicon"
                  />
                </button>
                <button
                  type="button"
                  id="attachFileButton"
                  onClick={() => handleFileUpload("video")}
                >
                  <img
                    src="/video-icon.png"
                    alt="Attach Video"
                    className="vidicon"
                  />
                </button>
                <button
                  type="button"
                  id="attachFileButton"
                  onClick={() => handleFileUpload("audio")}
                >
                  <img
                    src="/audio-icon.png"
                    alt="Attach Audio"
                    className="audicon"
                  />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              {attachedFiles.length > 0 && (
                <div className="attached-files">
                  <span className="attach-title">Επισυναπτόμενα αρχεία:</span>
                  <ul>
                    {attachedFiles.map((attachment, index) => (
                      <li className="attach-li" key={index}>
                        <span className="attach-type">
                          {" "}
                          {attachment.type.toUpperCase()}:{" "}
                        </span>
                        <span className="attach-name">
                          {" "}
                          {attachment.file.name}{" "}
                        </span>
                        <img
                          className="yellow-trash"
                          type="button"
                          src="/yellow-trash.png"
                          alt="delete"
                          onClick={() => handleRemoveFile(index)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
          {my_articles.length > 0 && (
            <div>
              <h2>Τα άρθρα μου</h2>
              <div className="articles-page">
                {my_articles.map((article, index) => (
                  <Article
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    author_email={article.author_email}
                    date={format(article.publish_date, "yyyy-MM-dd")}
                    content={article.content}
                    onDelete={handleDeleteArticle}
                  />
                ))}
              </div>
            </div>
          )}
          {articles.length > 0 && (
            <div>
              <h2>Άρθρα άλλων επαγγελματιών</h2>
              <div className="articles-page">
                {articles.map((article, index) => (
                  <Article
                    key={index}
                    id={article.id}
                    title={article.title}
                    author_email={article.author_email}
                    date={format(article.publish_date, "yyyy-MM-dd")}
                    content={article.content}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  );
}
