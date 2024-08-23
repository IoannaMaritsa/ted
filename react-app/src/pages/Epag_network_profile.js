import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import { useAppContext } from "../context/appContext";
import '../css/admin.css';
import { exportDataProfile } from '../utils/exportUtils';
import Breadcrumbs from "../components/Breadcrumbs";

export default function Diax_Home() {
    const { otherProfile } = useAppContext();
    const [exportFormat, setExportFormat] = useState('json');
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        if (otherProfile) {
            setLoading(false); // Profile is set, so stop loading
        }
    }, [otherProfile]);

    const [workExperience, setWorkExperience] = useState([
        { company: 'Google', role: 'Software Engineer', duration: 'Jan 2020 - Dec 2021' },
        { company: 'Microsoft', role: 'Frontend Developer', duration: 'Jan 2019 - Dec 2019' },
        // Add more entries as needed
    ]);

    const [studies, setStudies] = useState([
        { school: "National and Kapodistrian University of Athens", degree: "Undergraduate Degree", major: "Software Engineering", duration: "2016 - 2020" },
        { school: "Harvard", degree: "Masters", major: "Comp Sci", duration: "2020 - 2024" },
        // Add more entries as needed
    ]);

    const [skills, setSkills] = useState([
        { name: "Customer Satisfaction" },
        { name: "C++ Knowledge" },
        { name: "Python Knowledge" },
        { name: "React Framework" },
        // Add more entries as needed
    ]);

    const [jobAds, setJobAds] = useState([
        { name: "Ζητείται Software Developer", date: "10/07/2024" },
        { name: "Ζητείται Backend Developer για μόνιμη απασχόληση", date: "13/02/2020" },

        // Add more entries as needed
    ]);

    const [articles, setArticles] = useState([
        { name: "Τάσεις Ανάπτυξης Λογισμικού για το 2024: Από την Τεχνητή Νοημοσύνη μέχρι την Αυτοματοποίηση", date: "30/11/2023" },
        { name: "Ο Ρόλος των DevOps στη Σύγχρονη Ανάπτυξη Λογισμικού: Βελτιώνοντας την Απόδοση και τη Συνεργασία", date: "23/09/2019" },
        { name: "Ανασκόπηση των Νέων Τεχνολογιών: Πώς τα Frameworks και οι Γλώσσες Προγραμματισμού Εξελίσσονται για να Ικανοποιήσουν τις Σύγχρονες Ανάγκες", date: "20/08/2019" }

        // Add more entries as needed
    ]);

    const [comments, setComments] = useState([
        { name: "Η Σημασία της Ανάπτυξης Κώδικα με Σκεπτικό: Tips για Ενίσχυση της Κωδικοποίησης σας", comment: "Συμφωνώ απόλυτα με την σημασία του καθαρού κώδικα. Εφαρμόζουμε την τεχνική του Code Review για να εξασφαλίσουμε την ποιότητα και την αναγνωσιμότητα του κώδικα μας. Εξαιρετική ανάρτηση, ευχαριστούμε για τις χρήσιμες συμβουλές!", date: "20/01/2020" },
        { name: "Η Ανάπτυξη Λογισμικού με Χρήση Agile Μεθόδων: Πώς να Αυξήσετε την Ευελιξία και την Αποτελεσματικότητα", comment: "Συμφωνώ απόλυτα με την σημασία του καθαρού κώδικα. Εφαρμόζουμε την τεχνική του Code Review για να εξασφαλίσουμε την ποιότητα και την αναγνωσιμότητα του κώδικα μας. Εξαιρετική ανάρτηση, ευχαριστούμε για τις χρήσιμες συμβουλές! Αυτό είναι κάτι που πρέπει να συζητήσουμε περαιτέρω, καθώς η συνεχής βελτίωση είναι το κλειδί για την επιτυχία...", date: "02/12/2019" },
    ])

    const [likes, setLikes] = useState([
        { name: "Η Σημασία της Ανάπτυξης Κώδικα με Σκεπτικό: Tips για Ενίσχυση της Κωδικοποίησης σας", type: "Άρθρο", date: "20/01/2020" },
        { name: "Η Σημασία της Συνεχούς Εκπαίδευσης στον Τομέα της Ανάπτυξης Λογισμικού", type: "Άρθρο", date: "23/09/2019" },
        { name: "Τα Οφέλη της Χρήσης DevOps για Μικρές Ομάδες Ανάπτυξης", type: "Ανάρτηση", date: "20/08/2019" }

        // Add more entries as needed
    ]);

    const handleExport = () => {
        const data = {
            otherProfile,
            workExperience,
            studies,
            skills,
            jobAds,
            articles,
            comments,
            likes
        };
        exportDataProfile(data, exportFormat, 'export');
    };

    if (loading) {
        return <div>Loading...</div>; // You can customize this loading indicator
    }

 
    return (
        <div>
            <Header variant="admin" />
            <Breadcrumbs />
            <main className="adminu-main-div">
                <div className="main-container">
                    <div className="inner-container">
                        <div class="a-container">
                            <div class="a-square-div">
                                <div class="a-profile-pic"> <img src={otherProfile.profilePic} alt="Profile"></img></div>
                                <div class="user-text">
                                    <div class="a-name">{otherProfile.name}</div>
                                    <div class="a-profession">Software Engineer</div>
                                </div>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="export-select"
                                >
                                    <option value="json">JSON</option>
                                    <option value="xml">XML</option>
                                </select>
                                <button class="a-export-button" onClick={handleExport}> <img src="export.png" alt="Export Icon" class="export-icon"></img>
                                    Export</button>
                            </div>
                            <div class="a-square-div2">
                                <div class="a-icon-text">
                                    <img class="a-icon" src="work-icon.png" alt="Icon 1" />
                                    <span class="a-text">Google</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="location.png" alt="Icon 2" />
                                    <span class="a-text" >Athens, Greece</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="birthday.png" alt="Icon 3" />
                                    <span class="a-text">2002-12-12</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="regdate.png" alt="Icon 3" />
                                    <span class="a-text">{otherProfile.registrationDate}</span>
                                </div>
                                <div class="a-icon-text">
                                    <img class="a-icon" src="email.png" alt="Icon 3" />
                                    <span class="a-text">{otherProfile.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Επαγγελματική Εμπειρία
                            </div>
                            {workExperience.length > 0 ? (
                                workExperience.map((experience, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{experience.role}</div>
                                        <div className="work-company">{experience.company}</div>
                                        <div className="work-duration">{experience.duration}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No work experience available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Σπουδές
                            </div>
                            {studies.length > 0 ? (
                                studies.map((study, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{study.school}</div>
                                        <div className="work-company">{study.degree}, {study.major}</div>
                                        <div className="work-duration">{study.duration}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No studies available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Δεξιότητες
                            </div>
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{skill.name}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No skills available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Αγγελίες
                            </div>
                            {studies.length > 0 ? (
                                jobAds.map((ad, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{ad.name}</div>
                                        <div className="work-duration">{ad.date}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No job ads available</p>
                            )}
                        </div>
                        <div className="work-experience-container">
                            <div className="work-experience-row-title">
                                Άρθρα
                            </div>
                            {articles.length > 0 ? (
                                articles.map((article, index) => (
                                    <div key={index} className="work-experience-row">
                                        <div className="work-role">{article.name}</div>
                                        <div className="work-duration">{article.date}</div>
                                    </div>
                                ))
                            ) : (
                                <p>No articles available</p>
                            )}
                        </div>
                        <div class="a-container">
                            <div class="a-square-div3">
                                <div className="work-experience-row-title">
                                    Σχόλια
                                    <img src="comments.png" alt="Comments Icon"></img>
                                </div>
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="post-name">{comment.name}</div>
                                            <div className="comment">"{comment.comment}"</div>
                                            <div className="work-duration">{comment.date}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments available</p>
                                )}
                            </div>
                            <div class="a-square-div4">
                                <div className="work-experience-row-title">
                                    Σημειώσεις Ενδιαφέροντος
                                    <img src="heart.png" alt="Heart Icon"></img>
                                </div>
                                {likes.length > 0 ? (
                                    likes.map((like, index) => (
                                        <div key={index} className="work-experience-row">
                                            <div className="post-name">{like.name}</div>
                                            <div className="work-company">{like.type}</div>
                                            <div className="work-duration">{like.date}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No likes available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <MainBottom />
            <Footer />
        </div>
    );
};
