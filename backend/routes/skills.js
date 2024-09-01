const pool = require('../db');

//Function to add a skill to a user
async function addSkillToUser(userId, skillName) {
    try {
        // Check if the skill already exists
        const skillQuery = 'SELECT id FROM skills WHERE skill_name = $1';
        const skillResult = await pool.query(skillQuery, [skillName]);

        let skillId;
        if (skillResult.rows.length > 0) {
            // Skill exists, get its ID
            skillId = skillResult.rows[0].id;
        } else {
            // Skill does not exist, insert it
            const insertSkillQuery = 'INSERT INTO skills (skill_name) VALUES ($1) RETURNING id';
            const insertSkillResult = await pool.query(insertSkillQuery, [skillName]);
            skillId = insertSkillResult.rows[0].id;
        }

        // Add the skill to the user
        const userSkillQuery = 'INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT (user_id, skill_id) DO NOTHING';
        await pool.query(userSkillQuery, [userId, skillId]);
        console.log(`Skill '${skillName}' added to user ID ${userId}`);
    } catch (error) {
        console.error('Error adding skill to user:', error);
        throw error; // Optional: re-throw error for further handling
    }
};

//Funtion to delete a skill from the user
const deleteSkillFromUser = async (userId, skillId) => {
    try {
        const result = await pool.query(
            'DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING *',
            [userId, skillId]
        );

        if (result.rowCount === 0) {
            console.log(`No skill with ID ${skillId} found for user with ID ${userId}.`);
            return { success: false, message: 'Skill not found for user' };
        }

        console.log(`Skill with ID ${skillId} deleted for user with ID ${userId}.`);
        return { success: true, message: 'Skill deleted' };
    } catch (err) {
        console.error('Error deleting skill:', err);
        return { success: false, message: 'Error deleting skill' };
    } finally {
        pool.release();
    }
};


module.exports = {
    addSkillToUser,
    deleteSkillFromUser
};

// Example usage
// addSkillToUser(1, 'Customer Satisfaction');