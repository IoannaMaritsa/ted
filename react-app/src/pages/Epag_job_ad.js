import React from "react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import Breadcrumbs from "../components/Breadcrumbs";
import Dropdown from '../components/dropdown';
import Job_create from '../components/job_create';
import Job from '../components/job_display';
import MyJob from '../components/my_job_display';
import '../css/Epag_job_ad.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Epag_job_ad() {

  const jobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Ano Patisia', date: 'July 25, 2024', type: 'Full-time', specialization: 'Software Engineer', experience: '2', salary: '30.000', details: 'Some more info 1' },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Neo Hrakleio', date: 'June 4, 2024', type: 'Part-time', specialization: 'Customer Service', experience: '4', salary: '10.000', details: 'Some more info 2' },
    { id: 3, title: 'Sample Job Title 3', company: 'Ekdoseis Tziola', location: 'Zografou', date: 'March 12, 2024', type: 'Full-time', specialization: 'Delivery', experience: 'practice', salary: '25.000', details: 'Some more info 3' },
    { id: 4, title: 'Sample Job Title 4', company: 'Something1', location: 'Kato Patisia', date: 'April 30, 2024', type: 'Part-time', specialization: 'Engineer', experience: '8', salary: '100.000', details: 'Some more info 4' },
    { id: 5, title: 'Sample Job Title 5', company: 'something 2', location: 'Kypseli', date: 'November 2, 2024', type: 'Full-time', specialization: 'Cleaning', experience: '0', salary: '15.000', details: 'Some more info 5' },
    // Add more articles as needed
  ];

  const myjobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Ano Patisia', date: 'July 25, 2024', type: 'Full-time', specialization: 'Software Engineer', experience: '2', salary: '30.000', details: 'Some more info 1', submitions: [{ name: 'Αννιτα Πάνια', date: [23 - 2 - 2024] }, { name: 'Στεφανος Χίος', date: [20 - 3 - 2007] }] },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Neo Hrakleio', date: 'June 4, 2024', type: 'Part-time', specialization: 'Customer Service', experience: '4', salary: '10.000', details: 'Some more info 2' },

  ];

  const [selectedOption, setSelectedOption] = useState('Οι αγγελίες μου');
  const [myselectedJob, setMyselectedJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  console.log(selectedOption);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const HandleMyJobSelect = (job) => {
    setMyselectedJob(job);
  };
  const HandleJobSelect = (job) => {
    setSelectedJob(job);
  };
  console.log(myselectedJob);

  //pagination for my jobs
  const [mycurrentPage, setMyCurrentPage] = useState(1);
  const myjobsPerPage = 4;

  // Calculate total pages
  const mytotalPages = Math.ceil(myjobs.length / myjobsPerPage);

  // Get current contacts
  const myindexOfLastJob = mycurrentPage * myjobsPerPage;
  const myindexOfFirstJob = myindexOfLastJob - myjobsPerPage;
  const mycurrentJobs = myjobs.slice(myindexOfFirstJob, myindexOfLastJob);

  // Handle page change
  const myhandleClick = (pageNumber) => {
    setMyCurrentPage(pageNumber);
  };

  //pagination for others' jobs
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

  const handleSave = (updatedData) => {
    
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
        <div>
          {(selectedOption === 'Οι αγγελίες μου' && myselectedJob === null) &&
            <div className="job-split">
              <div className="jobs-left-section">

                <div className="job-display-selected">
                  <div className="job-display-title">
                    + Νέα Αγγελία
                  </div>
                </div>

                {mycurrentJobs.map((job, index) => (
                  <button className="job-display" onClick={() => HandleMyJobSelect(job)}>
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
                  </button>
                ))}
                <div className="network-pagination">
                  {[...Array(mytotalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`network-page-button ${mycurrentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => myhandleClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="jobs-right-section">
                <Job_create />
              </div>
            </div>
          }
          {(selectedOption === 'Οι αγγελίες μου' && myselectedJob != null) &&
            <div className="job-split">
              <div className="jobs-left-section">
                <button className="job-display" onClick={() => HandleMyJobSelect(null)}>
                  <div className="job-display-title">
                    + Νέα Αγγελία
                  </div>
                </button>

                {mycurrentJobs.map((job, index) => (
                  <div>
                    {job.id === myselectedJob.id ? (
                      <button className="job-display-selected" onClick={() => HandleMyJobSelect(job)}>
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
                      </button>
                    ) : (
                      <button className="job-display" onClick={() => HandleMyJobSelect(job)}>
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
                      </button>
                    )}

                  </div>
                ))}
                <div className="network-pagination">
                  {[...Array(mytotalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`network-page-button ${mycurrentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => myhandleClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="jobs-right-section">
                <MyJob
                  id={myselectedJob.id}
                  init_title={myselectedJob.title}
                  init_company={myselectedJob.company}
                  init_location={myselectedJob.location}
                  init_type={myselectedJob.type}
                  init_speciality={myselectedJob.specialization}
                  init_experience={myselectedJob.experience}
                  init_salary={myselectedJob.salary}
                  init_detail={myselectedJob.details}
                  onSave={handleSave}
                />
              </div>
            </div>
          }
          {selectedOption === 'Αγγελίες άλλων' &&
            <div className="job-split">
              <div className="jobs-left-section">
                {currentJobs.map((job, index) => (
                  <div>
                    {job.id === selectedJob.id ? (
                      <button className="job-display-selected" onClick={() => HandleJobSelect(job)}>
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
                      </button>
                    ) : (
                      <button className="job-display" onClick={() => HandleJobSelect(job)}>
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
                      </button>
                    )}

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
              <Job
                id={selectedJob.id}
                title={selectedJob.title}
                company={selectedJob.company}
                location={selectedJob.location}
                date={selectedJob.date}
                type={selectedJob.type}
                speciality={selectedJob.speciality}
                experience={selectedJob.experience}
                salary={selectedJob.salary}
                detail={selectedJob.detail}
              />
            </div>
          }

        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
