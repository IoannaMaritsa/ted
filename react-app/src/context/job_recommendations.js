import MatrixFactorization from "./MFCF";
import { getAllContactsByUserEmail, getAllSkillsForUser, getAllSkillsForJob, getJobsOfUser } from "../api";

const FindJobRecommendations = async (user, jobs) => {
    let contacts = [];
    let userskills = [];
    let jobRecommendations = [];

    // Fetch contacts and user skills
    const fetchContactsAndSkills = async () => {
        try {
            contacts = await getAllContactsByUserEmail(user.email);
            userskills = await getAllSkillsForUser(user.id);
        } catch (error) {
            console.error("Error fetching contacts and skills:", error);
        }
    };

    await fetchContactsAndSkills();

    // Calculate recommendations
    const calculateRecommendations = async () => {
        const jobsSet = new Set();

        let contactJobs = await Promise.all(contacts.map(async (contact) => {
            try {
                const newjobs = await getJobsOfUser(contact.contact_email);
                if (newjobs.success) {
                    const uniqueJobs = newjobs.data.filter(job => job && job.id && !jobsSet.has(job.id));
                    uniqueJobs.forEach(job => jobsSet.add(job.id));
                    return uniqueJobs;
                }
            } catch (error) {
                console.error(`Error getting job for user with email ${contact.contact_email}:`, error);
                return [];
            }
        }));

        contactJobs = contactJobs.flat();

        // Network-based recommendations
        const networkJobRecommendations = jobs
            .filter(job => contactJobs.some(contactJob => contactJob.id === job.id))
            .map(job => ({ job, priority: 1 }));

        // Skill-based recommendations
        const skillBasedRecommendations = await Promise.all(jobs.map(async (job) => {
            const jobSkills = await getAllSkillsForJob(job.id);
            const matchingSkills = jobSkills.filter(skill => userskills.includes(skill));
            let skillMatchScore;
            if (jobSkills.length > 0) {
                skillMatchScore = matchingSkills.length / jobSkills.length;
            }
            else {
                skillMatchScore = 1;
            }
            return { job, skillMatchScore };
        }));

        // Matrix Factorization Recommendations
        const mfRecommendations = await MatrixFactorization(user, jobs);

        // Combine and sort recommendations
        const combinedRecommendations = [
            ...networkJobRecommendations,
            ...skillBasedRecommendations,
            ...mfRecommendations
        ];

        combinedRecommendations.sort((a, b) => 
            (b.priority || 0) - (a.priority || 0) || 
            b.predictedScore - a.predictedScore || 
            b.skillMatchScore - a.skillMatchScore
        );

        jobRecommendations = combinedRecommendations.map(rec => rec.job);
    };

    await calculateRecommendations();

    return jobRecommendations;
};

export default FindJobRecommendations;