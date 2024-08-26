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
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Epag_job_ad() {

  const locations = [
    'Περιοχές Όλες',
    'Αθήνα - Κέντρο',
    'Πειραιάς',
    'Ηράκλειο Κρήτης',
    'Άνω Πατήσια',
    'Νέο Ηράκλειο',
    'Ζωγράφου',
    'Κάτω Πατήσια',
    'Κυψέλη'
  ];

  const jobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Άνω Πατήσια', date: '2024-07-27', type: 'Πλήρης', specialization: 'Software Engineer', experience: 2, salary: 80000, details: 'Some more info 1' },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Νέο Ηράκλειο', date: '2024-04-06', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 50000, details: 'Some more info 2' },
    { id: 3, title: 'Sample Job Title 3', company: 'Ekdoseis Tziola', location: 'Ζωγράφου', date: '2024-08-20', type: 'Πλήρης', specialization: 'Delivery', experience: 0, salary: 25000, details: 'Some more info 3' },
    { id: 4, title: 'Sample Job Title 4', company: 'Something1', location: 'Κάτω Πατήσια', date: '2024-04-30', type: 'Εθελοντική', specialization: 'Engineer', experience: 8, salary: 0, details: 'Some more info 4' },
    { id: 5, title: 'Sample Job Title 5', company: 'something 2', location: 'Κυψέλη', date: '2019-09-15', type: 'Πλήρης', specialization: 'Cleaning', experience: 0, salary: 150000, details: 'Some more info 5' },
    // Add more articles as needed
  ];

  const myjobs = [
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Άνω Πατήσια', date: '2024-12-01', type: 'Εθελοντική', specialization: 'Software Engineer', experience: 2, salary: 0, details: 'Some more info 1', submissions: [{ name: 'Αννιτα Πάνια', date: '23 / 2 / 2024' }, { name: 'Στεφανος Χίος', date: '20 / 2 / 2007' }] },
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Νέο Ηράκλειο', date: '2024-10-25', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 100000, details: 'Some more info 2', submissions: [{ name: 'Αννιτα Πάνια', date: '23 / 2 / 2024' }] },

  ];

  const [data, setData] = useState(myjobs);

  const [selectedOption, setSelectedOption] = useState('Οι αγγελίες μου');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Δημοσίευση Όλες');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('Απασχόληση Όλες');
  const [selectedExperienceFilter, setSelectedExperienceFilter] = useState('Εμπειρία Όλες');
  const [selectedSalaryFilter, setSelectedSalaryFilter] = useState('Μισθός Όλες');
  const [selectedLocation, setSelectedLocation] = useState('Περιοχές Όλες');

  const [myselectedJob, setMyselectedJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);

  console.log(selectedOption);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setMyselectedJob(null); // Clear myselectedJob when switching options
    setSelectedJob(jobs[0]); // Clear selectedJob when switching options
  };

  const handleDateFilterChange = (option) => {
    setSelectedDateFilter(option);
  };

  const handleTypeFilterChange = (option) => {
    setSelectedTypeFilter(option);
  };

  const handleExperienceFilterChange = (option) => {
    setSelectedExperienceFilter(option);
  };

  const handleSalaryFilterChange = (option) => {
    setSelectedSalaryFilter(option);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
};

  const HandleJobSelect = (job) => {
    setSelectedJob(job); // This will trigger a re-render with the new job's details
  };

  const HandleMyJobSelect = (job) => {
    setMyselectedJob(job); // This will trigger a re-render with the new job's details
  };

  console.log(selectedJob);
  const filterJobs = (jobArray) => {
    return jobArray.filter(job => {
        let isMatch = true;

        // Filter by Date
        if (selectedDateFilter !== 'Δημοσίευση Όλες') {
            const jobDate = new Date(job.date);
            const now = new Date();
            if (selectedDateFilter === 'Την τελευταία εβδομάδα') {
                const lastWeek = new Date();
                lastWeek.setDate(now.getDate() - 7);
                if (jobDate < lastWeek) isMatch = false;
            } else if (selectedDateFilter === 'Τον τελευταίο μήνα') {
                const lastMonth = new Date();
                lastMonth.setMonth(now.getMonth() - 1);
                if (jobDate < lastMonth) isMatch = false;
            }
        }

        // Filter by Type
        if (selectedTypeFilter !== 'Απασχόληση Όλες' && job.type !== selectedTypeFilter) {
            isMatch = false;
        }

        // Filter by Experience
        if (selectedExperienceFilter !== 'Εμπειρία Όλες') {
            if (selectedExperienceFilter === '0-2 Έτη' && job.experience > 2) isMatch = false;
            else if (selectedExperienceFilter === '2+ Έτη' && job.experience < 2) isMatch = false;
            else if (selectedExperienceFilter === '8+ Έτη' && job.experience < 8) isMatch = false;
        }

        // Filter by Salary
        if (selectedSalaryFilter !== 'Μισθός Όλες') {
            const salaryFilterValue = parseInt(selectedSalaryFilter.replace(/[^\d]/g, ''));
            if (job.salary < salaryFilterValue) isMatch = false;
        }

        if (selectedLocation !== 'Περιοχές Όλες') {
          if (job.location !== selectedLocation) isMatch = false;
        }

        return isMatch;
    });
};

const filteredJobs = filterJobs(jobs);
const myfilteredJobs = filterJobs(myjobs);


  //pagination for my jobs
  const [mycurrentPage, setMyCurrentPage] = useState(1);
  const myjobsPerPage = 4;

  // Calculate total pages
  const mytotalPages = Math.ceil(myjobs.length / myjobsPerPage);

  // Get current contacts
  const myindexOfLastJob = mycurrentPage * myjobsPerPage;
  const myindexOfFirstJob = myindexOfLastJob - myjobsPerPage;
  const mycurrentJobs = myfilteredJobs.slice(myindexOfFirstJob, myindexOfLastJob);

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
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSave = (index, updatedData) => {
    const newData = [...data];
    newData[index] = updatedData;
    setData(newData);
  };

  return (
    <div>
      <Header variant="professional" />
      <Breadcrumbs />
      <div className="main">
        <div className="job-options">
          <Dropdown options={['Οι αγγελίες μου', 'Αγγελίες άλλων']} onOptionSelect={handleOptionSelect} />
          {(selectedOption === 'Αγγελίες άλλων') &&
            <Dropdown options={['Από Όλους τους Χρήστες', 'Συνδεδεμένους', 'Μη Συνδεδεμένους']} />
          }

          <Dropdown options={locations} onOptionSelect={handleLocationSelect}/>

          <Dropdown options={['Δημοσίευση Όλες', 'Την τελευταία εβδομάδα', 'Τον τελευταίο μήνα']} onOptionSelect={handleDateFilterChange} />
          <Dropdown options={['Απασχόληση Όλες', 'Πλήρης', 'Μερική', 'Εθελοντική']} onOptionSelect={handleTypeFilterChange} />
          <Dropdown options={['Εμπειρία Όλες', '0-2 Έτη', '2+ Έτη', '8+ Έτη']} onOptionSelect={handleExperienceFilterChange} />
          <Dropdown options={['Μισθός Όλες', '40.000+', '80.000+', '120.000+']} onOptionSelect={handleSalaryFilterChange} />
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
                  <div className="job-display" onClick={() => HandleMyJobSelect(job)}>
                    <div className="job-display-date"> {job.date} </div>
                    <div className="job-display-title">{job.title}</div>
                    <div className="job-display-company">{job.company}</div>
                    <div className="job-display-company">{job.specialization}</div>
                    <div className="job-display-company">{job.type} Απασχόληση</div>
                    <div className="job-display-salary">{job.salary} €</div>
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
                <Job_create />
              </div>
            </div>
          }
          {(selectedOption === 'Οι αγγελίες μου' && myselectedJob != null) &&
            <div className="job-split">
              <div className="jobs-left-section">
                <div className="job-display" onClick={() => HandleMyJobSelect(null)}>
                  <div className="job-display-title">
                    + Νέα Αγγελία
                  </div>
                </div>

                {mycurrentJobs.map((job, index) => (
                  <div>
                    {job.id === myselectedJob.id ? (
                      <div className="job-display-selected" onClick={() => HandleMyJobSelect(job)}>
                        <div className="job-display-date"> {job.date} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.specialization}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div className="job-display" onClick={() => HandleMyJobSelect(job)}>
                        <div className="job-display-date"> {job.date} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.specialization}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
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
                  index={myselectedJob.id}
                  init_title={myselectedJob.title}
                  init_company={myselectedJob.company}
                  init_location={myselectedJob.location}
                  init_type={myselectedJob.type}
                  init_speciality={myselectedJob.specialization}
                  init_experience={myselectedJob.experience}
                  init_salary={myselectedJob.salary}
                  init_detail={myselectedJob.details}
                  init_submissions={myselectedJob.submissions}
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
                      <div className="job-display-selected" onClick={() => HandleJobSelect(job)}>
                        <div className="job-display-date"> {job.date} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.specialization}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div className="job-display" onClick={() => HandleJobSelect(job)}>
                        <div className="job-display-date"> {job.date} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.specialization}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
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
              <div className="jobs-right-section">
                <Job
                  id={selectedJob.id}
                  title={selectedJob.title}
                  company={selectedJob.company}
                  location={selectedJob.location}
                  date={selectedJob.date}
                  type={selectedJob.type}
                  speciality={selectedJob.specialization}
                  experience={selectedJob.experience}
                  salary={selectedJob.salary}
                  detail={selectedJob.details}
                />
              </div>
            </div>
          }

        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  )
}
