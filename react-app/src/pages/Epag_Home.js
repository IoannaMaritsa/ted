import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import { useState } from 'react';
import '../css/epag-home.css';

export default function Epag_Home() {

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (type === 'image') {
      input.accept = 'image/*';
    } else if (type === 'video') {
      input.accept = 'video/*';
    } else if (type === 'audio') {
      input.accept = 'audio/*';
    }

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAttachedFiles((prevFiles) => [
            ...prevFiles,
            { type, name: file.name }
        ]);
        console.log(`Attached ${type}:`, file);
        // You can add additional logic here to handle the file, such as uploading it to a server
      }
    };

    input.click();
  };

  const handleRemoveFile = (index) => {
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log('Article submitted:', { title, body, attachedFiles });
    // Reset the form
    setTitle('');
    setBody('');
    setAttachedFiles([]);
  };

  return(
    <div>
        <Header variant="professional" />
        <div className="split-epag">
            <div className="side-bar">
                <div className="side-bar-section">
                    <div className="side-bar-part">
                        <div className="split-page">
                            <img src="/user.png" alt="avatar" className="profile_image" />
                            <div className="text-section">
                                <h4>Λάλης Λαλάκης</h4>
                                <h5>Πολιτικός μηχανικός</h5>
                            </div>                           
                        </div>
                    </div>
                    <div className="side-bar-part">
                        <h5>Επαγγελματικός Φορέας</h5>
                        <h6>NASA</h6>
                        <h5>Τοποθεσία</h5>
                        <h6>U.S.A</h6>
                        <h5>Ημ.Γέννησης</h5>
                        <h6>07/27/2021</h6>
                        <h5>Εθνικότητα</h5>
                        <h6>White af</h6>
                        <h5>Τηλέφωνο</h5>
                        <h6>6666666666</h6>
                        <h5>Email</h5>
                        <h6>mpamphs@nasa.com</h6>
                    </div>
                    <div className="side-bar-part">
                        <h4>Επαγγελματική εμπειρία</h4>
                    </div>
                    <div className="side-bar-part">
                        <h4>Σπουδές</h4>
                    </div>
                    <div className="side-bar-part">
                        <h4>Δεξιότητες</h4>
                    </div>
                </div>
                <div className="side-bar-section">
                    <div className="split-page">
                        <h3>Δίκτυο</h3>
                        <img src="/community.png" alt="avatar" className="network-icon" />
                    </div>
                    <div className="side-bar-contact">
                        <img src="/user.png" alt="avatar" className="network-icon" />
                        <p>Name</p>
                    </div>
                </div>
            </div>
            <div className="main-section">
                <div className="article-creator">
                    <h2>Δημιουργία νέου άρθρου</h2>
                    {/* <form onSubmit={handleSubmit}> */}
                    <div className="input-group">
                        <label htmlFor="title">Τίτλος</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Δώστε έναν τίτλο στο άρθρο σας"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="body">Κύριο Μέρος</label>
                        <textarea
                            id="body"
                            value={body}
                            onChange={handleBodyChange}
                            placeholder="Περιγράψτε αναλυτικά το θέμα"
                        />
                    </div>
                    <div className="icon-group">
                        <p>Επισύναψη αρχείου:</p>
                        <button onClick={() => handleFileUpload('image')}>
                            <img src="/icons-image.png" alt="Attach Image" />
                        </button>
                        <button onClick={() => handleFileUpload('video')}>
                            <img src="/video.png" alt="Attach Video" />
                        </button>
                        <button onClick={() => handleFileUpload('audio')}>
                            <img src="/audiofile.png" alt="Attach Audio" />
                        </button>
                    </div>
                    <div className="attached-files">
                        {attachedFiles.map((file, index) => (
                        <div key={index} className="attached-file">
                            {file.type === 'image' && <img src="/icons-image.png" alt="Image Icon" />}
                            {file.type === 'video' && <img src="/video.png" alt="Video Icon" />}
                            {file.type === 'audio' && <img src="/audiofile.png" alt="Audio Icon" />}
                            <span>{file.name}</span>
                            <button className="remove-button" onClick={() => handleRemoveFile(index)}>
                                <img src="/remove.png" alt="Image Icon" />
                            </button>
                        </div>
                        ))}
                    </div>
                    <button onClick={handleSubmit} className="submit-button">Ανάρτηση</button>
                    {/* </form> */}
                </div>
            </div>
        </div>
        <MainBottom />
        <Footer />
    </div>
  )
}
