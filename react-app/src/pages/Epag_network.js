import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import '../css/epag-network.css';
import { useState, useMemo } from 'react';

export default function Epag_network() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState();

    const itemsPerPage = 6;
    const users = [
        {
            id: 1,
            profilePic: 'default-avatar.jpeg',
            name: 'Alice Johnson',
            profession: 'Software Engineer',
            workplace: 'Tech Solutions Inc.'
        },
        {
            id: 2,
            profilePic: 'default-avatar.jpeg',
            name: 'Bob Smith',
            profession: 'Graphic Designer',
            workplace: 'Creative Studio Ltd.'
        },
        {
            id: 3,
            profilePic: 'default-avatar.jpeg',
            name: 'Charlie Brown',
            profession: 'Product Manager',
            workplace: 'Innovate Co.'
        },
        {
            id: 4,
            profilePic: 'default-avatar.jpeg',
            name: 'David Wilson',
            profession: 'Marketing Specialist',
            workplace: 'AdVantage Agency'
        },
        {
            id: 5,
            profilePic: 'default-avatar.jpeg',
            name: 'Eve Davis',
            profession: 'Data Analyst',
            workplace: 'Data Insights Corp.'
        },
        {
            id: 6,
            profilePic: 'default-avatar.jpeg',
            name: 'Frank Miller',
            profession: 'UX/UI Designer',
            workplace: 'Design Dynamics LLC'
        },
        {
            id: 7,
            profilePic: 'default-avatar.jpeg',
            name: 'Grace Lee',
            profession: 'Financial Advisor',
            workplace: 'Finance Solutions'
        },
        {
            id: 8,
            profilePic: 'default-avatar.jpeg',
            name: 'Henry Walker',
            profession: 'HR Manager',
            workplace: 'People First Inc.'
        }
    ];


    const filteredUsers = useMemo(() => {
        const query = (searchQuery || '').toLowerCase();
        return users.filter(user => {
            const name = (user.name || '').toLowerCase();
            const profession = (user.profession || '').toLowerCase();
            const workplace = (user.workplace || '').toLowerCase();
            return name.includes(query) ||
                   profession.includes(query) ||
                   workplace.includes(query);
        });
    }, [searchQuery, users]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Calculate the index of the first and last user on the current page
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };


    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div class="main-wrapper">
                <div class="box-header">
                    <h1 class="title2">Συνδέσεις</h1>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Αναζήτηση Χρηστών"
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img src="search.png" alt="Search Icon" className="search-icon"></img>
                    </div>
                </div>
                <div class="center-square">
                    <div className="grid-container">
                        {currentUsers.map(user => (
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
                                <button className="info-button">Προβολή Προφίλ</button>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Προηγούμενο
                    </button>
                    <span>Σελίδα {currentPage} από {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Επόμενο
                    </button>
                </div>
            </div>
            <MainBottom />
            <Footer />
        </div>
    );
}