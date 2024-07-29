import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Article from '../components/article_display';
import Breadcrumbs from '../components/Breadcrumbs';
import { useState } from 'react';
import '../css/epag-home.css';

export default function Epag_Home() {
    const articles = [
        { 
          id: '1',
          title: 'Article 1',
          author: 'John Doe',
          date: '2024-07-26',
          content: 'This is the content of the first article. It is a brief description of the article.'
        },
        {
            id: '2',
          title: 'Article 2',
          author: 'Jane Smith',
          date: '2024-07-25',
          content: 'This is the content of the second article. It is a brief description of the article.'
        },
        {
            id: '3',
            title: 'Article 3',
            author: 'Jojo Siwa',
            date: '2024-07-28',
            content: 'This is the content of the third article. It is a brief description of the article.'
          },
        // Add more articles as needed
      ];

      const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));

      const contacts = [
        'Contact 1',
        'Contact 2',
        'Contact 3',
        'Contact 4',
        'Contact 5',
        'Contact 6',
        'Contact 7',
        'Contact 8',
        'Contact 9',
        'Contact 10',
        'Contact 11',
        'Contact 12',
        'Contact 13',
        'Contact 14',
        'Contact 15',
        'Contact 16',
        'Contact 17',
        'Contact 18',
        'Contact 19',
        'Contact 20'
        // Add more contacts as needed
      ];
      const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  // Get current contacts
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <Breadcrumbs />
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
                        <h6>
                            Lorem ipsum dolor sit amet, ius eius paulo vivendo ea, ei pri etiam possim deterruisset, nec ut omnes viderer vituperatoribus. Est illud mandamus suscipiantur ei. Tale suas iuvaret pro ex, vis an adhuc dicit. Sea justo nostrud adolescens no. Congue tamquam sit at.Ut nulla animal mei. Sea an ceteros recusabo, eos stet maiorum probatus at, appellantur referrentur in vix. Nominati erroribus maluisset cu pro. Eos dignissim cotidieque ad, mei no incorrupte dissentiet.
                        </h6>
                    </div>
                    <div className="side-bar-part">
                        <h4>Σπουδές</h4>
                        <h6>
                            Lorem ipsum dolor sit amet, ius eius paulo vivendo ea, ei pri etiam possim deterruisset, nec ut omnes viderer vituperatoribus. Est illud mandamus suscipiantur ei. Tale suas iuvaret pro ex, vis an adhuc dicit. Sea justo nostrud adolescens no. Congue tamquam sit at.
                        </h6>
                    </div>
                    <div className="side-bar-part">
                        <h4>Δεξιότητες</h4>
                        <h6>
                            Lorem ipsum dolor sit amet, ius eius paulo vivendo ea, ei pri etiam possim deterruisset, nec ut omnes viderer vituperatoribus. Est illud mandamus suscipiantur ei. Tale suas iuvaret pro ex, vis an adhuc dicit. Sea justo nostrud adolescens no. Congue tamquam sit at.
                        </h6>
                        <h6>
                            Ut nulla animal mei. Sea an ceteros recusabo, eos stet maiorum probatus at, appellantur referrentur in vix. Nominati erroribus maluisset cu pro. Eos dignissim cotidieque ad, mei no incorrupte dissentiet
                        </h6>
                        <h6>
                            Novum utamur facilis his in. No qui animal nominati. Odio graecis lobortis an nec. Mea ei nominavi volutpat, nullam numquam an sit. Vix in justo meliore. In minim omnium pri, sit everti option ex.
                        </h6>
                    </div>
                </div>
                <div className="side-bar-section">
                    <div className="network-title">
                        <img src="/community.png" alt="avatar" className="network-icon" />
                        <span>Δίκτυο</span>
                    </div>
                    <div className="contacts-page">
                        <ul className="contacts-list">
                            {currentContacts.map((contact, index) => (
                            <div className="contact">
                                <li key={index}>{contact} </li>
                                <img src="/user.png" alt="contact-pic" className="icon" />
                            </div>
                            ))}
                        </ul>
                        <div className="network-pagination">
                            {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`network-page-button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handleClick(index + 1)}
                            >
                            {index + 1}
                            </button>
                            ))}
                        </div>
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
                <div className="articles-page">
                {sortedArticles.map((article, index) => (
                    <Article
                        key={index}
                        id = {article.id}
                        title={article.title}
                        author={article.author}
                        date={article.date}
                        content={article.content}
                    />
                ))}
                </div>
            </div>
        </div>
        <MainBottom />
        <Footer />
    </div>
  )
}
