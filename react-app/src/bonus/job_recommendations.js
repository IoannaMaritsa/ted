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

        contactJobs = contactJobs.flat().filter(job => job !== undefined);

        // Network-based recommendations
        let networkJobRecommendations = [];
        if (contactJobs.length > 0) {
            networkJobRecommendations = jobs
                .filter(job => contactJobs.some(contactJob => contactJob.id === job.id))
                .map(job => ({ job, priority: 1 }));
        } else {
            // If no contact jobs, assign the same default priority to all jobs
            networkJobRecommendations = jobs.map(job => ({ job, priority: 1 })); 
        }

        // Skill-based recommendations
        const skillBasedRecommendations = await Promise.all(jobs.map(async (job) => {
            const jobSkills = await getAllSkillsForJob(job.id);

            let skillMatchScore;
            if (jobSkills.length > 0) {
                const matchingSkills = jobSkills.filter(jobSkill => 
                    userskills.some(userSkill => userSkill.skill_name === jobSkill.skill_name)
                );
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

        const jobScores = [];

        jobs.forEach(job => {
            const j = combinedRecommendations.filter(rec => rec.job.id === job.id);

            let priority = 0, predictedScore = 0, skillMatchScore = 0;
            j.forEach(i => {
                priority += i.priority || 0;
                skillMatchScore += i.skillMatchScore || 0;
                predictedScore += i.predictedScore || 0;
            })

            const score = priority + skillMatchScore + predictedScore / 100;
            const recommend = { job, score };
            jobScores.push(recommend);
        })

        jobScores.sort((a, b) => b.score - a.score);

        jobRecommendations = jobScores.map(rec => rec.job);
    };

    await calculateRecommendations();

    return jobRecommendations;
};

export default FindJobRecommendations;