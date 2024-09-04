import React from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import '../css/epag-network.css';
import { useAppContext } from "../context/appContext";
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllContactsByUserId } from "../api";

export default function Epag_network() {
    const [searchQueryConnected, setSearchQueryConnected] = useState("");
    const [searchQueryOther, setSearchQueryOther] = useState("");
    const [currentPageConnected, setCurrentPageConnected] = useState(1);
    const [currentPageOther, setCurrentPageOther] = useState(1);
    const itemsPerPage = 6;
    const [connectedUsers, setConnectedUsers] = useState([]);
    const { setOtherProfile, otherProfile, user } = useAppContext();
    const navigate = useNavigate();

    // Fetch contacts on component mount
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const contactsData = await getAllContactsByUserId(user.id);
                setConnectedUsers(contactsData);
                // Assume you have another API function for potential connections
                const potentialConnectionsData = await getOtherUsers(userId);
                setPotentialConnections(potentialConnectionsData);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, [user.id]);

    
    const otherUsers = [
        {
            id: 3,
            profilePic: '/default-avatar.jpeg',
            name: 'Charlie Brown',
            profession: 'Product Manager',
            workplace: 'Innovate Co.',
        },
        {
            id: 4,
            profilePic: '/default-avatar.jpeg',
            name: 'David Wilson',
            profession: 'Marketing Specialist',
            workplace: 'AdVantage Agency',
        },
        {
            id: 5,
            profilePic: '/default-avatar.jpeg',
            name: 'Eve Davis',
            profession: 'Data Analyst',
            workplace: 'Data Insights Corp.',
        },
        // Add more other users here
    ];

    // Filtering and Pagination for Connected Users
    const filteredConnectedUsers = useMemo(() => {
        const query = (searchQueryConnected || '').toLowerCase();
        return connectedUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const profession = (user.profession || '').toLowerCase();
            const workplace = (user.workplace || '').toLowerCase();
            return name.includes(query) ||
                profession.includes(query) ||
                workplace.includes(query);
        });
    }, [searchQueryConnected, connectedUsers]);

    const totalPagesConnected = Math.ceil(filteredConnectedUsers.length / itemsPerPage);
    const indexOfLastConnectedUser = currentPageConnected * itemsPerPage;
    const indexOfFirstConnectedUser = indexOfLastConnectedUser - itemsPerPage;
    const currentConnectedUsers = filteredConnectedUsers.slice(indexOfFirstConnectedUser, indexOfLastConnectedUser);

    // Filtering and Pagination for Other Users
    const filteredOtherUsers = useMemo(() => {
        const query = (searchQueryOther || '').toLowerCase();
        return otherUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const profession = (user.profession || '').toLowerCase();
            const workplace = (user.workplace || '').toLowerCase();
            return name.includes(query) ||
                profession.includes(query) ||
                workplace.includes(query);
        });
    }, [searchQueryOther, otherUsers]);

    const totalPagesOther = Math.ceil(filteredOtherUsers.length / itemsPerPage);
    const indexOfLastOtherUser = currentPageOther * itemsPerPage;
    const indexOfFirstOtherUser = indexOfLastOtherUser - itemsPerPage;
    const currentOtherUsers = filteredOtherUsers.slice(indexOfFirstOtherUser, indexOfLastOtherUser);

    // Handlers for Pagination
    const handlePageChangeConnected = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPagesConnected) {
            setCurrentPageConnected(pageNumber);
        }
    };

    const handlePageChangeOther = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPagesOther) {
            setCurrentPageOther(pageNumber);
        }
    };

    const handleProfileClick = (user) => {
        setOtherProfile(user);
        navigate('/epaggelmatias_network/user_profile', { state: { otherProfile: user } });
    };

    useEffect(() => {
        console.log('Updated otherProfile:', otherProfile);
    }, [otherProfile]);

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="main-wrapper">
                <div className="box-header">
                    <h1 className="title2">Δίκτυο</h1>
                </div>

                {/* Connected Users Section */}
                <div className="user-section">
                    <div className="header-header">
                        <span className="section-title">Συνδέσεις</span>
                        <div className="search-container2">
                            <input
                                type="text"
                                placeholder="Αναζήτηση Συνδεδεμένων Χρηστών"
                                className="search-input"
                                value={searchQueryConnected}
                                onChange={(e) => setSearchQueryConnected(e.target.value)}
                            />
                            <img src="search.png" alt="Search Icon" className="search-icon"></img>
                        </div>
                    </div>
                    <div className="grid-container">
                        {currentConnectedUsers.map(user => (
                            <div key={user.id} className="box">
                                <img src={user.profilePic} alt="Profile Picture" className="e-profile-pic" />
                                <div className="user-info">
                                    <h3 className="name">{user.name}</h3>
                                    <p className="e-profession">{user.profession}</p>
                                    <div className="workplace-container">
                                        <img src="work-icon.png" alt="Workplace Icon" className="workplace-icon" />
                                        <p className="e-workplace">{user.workplace}</p>
                                    </div>
                                </div>
                                <button
                                    className="info-button"
                                    onClick={() => handleProfileClick(user)}
                                >
                                    Προβολή Προφίλ
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChangeConnected(currentPageConnected - 1)}
                            disabled={currentPageConnected === 1}
                        >
                            Προηγούμενο
                        </button>
                        <span>Σελίδα {currentPageConnected} από {totalPagesConnected}</span>
                        <button
                            onClick={() => handlePageChangeConnected(currentPageConnected + 1)}
                            disabled={currentPageConnected === totalPagesConnected}
                        >
                            Επόμενο
                        </button>
                    </div>
                </div>

                {/* Other Users Section */}
                <div className="user-section">
                    <div className="header-header">
                        <span className="section-title"> Μη Συνδεδεμένοι Χρήστες</span>
                        <div className="search-container2">
                            <input
                                type="text"
                                placeholder="Αναζήτηση Χρηστών"
                                className="search-input"
                                value={searchQueryOther}
                                onChange={(e) => setSearchQueryOther(e.target.value)}
                            />
                            <img src="search.png" alt="Search Icon" className="search-icon"></img>
                        </div>
                    </div>
                    <div className="grid-container">
                        {currentOtherUsers.map(user => (
                            <div key={user.id} className="box">
                                <img src={user.profilePic} alt="Profile Picture" className="e-profile-pic" />
                                <div className="user-info">
                                    <h3 className="name">{user.name}</h3>
                                    <p className="e-profession">{user.profession}</p>
                                    <div className="workplace-container">
                                        <img src="work-icon.png" alt="Workplace Icon" className="workplace-icon" />
                                        <p className="e-workplace">{user.workplace}</p>
                                    </div>
                                </div>
                                <button
                                    className="info-button"
                                    onClick={() => handleProfileClick(user)}
                                >
                                    Προβολή Προφίλ
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChangeOther(currentPageOther- 1)}
                            disabled={currentPageOther === 1}
                        >
                            Προηγούμενο
                        </button>
                        <span>Σελίδα {currentPageOther} από {totalPagesOther}</span>
                        <button
                            onClick={() => handlePageChangeOther(currentPageOther + 1)}
                            disabled={currentPageOther === totalPagesOther}
                        >
                            Επόμενο
                        </button>
                    </div>
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
}
