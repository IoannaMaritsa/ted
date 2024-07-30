import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import Dropdown from '../components/dropdown';
import '../css/Epag_job_ad.css';
import { useState } from 'react';

export default function Epag_job_ad() {

  const [selectedOption, setSelectedOption] = useState('Οι αγγελίες μου');

  console.log(selectedOption);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const jobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Ano Patisia', date: 'July 25, 2024', type: 'Full-time', specialization: 'Software Engineer', experience: '2', salary: '30.000', details: 'Some more info 1' },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Neo Hrakleio', date: 'June 4, 2024', type: 'Part-time', specialization: 'Customer Service', experience: '4', salary: '10.000', details: 'Some more info 2' },
    { id: 3, title: 'Sample Job Title 3', company: 'Ekdoseis Tziola', location: 'Zografou', date: 'March 12, 2024', type: 'Full-time', specialization: 'Delivery', experience: 'practice', salary: '25.000', details: 'Some more info 3' },
    { id: 4, title: 'Sample Job Title 4', company: 'Something1', location: 'Kato Patisia', date: 'April 30, 2024', type: 'Part-time', specialization: 'Engineer', experience: '8', salary: '100.000', details: 'Some more info 4' },
    { id: 5, title: 'Sample Job Title 5', company: 'something 2', location: 'Kypseli', date: 'November 2, 2024', type: 'Full-time', specialization: 'Cleaning', experience: '0', salary: '15.000', details: 'Some more info 5' },
    // Add more articles as needed
  ];

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Get current contacts
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header variant="professional" />
      <Breadcrumbs />
      <div className="main">
        <div className="job-options">
          <Dropdown options={['Οι αγγελίες μου', 'Αγγελίες άλλων']} onOptionSelect={handleOptionSelect} />
        </div>
        <div className="job-options">
          <Dropdown options={['Δημοσίευση Όλες', 'Την τελευταία εβδομάδα', 'Τον τελευταίο μήνα']} />
          <Dropdown options={['Απασχόληση Όλες', 'Πλήρης', 'Μερική', 'Εθελοντισμός']} />
          <Dropdown options={['Εμπειρία Όλες', 'Πρακτική', '2+ Έτη', '10+ Έτη']} />
          <Dropdown options={['Μισθός Όλες', '40.000+', '80.000+', '120.000+']} />
        </div>
        <div className="job-split">
          {selectedOption === 'Οι αγγελίες μου' &&
            <div>
              <div className="job-display">
                <div className="job-display-title">
                  + Νέα Αγγελία
                </div>
              </div>
              {currentJobs.map((job, index) => (
                <div className="job-display">
                  <div key={index}>
                    <div className="job-display-title">
                      <p>{job.title}</p>
                      <p>{job.date}</p>
                    </div>
                    <h5>{job.company}</h5>
                    <h6>Ζητείται {job.specialization}</h6>
                    <div className="job-display-title">
                      <p>{job.type}</p>
                      <p>{job.salary}</p>
                    </div>

                  </div>
                </div>
              ))}
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
          }
          {selectedOption === 'Αγγελίες άλλων' && <div>Content for Option 2</div>}
          <div className="black-frame">
            <h2>Δημιουργία Νέας Αγγελίας</h2>
            <div className="job-input-group">
              <label htmlFor="title">Τίτλος</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Δώστε έναν τίτλο στο άρθρο σας"
              />
            </div>
            <div className="job-input-group">
              <label htmlFor="title">Επαγγελματικός φορέας</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Δώστε έναν τίτλο στο άρθρο σας"
              />
            </div>
            <div className="job-input-group">
              <label htmlFor="title">Ειδικότητα</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Δώστε έναν τίτλο στο άρθρο σας"
              />
            </div>
            <div className="job-input-group">
              <label htmlFor="title">Περιοχή</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Δώστε έναν τίτλο στο άρθρο σας"
              />
            </div>
            <div className="job-input-group">
              <label htmlFor="title">Απασχόληση</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Δώστε έναν τίτλο στο άρθρο σας"
              />
            </div>
          </div>
        </div>

      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
