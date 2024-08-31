const pool = require('../db'); // Ensure this points to your db.js file

// Function to add a new studies
const addStudies = async (userId, university, degree, startDate, endDate) => {
    try {
        const result = await pool.query(
            'INSERT INTO studies (user_id, university, degree, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, university, degree, startDate, endDate]
        );
        console.log('Submission added successfully.');
        return result.rows[0];
    } catch (err) {
        console.error('Error adding studies:', err);
        throw err;
    }
};

// Function to get studies by user ID
const getStudiesByUserId = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM studies WHERE user_id = $1', [userId]);
        return result.rows;
    } catch (err) {
        console.error('Error getting studies by user ID:', err);
        throw err;
    }
};

// Uncomment to run examples


module.exports = {
    addStudies,
    getStudiesByUserId
};

// addStudies(1, 'National and Kapodistrian University of Athens', 'Software Engineer', '2020', '2026');