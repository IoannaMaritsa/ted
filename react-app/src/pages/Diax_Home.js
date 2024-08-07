import React, { useState, useMemo } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import { useAppContext } from "../context/appContext";
import '../css/admin.css';
import {exportData} from '../utils/exportUtils';
import UserRow from "../components/UserRow";

export default function Diax_Home() {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportFormat, setExportFormat] = useState('json');
  const {setUserProfile } = useAppContext();

  const itemsPerPage = 6;

  // Initial users state
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', email: 'alice@example.com', registrationDate: '2023-01-01', profilePic: 'default-avatar.jpeg' },
    { id: 2, name: 'Bob', email: 'bob@example.com', registrationDate: '2023-02-01', profilePic: 'default-avatar.jpeg' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', registrationDate: '2023-03-01', profilePic: 'default-avatar.jpeg' },
    { id: 4, name: 'David', email: 'david@example.com', registrationDate: '2023-04-01', profilePic: 'default-avatar.jpeg' },
    { id: 5, name: 'Eve', email: 'eve@example.com', registrationDate: '2023-05-01', profilePic: 'default-avatar.jpeg' },
    { id: 6, name: 'Frank', email: 'frank@example.com', registrationDate: '2023-06-01', profilePic: 'default-avatar.jpeg' },
    { id: 7, name: 'Grace', email: 'grace@example.com', registrationDate: '2023-07-01', profilePic: 'default-avatar.jpeg' },
    { id: 8, name: 'Hannah', email: 'hannah@example.com', registrationDate: '2023-08-01', profilePic: 'default-avatar.jpeg' },
    { id: 9, name: 'Ian', email: 'ian@example.com', registrationDate: '2023-09-01', profilePic: 'default-avatar.jpeg' },
    { id: 10, name: 'Jack', email: 'jack@example.com', registrationDate: '2023-10-01', profilePic: 'default-avatar.jpeg' },
    { id: 11, name: 'Kara', email: 'kara@example.com', registrationDate: '2023-11-01', profilePic: 'default-avatar.jpeg' },
    { id: 12, name: 'Liam', email: 'liam@example.com', registrationDate: '2023-12-01', profilePic: 'default-avatar.jpeg' },
  ]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users
      .filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        if (sortConfig.key === 'registrationDate') {
          const dateA = new Date(a.registrationDate);
          const dateB = new Date(b.registrationDate);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
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

  const handleExport = () => {
    const data = filteredUsers.map(user => ({
      name: user.name,
      email: user.email,
      registrationDate: user.registrationDate
    }));
    exportData(data, exportFormat, 'export');
  };




  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    const updatedUsers = users.map(user => ({ ...user, isSelected: isChecked }));
    setUsers(updatedUsers);
  };



  const handleProfileClick = (user) => {
    console.log(user);
    setUserProfile(user);
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
      <nav className="breadcrumbs">🏠︎/</nav>
      <main className="admin-main-div">
        <h2 className="title">Λίστα Χρηστών</h2>
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
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <img src="search.png" alt="Search Icon" className="search-icon"></img>
          </div>
        </div>
        <table className="admin-box">
          <thead>
            <tr>
              <th style={{ width: '5%' }}>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, 'all')}
                />
              </th>
              <th style={{ width: '15%' }}></th>
              <th style={{ width: '25%' }} onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'sortable active' : 'sortable'}>
                Όνομα {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th style={{ width: '25%' }} onClick={() => handleSort('email')} className={sortConfig.key === 'email' ? 'sortable active' : 'sortable'}>
                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
              </th>
              <th style={{ width: '20%' }} onClick={() => handleSort('registrationDate')} className={sortConfig.key === 'registrationDate' ? 'sortable active' : 'sortable'}>
                Ημερομηνία Εγγραφής {sortConfig.key === 'registrationDate' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
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
