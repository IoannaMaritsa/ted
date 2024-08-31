const pool = require('../db'); // Ensure this points to your db.js file

// Function to add a new experience
const addExperience = async (userId, profession, workplace, startDate, endDate) => {
    try {
        const result = await pool.query(
            'INSERT INTO experiences (user_id, profession, workplace, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, profession, workplace, startDate, endDate]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error adding experience:', err);
        throw err;
    }
};

// Function to get experiences by user ID
const getExperiencesByUserId = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM experiences WHERE user_id = $1', [userId]);
        return result.rows;
    } catch (err) {
        console.error('Error getting experiences by user ID:', err);
        throw err;
    }
};

// Uncomment to run examples


module.exports = {
    addExperience,
    getExperiencesByUserId
};

// addExperience(1, 'Software Engineer', 'Blue Ground', '2023-04-5', '2024-08-20');