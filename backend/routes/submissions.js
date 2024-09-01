const pool = require('../db');

// Function to add a submission
const addSubmission = async (jobId, userId, submissionDate) => {
    const query = `
        INSERT INTO submissions (job_id, user_id, submission_date)
        VALUES ($1, $2, $3)
        ON CONFLICT (job_id, user_id) DO NOTHING; -- Prevent multiple submissions from the same user for the same job
    `;
    const values = [jobId, userId, submissionDate];

    try {
        await pool.query(query, values);
        console.log('Submission added successfully.');
    } catch (err) {
        console.error('Error adding submission:', err);
    }
};

// Function to get all submissions for a job
const getSubmissionsForJob = async (jobId) => {
    const query = `
        SELECT s.id, u.name, s.submission_date
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.job_id = $1;
    `;
    const values = [jobId];

    try {
        const res = await pool.query(query, values);
        console.log('Submissions:', res.rows);
        return res.rows;
    } catch (err) {
        console.error('Error fetching submissions:', err);
    }
};

module.exports = {
    addSubmission,
    getSubmissionsForJob
};
// Example usage
// addSubmission(1, 2, '2024-08-10');
//getSubmissionsForJob(1);