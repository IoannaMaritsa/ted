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
import { useAppContext } from "../context/appContext";
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { getJobsOfUser, getAllContactsByUserEmail, updateJob, addJob, deleteJob } from '../api';

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

  //user
  const user_info = useAppContext().user;

  //jobs
  const [jobs, setJobs] = useState([]);
  const [myjobs, setMyjobs] = useState([]);

  const getJobs = async (userEmail) => {
    try {
      const contacts = await getAllContactsByUserEmail(userEmail);
      for (const contact of contacts) {
        try {
          const newjobs = await getJobsOfUser(contact.contact_email);
          if (newjobs.success) {
            setJobs(newjobs.data);
          }
        } catch (error) {
          console.error(`Error getting job for user with email ${contact.contact_email}:`, error);
        }
      }
    } catch (error) {
      console.error('Error getting jobs:', error);
    }
    console.log('jobs',jobs);
  };

  const getMyJobs = async (userEmail) => {
    try {

      const newjobs = await getJobsOfUser(userEmail);
      console.log(`Got a job successfully.`);
      if (newjobs.success)
        setMyjobs(newjobs.data)

    } catch (error) {
      console.error('Error getting jobs:', error);
    }
  };

  //filters
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

  //search
  const [mysearchQuery, setMysearchQuery] = useState();
  const [searchQuery, setSearchQuery] = useState();

  const searchJobs = useMemo(() => {
    const query = (searchQuery || '').toLowerCase();
    return jobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const profession = (job.profession || '').toLowerCase();
      return title.includes(query) ||
        company.includes(query) ||
        profession.includes(query);
    });
  }, [searchQuery, jobs]);

  const searchMyjobs = useMemo(() => {
    const query = (mysearchQuery || '').toLowerCase();
    return myjobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const company = (job.company || '').toLowerCase();
      const profession = (job.profession || '').toLowerCase();
      return title.includes(query) ||
        company.includes(query) ||
        profession.includes(query);
    });
  }, [mysearchQuery, myjobs]);

  const filteredJobs = filterJobs(searchJobs);
  const myfilteredJobs = filterJobs(searchMyjobs);


  //pagination for my jobs
  const [mycurrentPage, setMyCurrentPage] = useState(1);
  const myjobsPerPage = 4;
  const mytotalPages = Math.ceil(myfilteredJobs.length / myjobsPerPage);

  const myindexOfLastJob = mycurrentPage * myjobsPerPage;
  const myindexOfFirstJob = myindexOfLastJob - myjobsPerPage;
  const mycurrentJobs = myfilteredJobs.slice(myindexOfFirstJob, myindexOfLastJob);
  const [myselectedJob, setMyselectedJob] = useState(null);

  // Handle page change
  const myhandleClick = (pageNumber) => {
    setMyCurrentPage(pageNumber);
  };

  //pagination for others' jobs
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const [selectedJob, setSelectedJob] = useState(currentJobs[0]);

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  //update job
  const handleSave = async (jobId, updatedJob) => {
    try {
      await updateJob(jobId, updatedJob);

      await getMyJobs(user_info.email);

    } catch (error) {
      console.error(`Error updating job with id ${jobId}:`, error);
    }
  };

  //options
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

  //add job
  const HandleAddJob = async (title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail) => {
    try {
      await addJob(title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail);
      console.log(`Added a job successfully.`);

      await getMyJobs(user_info.email);
    } catch (error) {
      console.error(`Error adding a job`, error);
    }
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
  }, [selectedDateFilter, selectedExperienceFilter, selectedLocation, selectedSalaryFilter, selectedTypeFilter, searchQuery, mysearchQuery, jobs]);

  const handleDeleteClick = async (jobid) => {
    try {
      await deleteJob(jobid);
      console.log('job deleted sucessfully');

      await getMyJobs(user_info.email);
    } catch (error) {
      console.error(`Error adding a job`, error);
    }
    setMyselectedJob(null);
  };

  useEffect(() => {
    getJobs(user_info.email);
    getMyJobs(user_info.email);
  }, []);

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
                    <img src="/remove.png" alt="Image Icon" className='job-delete-icon' onClick={() => handleDeleteClick(job.id)} />
                    <div className="job-display-date"> {format(job.publish_date, 'yyyy-MM-dd')} </div>
                    <div className="job-display-title">{job.title}</div>
                    <div className="job-display-company">{job.company}</div>
                    <div className="job-display-company">{job.profession}</div>
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
                <Job_create c_email={user_info.email} onSave={HandleAddJob} />
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
                        <img src="/remove.png" alt="Image Icon" className='job-delete-icon' onClick={() => handleDeleteClick(job.id)} />
                        <div className="job-display-date"> {format(job.publish_date, 'yyyy-MM-dd')} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.profession}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div className="job-display" onClick={() => HandleMyJobSelect(job)}>
                        <img src="/remove.png" alt="Image Icon" className='job-delete-icon' onClick={() => handleDeleteClick(job.id)} />
                        <div className="job-display-date"> {format(job.publish_date, 'yyyy-MM-dd')} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.profession}</div>
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
                  init_profession={myselectedJob.profession}
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
                      <div className="job-display-selected" onClick={() => HandleJobSelect(job)}>
                        <div className="job-display-date"> {format(job.publish_date, 'yyyy-MM-dd')} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.profession}</div>
                        <div className="job-display-company">{job.type} Απασχόληση</div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div className="job-display" onClick={() => HandleJobSelect(job)}>
                        <div className="job-display-date"> {format(job.publish_date, 'yyyy-MM-dd')} </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">{job.profession}</div>
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
              {currentJobs.length > 0 && (
                <Job
                  id={selectedJob.id}
                  title={selectedJob.title}
                  company={selectedJob.company}
                  location={selectedJob.location}
                  publish_date={selectedJob.publish_date}
                  type={selectedJob.type}
                  profession={selectedJob.profession}
                  experience={selectedJob.experience}
                  salary={selectedJob.salary}
                  detail={selectedJob.details}
                />)}
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
