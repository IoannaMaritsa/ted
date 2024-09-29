import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MainBottom from "../components/MainBottom";
import Breadcrumbs from "../components/Breadcrumbs";
import Dropdown from "../components/dropdown";
import Job_create from "../components/job_create";
import Job from "../components/job_display";
import MyJob from "../components/my_job_display";
import "../css/Epag_job_ad.css";
import { useAppContext } from "../context/appContext";
import { default_locations } from "../context/locations";
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { getJobsOfUser, updateJob, addJob, deleteJob, getAllUsers, updateJobSkills } from '../api';
import FindJobRecommendations from '../context/job_recommendations';

export default function Epag_job_ad() {
  const locations = ["Περιοχές Όλες", ...default_locations];

  //user
  const user_info = useAppContext().user;

  //jobs
  const [jobs, setJobs] = useState([]);
  const [myjobs, setMyjobs] = useState([]);
  const [isMyLoading, setIsMyLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
  const [totalPages, setTotalPages] = useState("");
  const [currentJobs, setCurrentJobs] = useState([]); // Jobs to display currently
  const [selectedJob, setSelectedJob] = useState(null); // Job selected by user

  const [mycurrentPage, setMyCurrentPage] = useState(1);
  const myjobsPerPage = 4;
  const [mytotalPages, setMytotalPages] = useState("");
  const [mycurrentJobs, setMycurrentJobs] = useState([]); // Jobs to display currently
  const [myselectedJob, setMyselectedJob] = useState(null); // Job selected by user

  const [mysearchQuery, setMysearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getJobs = async () => {
    try {
      const users = await getAllUsers();
      const jobsSet = new Set(); // To store unique job IDs

      let fetchedJobs = await Promise.all(users
        .filter(user => user.email !== user_info.email) // Filter out the current user's email
        .map(async (user) => {
          try {
            const newjobs = await getJobsOfUser(user.email);
            if (newjobs.success) {
              // Only add jobs that aren't already in the Set
              const uniqueJobs = newjobs.data.filter(job =>
                job !== null && job.id && !jobsSet.has(job.id)
              );

              // Add job IDs to the Set after filtering nulls
              uniqueJobs.forEach(job => jobsSet.add(job.id));
              return uniqueJobs; // Return the unique jobs for this user
            }
            return []; // Return an empty array if newjobs is not successful
          } catch (error) {
            console.error(`Error getting job for user with email ${user.email}:`, error);
            return []; // Return an empty array on error
          }
        }));

      fetchedJobs = fetchedJobs.flat().filter(job => job !== undefined && Object.keys(job).length > 0);

      const recommendedjobs = await FindJobRecommendations(user_info, fetchedJobs);
      // Update state with filtered jobs
      setJobs(recommendedjobs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting jobs:", error);
      setIsLoading(false);
    }
  };

  const getMyJobs = async (userEmail) => {
    try {
      const newjobs = await getJobsOfUser(userEmail);
      console.log(`Got a job successfully.`);
      if (newjobs.success) setMyjobs(newjobs.data);
      setIsMyLoading(false);
    } catch (error) {
      console.error("Error getting jobs:", error);
      setIsMyLoading(false);
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

  const filterJobs = async (jobArray) => {
    const filteredJobs = await Promise.all(
      jobArray.map(async (job) => {
        let isMatch = true;

        // Filter by Date
        if (selectedDateFilter !== "Δημοσίευση Όλες") {
          const jobDate = new Date(job.publish_date);
          const now = new Date();
          if (selectedDateFilter === "Τον τελευταίο χρόνο") {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            if (jobDate < lastYear) isMatch = false;
          } else if (selectedDateFilter === "Τον τελευταίο μήνα") {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            if (jobDate < lastMonth) isMatch = false;
          }
        }

        // Filter by Type
        if (
          selectedTypeFilter !== "Απασχόληση Όλες" &&
          job.type !== selectedTypeFilter
        ) {
          isMatch = false;
        }

        // Filter by Experience
        if (selectedExperienceFilter !== "Εμπειρία Όλες") {
          if (selectedExperienceFilter === "0-2 Έτη" && job.experience > 2)
            isMatch = false;
          else if (selectedExperienceFilter === "2+ Έτη" && job.experience < 2)
            isMatch = false;
          else if (selectedExperienceFilter === "8+ Έτη" && job.experience < 8)
            isMatch = false;
        }

        // Filter by Salary
        if (selectedSalaryFilter !== "Μισθός Όλες") {
          const salaryFilterValue = parseInt(
            selectedSalaryFilter.replace(/[^\d]/g, "")
          );
          if (job.salary < salaryFilterValue) isMatch = false;
        }

        if (selectedLocation !== "Περιοχές Όλες") {
          if (job.location !== selectedLocation) isMatch = false;
        }

        return isMatch ? job : null; // Return job if it matches, otherwise return null
      })
    );

    return filteredJobs.filter((job) => job !== null); // Remove null values
  };

  const searchJobs = useMemo(() => {
    const query = (searchQuery || "").toLowerCase();
    return jobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const profession = (job.profession || "").toLowerCase();
      return (
        title.includes(query) ||
        company.includes(query) ||
        profession.includes(query)
      );
    });
  }, [searchQuery, jobs]);

  const searchMyjobs = useMemo(() => {
    const query = (mysearchQuery || "").toLowerCase();
    return myjobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const profession = (job.profession || "").toLowerCase();
      return (
        title.includes(query) ||
        company.includes(query) ||
        profession.includes(query)
      );
    });
  }, [mysearchQuery, myjobs]);

  // Handle page change
  const myhandleClick = (pageNumber) => {
    setMyCurrentPage(pageNumber);
  };

  // Handle page change
  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //update job
  const handleSave = async (jobId, updatedJob, skills) => {
    try {
      await updateJob(jobId, updatedJob);

      await updateJobSkills(jobId, skills);

      await getMyJobs(user_info.email);
    } catch (error) {
      console.error(`Error updating job with id ${jobId}:`, error);
    }
  };

  //options
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setMyselectedJob(null); // Clear myselectedJob when switching options
    setSelectedJob(null); // Clear selectedJob when switching options
  };

  const HandleJobSelect = (job) => {
    setSelectedJob(job); // This will trigger a re-render with the new job's details
  };

  const HandleMyJobSelect = (job) => {
    setMyselectedJob(job); // This will trigger a re-render with the new job's details
  };

  //add job
  const HandleAddJob = async (title, company, location, publishDate, type, profession, experience, salary, skills, details, creatorEmail) => {
    try {
      await addJob(title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail, skills);
      console.log(`Added a job successfully.`);

      await getMyJobs(user_info.email);
    } catch (error) {
      console.error(`Error adding a job`, error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setMyCurrentPage(1);
  }, [searchQuery, mysearchQuery, selectedDateFilter, selectedExperienceFilter, selectedLocation, selectedTypeFilter, selectedSalaryFilter]);


  const handleDeleteClick = async (jobid) => {
    try {
      await deleteJob(jobid);
      console.log("job deleted sucessfully");

      window.location.reload();
    } catch (error) {
      console.error(`Error adding a job`, error);
    }
    setMyselectedJob(null);
  };

  useEffect(() => {
    getJobs();
    getMyJobs(user_info.email);
  }, [user_info, selectedOption]);

  useEffect(() => {
    // Ensure that jobs and filters are applied only after data is loaded
    const fetchFilteredJobs = async () => {
      if (!isLoading && jobs.length > 0) {
        const updatedFilteredJobs = await filterJobs(searchJobs); // Filter based on the latest job data
        setTotalPages(Math.ceil(updatedFilteredJobs.length / jobsPerPage)); // Update the total pages for pagination

        const indexOfLastJob = currentPage * jobsPerPage;
        const indexOfFirstJob = indexOfLastJob - jobsPerPage;
        const jobsToDisplay = updatedFilteredJobs.slice(
          indexOfFirstJob,
          indexOfLastJob
        ); // Paginate jobs

        setCurrentJobs(jobsToDisplay); // Set the jobs to be displayed for the current page
        setSelectedJob(null); // Safely set selected job or null if no jobs available
      }
    };
    fetchFilteredJobs();
  }, [
    isLoading, jobs, searchQuery, selectedDateFilter, selectedExperienceFilter,
    selectedLocation, selectedTypeFilter, selectedSalaryFilter, currentPage
  ]);

  useEffect(() => {
    // Ensure that jobs and filters are applied only after data is loaded
    const fetchFilteredJobs = async () => {
      if (!isMyLoading && myjobs.length > 0) {
        const updatedFilteredJobs = await filterJobs(searchMyjobs); // Filter based on the latest job data
        setMytotalPages(Math.ceil(updatedFilteredJobs.length / myjobsPerPage)); // Update the total pages for pagination

        console.log('myjobs', updatedFilteredJobs);
        const indexOfLastJob = mycurrentPage * myjobsPerPage;
        const indexOfFirstJob = indexOfLastJob - myjobsPerPage;
        const jobsToDisplay = updatedFilteredJobs.slice(
          indexOfFirstJob,
          indexOfLastJob
        ); // Paginate jobs

        setMycurrentJobs(jobsToDisplay); // Set the jobs to be displayed for the current page
        setMyselectedJob(null); // Safely set selected job or null if no jobs available
      }
    };
    fetchFilteredJobs();
  }, [
    isMyLoading, myjobs, mysearchQuery, selectedDateFilter, selectedExperienceFilter,
    selectedLocation, selectedTypeFilter, selectedSalaryFilter, mycurrentPage
  ]);

  // Ensure selectedJob is updated properly when currentJobs changes
  useEffect(() => {
    if (currentJobs.length > 0) {
      setSelectedJob(null); // Guard against undefined job, select the first available job
    }
  }, [currentJobs]);

  if (isLoading && selectedOption === "Αγγελίες άλλων") {
    return <div>Loading...</div>; // Display a loading message or spinner while jobs are being fetched
  }

  if (isMyLoading && selectedOption === "Οι αγγελίες μου") {
    return <div>Loading...</div>; // Display a loading message or spinner while jobs are being fetched
  }

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
              value={
                selectedOption === "Οι αγγελίες μου"
                  ? mysearchQuery
                  : searchQuery
              }
              onChange={(e) => {
                selectedOption === "Οι αγγελίες μου"
                  ? setMysearchQuery(e.target.value)
                  : setSearchQuery(e.target.value);
              }}
            />
            <img
              src="/search.png"
              alt="Search Icon"
              className="search-icon"
            ></img>
          </div>
        </div>
        <div className="job-options">
          <Dropdown options={['Οι αγγελίες μου', 'Αγγελίες άλλων']} onOptionSelect={handleOptionSelect} />
          <Dropdown options={locations} onOptionSelect={handleLocationSelect} />

          <Dropdown
            options={[
              "Δημοσίευση Όλες",
              "Τον τελευταίο μήνα",
              "Τον τελευταίο χρόνο",
            ]}
            onOptionSelect={handleDateFilterChange}
          />
          <Dropdown
            options={["Απασχόληση Όλες", "Πλήρης", "Μερική", "Εθελοντική"]}
            onOptionSelect={handleTypeFilterChange}
          />
          <Dropdown
            options={["Εμπειρία Όλες", "0-2 Έτη", "2+ Έτη", "8+ Έτη"]}
            onOptionSelect={handleExperienceFilterChange}
          />
          <Dropdown
            options={["Μισθός Όλες", "40.000+", "80.000+", "120.000+"]}
            onOptionSelect={handleSalaryFilterChange}
          />
        </div>
        <div>
          {selectedOption === "Οι αγγελίες μου" && myselectedJob === null && (
            <div className="job-split">
              <div className="jobs-left-section">
                <div className="job-display-selected">
                  <div className="job-display-title">+ Νέα Αγγελία</div>
                </div>

                {mycurrentJobs.map((job, index) => (
                  <div
                    className="job-display"
                    onClick={() => HandleMyJobSelect(job)}
                  >
                    <img
                      src="/remove.png"
                      alt="Image Icon"
                      className="job-delete-icon"
                      onClick={() => handleDeleteClick(job.id)}
                    />
                    <div className="job-display-date">
                      {" "}
                      {format(job.publish_date, "yyyy-MM-dd")}{" "}
                    </div>
                    <div className="job-display-title">{job.title}</div>
                    <div className="job-display-company">{job.company}</div>
                    <div className="job-display-company">{job.profession}</div>
                    <div className="job-display-company">
                      {job.type} Απασχόληση
                    </div>
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
                    <span>
                      Σελίδα {mycurrentPage} από {mytotalPages}
                    </span>
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
          )}
          {selectedOption === "Οι αγγελίες μου" && myselectedJob != null && (
            <div className="job-split">
              <div className="jobs-left-section">
                <div
                  className="job-display"
                  onClick={() => HandleMyJobSelect(null)}
                >
                  <div className="job-display-title">+ Νέα Αγγελία</div>
                </div>

                {mycurrentJobs.map((job, index) => (
                  <div>
                    {job.id === myselectedJob.id ? (
                      <div
                        className="job-display-selected"
                        onClick={() => HandleMyJobSelect(job)}
                      >
                        <img
                          src="/remove.png"
                          alt="Image Icon"
                          className="job-delete-icon"
                          onClick={() => handleDeleteClick(job.id)}
                        />
                        <div className="job-display-date">
                          {" "}
                          {format(job.publish_date, "yyyy-MM-dd")}{" "}
                        </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">
                          {job.profession}
                        </div>
                        <div className="job-display-company">
                          {job.type} Απασχόληση
                        </div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div
                        className="job-display"
                        onClick={() => HandleMyJobSelect(job)}
                      >
                        <img
                          src="/remove.png"
                          alt="Image Icon"
                          className="job-delete-icon"
                          onClick={() => handleDeleteClick(job.id)}
                        />
                        <div className="job-display-date">
                          {" "}
                          {format(job.publish_date, "yyyy-MM-dd")}{" "}
                        </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">
                          {job.profession}
                        </div>
                        <div className="job-display-company">
                          {job.type} Απασχόληση
                        </div>
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
                    <span>
                      Σελίδα {mycurrentPage} από {mytotalPages}
                    </span>
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
          )}
          {selectedOption === "Αγγελίες άλλων" && (
            <div className="job-split">
              <div className="jobs-left-section">
                {currentJobs.map((job, index) => (
                  <div>
                    {(selectedJob != null && job.id === selectedJob.id) ? (
                      <div
                        className="job-display-selected"
                        onClick={() => HandleJobSelect(job)}
                      >
                        <div className="job-display-date">
                          {" "}
                          {format(job.publish_date, "yyyy-MM-dd")}{" "}
                        </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">
                          {job.profession}
                        </div>
                        <div className="job-display-company">
                          {job.type} Απασχόληση
                        </div>
                        <div className="job-display-salary">{job.salary} €</div>
                      </div>
                    ) : (
                      <div
                        className="job-display"
                        onClick={() => HandleJobSelect(job)}
                      >
                        <div className="job-display-date">
                          {" "}
                          {format(job.publish_date, "yyyy-MM-dd")}{" "}
                        </div>
                        <div className="job-display-title">{job.title}</div>
                        <div className="job-display-company">{job.company}</div>
                        <div className="job-display-company">
                          {job.profession}
                        </div>
                        <div className="job-display-company">
                          {job.type} Απασχόληση
                        </div>
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
                    <span>
                      Σελίδα {currentPage} από {totalPages}
                    </span>
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
                {selectedJob != null ? (
                  <>
                    {currentJobs.length > 0 && (
                      <Job
                        id={selectedJob.id}
                        title={selectedJob.title}
                        company={selectedJob.company}
                        location={selectedJob.location}
                        publish_date={format(
                          selectedJob.publish_date,
                          "yyyy-MM-dd"
                        )}
                        type={selectedJob.type}
                        profession={selectedJob.profession}
                        experience={selectedJob.experience}
                        salary={selectedJob.salary}
                        detail={selectedJob.details}
                      />
                    )}
                  </>
                ) : (
                  <div className="black-frame">
                    <div className='job-display-box'>
                      Επιλέξτε μία Αγγελία για να δείτε περισσότερες πληροφορίες για αυτή!
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
      <MainBottom />
      <Footer />
    </div>
  );
}
