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
import { useState, useMemo, useEffect } from 'react';
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

  const user_info = {
    id : 999,
    profilePic: '/default-avatar.jpeg',
    name: 'Λάκης Λαλάκης',
    profession: 'Πολιτικός Μηχανικός',
    workplace: 'NASA',
    location: 'Τρίπολη',
    birthday: '27-07-1960',
    email: 'lalakis@example.com',
    experiences: [{ profession: 'Software Engineer', workplace: 'Google', date: 'Jan 2020 - Dec 2021' }, { profession: 'Frontend Developer', workplace: 'Microsoft', date: 'Jan 2019 - Dec 2019' }],
    studies: [{ university: 'Ekpa', degree: 'Undergraduate Degree, Software Engineering', date: '2016 - 2020' }, { university: 'Harvard', degree: 'Masters, Comp Sci', date: '2020 - 2024' }],
    skills: ['Customer Satisfaction', 'C++ Knowledge', 'Python Knowledge', 'React Framework']
}

  const users = [
    {
      id: 234,
      profilePic: '/default-avatar.jpeg',
      name: 'Αννίτα Πάνια',
    },
    {
      id: 700,
      profilePic: '/default-avatar.jpeg',
      name: 'Στέφανος Χίος',
    },
    {
      id: 509,
      profilePic: '/default-avatar.jpeg',
      name: 'Will Smith',
    },
    {
      
    }
  ];

  const [jobs, setJobs] = useState([
    { id: 1, title: 'Sample Job Title 1', company: 'Google', location: 'Άνω Πατήσια', date: '2024-07-27', type: 'Πλήρης', specialization: 'Software Engineer', experience: 2, salary: 80000, details: 'Some more info 1', submissions: [] , creator_id : 234},
    { id: 2, title: 'Sample Job Title 2', company: 'Kotsovolos A.E', location: 'Νέο Ηράκλειο', date: '2024-04-06', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 50000, details: 'Some more info 2', submissions: [] , creator_id : 700},
    { id: 3, title: 'Sample Job Title 3', company: 'Ekdoseis Tziola', location: 'Ζωγράφου', date: '2024-08-20', type: 'Πλήρης', specialization: 'Delivery', experience: 0, salary: 25000, details: 'Some more info 3', submissions: [] , creator_id : 509},
    { id: 4, title: 'Sample Job Title 4', company: 'Something1', location: 'Κάτω Πατήσια', date: '2024-04-30', type: 'Εθελοντική', specialization: 'Engineer', experience: 8, salary: 0, details: 'Some more info 4', submissions: [] , creator_id : 700},
    { id: 5, title: 'Sample Job Title 5', company: 'something 2', location: 'Κυψέλη', date: '2019-09-15', type: 'Πλήρης', specialization: 'Cleaning', experience: 0, salary: 150000, details: 'Some more info 5', submissions: [] , creator_id : 234},
    { id: 6, title: 'Sample Job Title 6', company: 'Electroholic', location: 'Άνω Πατήσια', date: '2024-08-17', type: 'Εθελοντική', specialization: 'Software Engineer', experience: 2, salary: 0, details: 'Some more info 6', submissions: [{ user: users.find((person) => person.id === 234), date: '2017-02-12' }, { user: users.find((person) => person.id === 509), date: '2021-04-25' }] , creator_id: 999},
    { id: 7, title: 'Sample Job Title 7', company: 'Vodafone', location: 'Νέο Ηράκλειο', date: '2019-03-15', type: 'Μερική', specialization: 'Customer Service', experience: 4, salary: 100000, details: 'Some more info 7', submissions: [{ user: users.find((person) => person.id === 700), date: '23 / 2 / 2024' }], creator_id : 999 },
    // Add more articles as needed
  ]);

  const [myjobs, setMyjobs] = useState(jobs.filter((i, _) => i.creator_id === user_info.id));

  const [selectedOption, setSelectedOption] = useState('Οι αγγελίες μου');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Δημοσίευση Όλες');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('Απασχόληση Όλες');
  const [selectedExperienceFilter, setSelectedExperienceFilter] = useState('Εμπειρία Όλες');
  const [selectedSalaryFilter, setSelectedSalaryFilter] = useState('Μισθός Όλες');
  const [selectedLocation, setSelectedLocation] = useState('Περιοχές Όλες');


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

  const [mysearchQuery, setMysearchQuery] = useState();
  const [searchQuery, setSearchQuery] = useState();

  const searchJobs = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    const otherjobs = jobs.filter((i, _) => i.creator_id !== user_info.id);
    return otherjobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const specialization = (job.specialization || '').toLowerCase();
      return title.includes(query) ||
        company.includes(query) ||
        specialization.includes(query);
    });
  }, [searchQuery, jobs]);

  const searchMyjobs = useMemo(() => {
    const query = (mysearchQuery || '').toLowerCase();
    return myjobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const specialization = (job.specialization || '').toLowerCase();
      return title.includes(query) ||
        company.includes(query) ||
        specialization.includes(query);
    });
  }, [mysearchQuery, myjobs]);


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

  const filteredJobs = filterJobs(searchJobs);
  const myfilteredJobs = filterJobs(searchMyjobs);


  //pagination for my jobs
  const [mycurrentPage, setMyCurrentPage] = useState(1);
  const myjobsPerPage = 4;

  // Calculate total pages
  const mytotalPages = Math.ceil(myfilteredJobs.length / myjobsPerPage);

  // Get current contacts
  const myindexOfLastJob = mycurrentPage * myjobsPerPage;
  const myindexOfFirstJob = myindexOfLastJob - myjobsPerPage;
  const mycurrentJobs = myfilteredJobs.slice(myindexOfFirstJob, myindexOfLastJob).sort((a, b) => new Date(b.date) - new Date(a.date));;
  const [myselectedJob, setMyselectedJob] = useState(null);

  // Handle page change
  const myhandleClick = (pageNumber) => {
    setMyCurrentPage(pageNumber);
  };

  //pagination for others' jobs
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Get current contacts
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob).sort((a, b) => new Date(b.date) - new Date(a.date));;
  const [selectedJob, setSelectedJob] = useState(currentJobs[0]);

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSave = (updatedJob) => {
    console.log(jobs);
    console.log(updatedJob);
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === updatedJob.id ? updatedJob : job
      )
    );
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setMyselectedJob(null); // Clear myselectedJob when switching options
    setSelectedJob(currentJobs[0]); // Clear selectedJob when switching options
  };

  const HandleJobSelect = (job) => {
    setSelectedJob(job); // This will trigger a re-render with the new job's details
  };

  const HandleMyJobSelect = (job) => {
    setMyselectedJob(job); // This will trigger a re-render with the new job's details
  };

  const AddJob = (job) => {
    setJobs([...jobs, job]);
  };

  useEffect(() => {
    setCurrentPage(1);
    setMyCurrentPage(1);
  }, [searchQuery, mysearchQuery]);

  useEffect(() => {
    setMyselectedJob(null);
    if (currentJobs.length > 0) {
      setSelectedJob(currentJobs[0]);
    }
  }, [selectedDateFilter, selectedExperienceFilter, selectedLocation, selectedSalaryFilter, selectedTypeFilter, searchQuery, mysearchQuery]);

  useEffect(() => {
    setMyjobs(jobs.filter((i, _) => i.creator_id === user_info.id))
  }, [jobs]);

  return (
    <div>
      <Header variant="professional" />
      <Breadcrumbs />
      <div className="main">
        <div className="send-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Αναζήτηση Αγγελίας"
              className="search-input"
              value={selectedOption === 'Οι αγγελίες μου' ? mysearchQuery : searchQuery}
              onChange={(e) => { selectedOption === 'Οι αγγελίες μου' ? setMysearchQuery(e.target.value) : setSearchQuery(e.target.value) }}
            />
            <img src="/search.png" alt="Search Icon" className="search-icon"></img>
          </div>
        </div>
        <div className="job-options">
          <Dropdown options={['Οι αγγελίες μου', 'Αγγελίες άλλων']} onOptionSelect={handleOptionSelect} />
          {(selectedOption === 'Αγγελίες άλλων') &&
            <Dropdown options={['Από Όλους τους Χρήστες', 'Συνδεδεμένους', 'Μη Συνδεδεμένους']} />
          }

          <Dropdown options={locations} onOptionSelect={handleLocationSelect} />

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
                {mycurrentJobs.length > 0 ? (
                  <div className="pagination">
                    <button
                      onClick={() => myhandleClick(mycurrentPage - 1)}
                      disabled={mycurrentPage === 1}
                    >
                      Προηγούμενο
                    </button>
                    <span>Σελίδα {mycurrentPage} από {mytotalPages}</span>
                    <button
                      onClick={() => myhandleClick(mycurrentPage + 1)}
                      disabled={mycurrentPage === mytotalPages}
                    >
                      Επόμενο
                    </button>
                  </div>
                ) : (
                  <div>Δεν υπάρχουν αγγελίες με αυτά τα κριτήρια </div>
                )}
              </div>
              <div className="jobs-right-section">
                <Job_create id={jobs.length + 1} onSave={AddJob}/>
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
                {mycurrentJobs.length > 0 ? (
                  <div className="pagination">
                    <button
                      onClick={() => myhandleClick(mycurrentPage - 1)}
                      disabled={mycurrentPage === 1}
                    >
                      Προηγούμενο
                    </button>
                    <span>Σελίδα {mycurrentPage} από {mytotalPages}</span>
                    <button
                      onClick={() => myhandleClick(mycurrentPage + 1)}
                      disabled={mycurrentPage === mytotalPages}
                    >
                      Επόμενο
                    </button>
                  </div>
                ) : (
                  <div>Δεν υπάρχουν αγγελίες με αυτά τα κριτήρια </div>
                )}
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
                {currentJobs.length > 0 ? (
                  <div className="pagination">
                    <button
                      onClick={() => handleClick(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Προηγούμενο
                    </button>
                    <span>Σελίδα {currentPage} από {totalPages}</span>
                    <button
                      onClick={() => handleClick(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Επόμενο
                    </button>
                  </div>
                ) : (
                  <div>Δεν υπάρχουν αγγελίες με αυτά τα κριτήρια</div>
                )}
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
