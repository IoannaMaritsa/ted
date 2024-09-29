import React, { useState, useMemo, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/admin.css';
import { exportData } from '../utils/exportUtils';
import UserRow from "../components/UserRow";
import {
  getAllUsers, getAllStudiesForUser, getAllExperiencesForUser, getAllSkillsForUser, getAllArticles, getCommentsOfUser, getAllContactsByUserEmail,
  getUserInterests, getJobsOfUser
} from "../api";
import { useNavigate } from 'react-router-dom';

export default function Diax_Home() {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState('json');

  const itemsPerPage = 6;

  // Reset currentPage to 1 whenever searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error getting all the users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users
      .filter(user =>
        (user.name && user?.name.toLowerCase().includes(query)) ||
        (user.email && user?.email.toLowerCase().includes(query)) ||
        (user.profession && user?.profession.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
  }, [searchQuery, sortConfig, users]);

  // Calculate total pages
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

  const handleExport = async () => {
    // Filter users to only include those that are selected
    const selectedUsers = filteredUsers.filter(user => user.isSelected);

    // If no users are selected, do not proceed with the export
    if (selectedUsers.length === 0) {
      alert('Please select at least one user to export.');
      return;
    }



    const dataPromises = selectedUsers.map(async user => {
      const userDetails = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        id: user.id,
        location: user.location,
        profilepic: user.profilepic,
        profession: user.profession,
        workplace: user.workplace,
        studies: await getAllStudiesForUser(user.id),
        skills: await getAllSkillsForUser(user.id),
        experiences: await getAllExperiencesForUser(user.id),
        articles: (await getAllArticles(user.email)).myarticles,
        jobads: await getJobsOfUser(user.email),
        likes: await getUserInterests(user.email),
        comments: await getCommentsOfUser(user.email),
        contacts: await getAllContactsByUserEmail(user.email)

      };
      return userDetails;

    });
    const data = await Promise.all(dataPromises);

    // Export the selected users
    exportData(data, exportFormat, 'export');
  };






  const handleCheckboxChange = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isSelected: !user.isSelected };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleSelectAllChange = (isChecked) => {
    const updatedUsers = users.map(user => ({
      ...user,
      isSelected: isChecked,
    }));
    setUsers(updatedUsers);
  };


  const navigate = useNavigate();

  const handleProfileClick = (user) => {
    navigate('/admin_user', { state: { userEmail: user.email } });
    window.scrollTo(0, 0);
  }

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };



  return (
    <div className="admin">
      <Header variant="admin" />
      <nav className="breadcrumbs"> <img src="/home.png" className='home-icon' alt="Home" /> &nbsp; /</nav>
      <main className="admin-main-div">
        <div className="box-header2">
          <h1 className="title-admin">Λίστα Χρηστών</h1>
        </div>
        <div className="row1">
          <div className="ebutton-div">
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
          <div className="search-container">
            <input
              type="text"
              placeholder="Αναζήτηση Χρηστών"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <img src="search.png" alt="Search Icon" className="search-icon"></img>
          </div>
        </div>
        <div className="admin-box">
          <table>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                  />
                </th>
                <th style={{ width: '15%' }}></th>
                <th style={{ width: '25%' }} onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'sortable active' : 'sortable'}>
                  Όνομα {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th style={{ width: '25%' }} onClick={() => handleSort('email')} className={sortConfig.key === 'email' ? 'sortable active' : 'sortable'}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
                <th style={{ width: '20%' }} onClick={() => handleSort('profession')} className={sortConfig.key === 'profession' ? 'sortable active' : 'sortable'}>
                  Επάγγελμα {sortConfig.key === 'profession' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onProfileClick={handleProfileClick}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
            </tbody>
          </table>
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
      </main>
      <MainBottom />
      <Footer />
    </div>
  );
}
