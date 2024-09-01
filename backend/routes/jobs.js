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

// Function to update a job
const updateJob = async (jobId, updatedData) => {
    try {
        const fields = Object.keys(updatedData).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = [jobId, ...Object.values(updatedData)];

        const result = await pool.query(
            `UPDATE jobs SET ${fields} WHERE id = $1 RETURNING *`,
            values
        );

        if (result.rowCount === 0) {
            console.log(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        console.log(`Job with ID ${jobId} updated.`);
        return { success: true, job: result.rows[0] };
    } catch (err) {
        console.error('Error updating job:', err);
        return { success: false, message: 'Error updating job' };
    } finally {
        pool.release();
    }
};

// Function to delete a job
const deleteJob = async (jobId) => {
    try {
        const result = await pool.query(
            'DELETE FROM jobs WHERE id = $1 RETURNING *',
            [jobId]
        );

        if (result.rowCount === 0) {
            console.log(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        console.log(`Job with ID ${jobId} deleted.`);
        return { success: true, message: 'Job deleted' };
    } catch (err) {
        console.error('Error deleting job:', err);
        return { success: false, message: 'Error deleting job' };
    } finally {
        pool.release();
    }
};

// Function to get jobs of a specific user
const getJobOfUser = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM jobs WHERE creator_id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            console.log(`No jobs found for user with ID ${userId}.`);
            return { success: false, message: 'No jobs found' };
        }

        console.log(`Found ${result.rowCount} jobs for user with ID ${userId}.`);
        return result.rows;
    } catch (err) {
        console.error('Error getting jobs for user:', err);
        return { success: false, message: 'Error getting jobs' };
    } finally {
        pool.release();
    }
};

// Example usage
// addJob('Software Engineer', 1, 'Tech Solutions', 'San Francisco, CA', '2024-08-01', 'Full-time', 'Software Engineer', 3, 120000, 'Looking for a software engineer with experience in full-stack development.');

module.exports = {
    addJob,
    updateJob,
    deleteJob,
    getJobOfUser
};