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

//Function to delete study
const deleteUserStudy = async (userId, studyId) => {
    try {
        const result = await pool.query(
            'DELETE FROM studies WHERE id = $1 AND user_id = $2 RETURNING *',
            [studyId, userId]
        );

        if (result.rowCount === 0) {
            console.log(`Study with ID ${studyId} not found for user ID ${userId}.`);
            return { success: false, message: 'Study not found' };
        }

        console.log(`Study with ID ${studyId} deleted for user ID ${userId}.`);
        return { success: true, message: 'Study deleted successfully' };
    } catch (err) {
        console.error('Error deleting study:', err);
        return { success: false, message: 'Error deleting study' };
    } finally {
        pool.release();
    }
};
// Uncomment to run examples
// addStudies(1, 'National and Kapodistrian University of Athens', 'Software Engineer', '2020', '2026');

module.exports = {
    addStudies,
    getStudiesByUserId,
    deleteUserStudy
};
