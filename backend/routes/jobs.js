const pool = require('../db');

// Function to add a job
const addJob = async (title, creatorId, company, location, publishDate, type, profession, experience, salary, details) => {
    const query = `
        INSERT INTO jobs (title, creator_id, company, location, publish_date, type, profession, experience, salary, details)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;
    const values = [title, creatorId, company, location, publishDate, type, profession, experience, salary, details];

    try {
        await pool.query(query, values);
        console.log('Job added successfully.');
    } catch (err) {
        console.error('Error adding job:', err);
    }
};

// Function to get jobs by location
const getJobsByLocation = async (location) => {
    const query = `
        SELECT * FROM jobs
        WHERE location = $1;
    `;
    const values = [location];

    try {
        const res = await pool.query(query, values);
        console.log('Jobs:', res.rows);
    } catch (err) {
        console.error('Error fetching jobs:', err);
    }
};

// Example usage
// addJob('Software Engineer', 1, 'Tech Solutions', 'San Francisco, CA', '2024-08-01', 'Full-time', 'Software Engineer', 3, 120000, 'Looking for a software engineer with experience in full-stack development.');
// getJobsByLocation('San Francisco, CA');