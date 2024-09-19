import { useState, useEffect } from "react";
import  MatrixFactorization  from "./MFCF"
import { getAllContactsByUserEmail, getAllSkillsForUser, getAllSkillsForJob, getJobsOfUser } from "../api";

const FindJobRecommendations = ({ user, jobs }) => {
    const [contacts, setContacts] = useState([]);
    const [userskills, setUserskills] = useState([]);
    const [jobRecommendations, setJobRecommendations] = useState([]);

    useEffect(() => {
        const fetchContactsAndSkills = async () => {
            const network = await getAllContactsByUserEmail(user.email);
            setContacts(network);

            const skills = await getAllSkillsForUser(user.id);
            setUserskills(skills);
        };

        fetchContactsAndSkills();
    }, [user]);

    useEffect(() => {
        const calculateRecommendations = async () => {
            const jobsSet = new Set();
            let contactJobs = await Promise.all(contacts.map(async contact => {
                try {
                    const newjobs = await getJobsOfUser(contact.email);
                    if (newjobs.success) {
                        const uniqueJobs = newjobs.data.filter(job => job && job.id && !jobsSet.has(job.id));
                        uniqueJobs.forEach(job => jobsSet.add(job.id));
                        return uniqueJobs;
                    }
                } catch (error) {
                    console.error(`Error getting job for user with email ${contact.email}:`, error);
                    return [];
                }
            }));
            contactJobs = contactJobs.flat();

            const networkJobRecommendations = jobs
                .filter(job => contactJobs.some(contactJob => contactJob.id === job.id))
                .map(job => ({ job, priority: 1 }));

            const skillBasedRecommendations = await Promise.all(jobs.map(async (job) => {
                const jobSkills = await getAllSkillsForJob(job.id);
                const matchingSkills = jobSkills.filter(skill => userskills.includes(skill)).length;
                const skillMatchScore = matchingSkills / jobSkills.length;
                return { job, skillMatchScore };
            }));

            const mfRecommendations = await MatrixFactorization(user, jobs);

            const combinedRecommendations = [
                ...networkJobRecommendations,
                ...skillBasedRecommendations,
                ...mfRecommendations
            ];

            combinedRecommendations.sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.skillMatchScore - a.skillMatchScore);

            setJobRecommendations(combinedRecommendations.map(rec => rec.job));
        };

        calculateRecommendations();
    }, [contacts, jobs, userskills]);

    return (jobRecommendations);
};

export default FindJobRecommendations;