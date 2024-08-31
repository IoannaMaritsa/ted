const pool = require('../db');

const addSkillsToUser = async (userId, skills) => {
    for (const skill of skills) {
        // Check if the skill exists
        let skillResult = await pool.query('SELECT id FROM skills WHERE skill_name = $1', [skill]);
        
        let skillId;
        if (skillResult.rows.length === 0) {
            // Insert the skill if it doesn't exist
            skillResult = await pool.query('INSERT INTO skills (skill_name) VALUES ($1) RETURNING id', [skill]);
            skillId = skillResult.rows[0].id;
        } else {
            skillId = skillResult.rows[0].id;
        }

        // Associate the user with the skill
        await pool.query('INSERT INTO user_skills (user_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, skillId]);
    }
};

// Example usage
// addSkillsToUser(1, ['Customer Satisfaction', 'Python Knowledge']);