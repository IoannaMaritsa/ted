const supabase = require('../supabaseClient');

// Function to add a skill to a user
async function addSkillToUser(userId, skillName) {
    try {
        // Check if the skill already exists
        const { data: skillData, error: skillError } = await supabase
            .from('skills')
            .select('id')
            .eq('skill_name', skillName)
            .single();

        const skillId = skillData.id;
        
        // Add the skill to the user using upsert to handle conflicts
        const { error: userSkillError } = await supabase
            .from('user_skills')
            .upsert({ user_id: userId, skill_id: skillId }, { onConflict: ['user_id', 'skill_id'] });

        if (userSkillError) throw userSkillError;

        console.log(`Skill '${skillName}' added to user ID ${userId}`);
    } catch (error) {
        console.error('Error adding skill to user:', error);
        throw error; // Optional: re-throw error for further handling
    }
}

// Function to delete a skill from the user
const deleteSkillFromUser = async (userId, skillId) => {
    try {
        const { data, error } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId)
            .eq('skill_id', skillId)
            .select('*');

        if (error) {
            console.log(`Skill with ID ${skillId} not found.`);
            return { success: false, message: 'Skill not found' };
        }

        console.log(`Skill with ID ${skillId} deleted for user with ID ${userId}.`);
        return { success: true, message: 'Skill deleted' };
    } catch (error) {
        console.error('Error deleting skill:', error);
        return { success: false, message: 'Error deleting skill' };
    }
};
// Function to get all skills for a user by userId
const getAllSkillsForUser = async (userId) => {
    try {
        // Fetch skill IDs associated with the user
        const { data: user_skills, error: userSkillsError } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', userId);

        if (userSkillsError) {
            throw userSkillsError;
        }

        if (!user_skills || user_skills.length === 0) {
            return []; // No skills found for the user
        }

        // Extract skill IDs
        const skillIds = user_skills.map(skill => skill.skill_id);

        // Fetch skill names based on the skill IDs
        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('*')
            .in('id', skillIds); // Use .in to match multiple IDs

        if (skillsError) {
            throw skillsError;
        }

        return skills;

    } catch (error) {
        console.error('Error fetching skills for user:', error);
        throw error;
    }
}

// Function to get all the skills
const getAllSkills = async () => {
    try {
        const { data: skills, error: skillError } = await supabase
            .from('skills')
            .select('skill_name')

        if (skillError) throw skillError;

        console.log(`Got all the skills`);

        return skills;
    } catch (error) {
        console.error('Error getting skills', error);
        throw error; // Optional: re-throw error for further handling
    }
}

module.exports = {
    addSkillToUser,
    deleteSkillFromUser,
    getAllSkillsForUser,
    getAllSkills
};