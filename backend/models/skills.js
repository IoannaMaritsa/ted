const supabase = require('../supabaseClient');

// Add a skill to a user
async function addSkillToUser(userId, skillName) {
    try {
        // Check if the skill already exists
        const { data: skillData, error: skillError } = await supabase
            .from('skills')
            .select('id')
            .eq('skill_name', skillName)
            .single();

        const skillId = skillData.id;
        
        // Add the skill to the user
        const { error: userSkillError } = await supabase
            .from('user_skills')
            .upsert({ user_id: userId, skill_id: skillId }, { onConflict: ['user_id', 'skill_id'] });

        if (userSkillError) throw userSkillError;

    } catch (error) {
        console.error('Error adding skill to user:', error);
        throw error; 
    }
}

// Delete a skill from the user
const deleteSkillFromUser = async (userId, skillId) => {
    try {
        const { data, error } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId)
            .eq('skill_id', skillId)
            .select('*');

        if (error) {
            console.error(`Skill with ID ${skillId} not found.`);
            return { success: false, message: 'Skill not found' };
        }

        return { success: true, message: 'Skill deleted' };
    } catch (error) {
        console.error('Error deleting skill:', error);
        return { success: false, message: 'Error deleting skill' };
    }
};

// Get all skills for a user by userId
const getAllSkillsForUser = async (userId) => {
    try {
        const { data: user_skills, error: userSkillsError } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', userId);

        if (userSkillsError) {
            throw userSkillsError;
        }

        // Extract skill IDs
        const skillIds = user_skills.map(skill => skill.skill_id);

        // Fetch skill names based on the skill IDs
        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('*')
            .in('id', skillIds); 

        if (skillsError) {
            throw skillsError;
        }

        return skills;

    } catch (error) {
        console.error('Error fetching skills for user:', error);
        throw error;
    }
}

// Get all skills for a job
const getAllSkillsForJob = async (jobId) => {
    try {
        // Fetch skill IDs associated with the job
        const { data: job_skills, error: jobSkillsError } = await supabase
            .from('job_skills')
            .select('skill_id')
            .eq('job_id', jobId);

        if (jobSkillsError) {
            throw jobSkillsError;
        }

        // Extract skill IDs
        const skillIds = job_skills.map(skill => skill.skill_id);

        // Fetch skill names based on the skill IDs
        const { data: skills, error: skillsError } = await supabase
            .from('skills')
            .select('*')
            .in('id', skillIds); 

        if (skillsError) {
            throw skillsError;
        }

        return skills;

    } catch (error) {
        console.error('Error fetching skills for job', error);
        throw error;
    }
}

// Update the skills of a job
const UpdateSkillsForJob = async (jobId, newskills) => {
    try {
        // Fetch current skill IDs associated with the job
        const { data: job_skills, error: jobSkillsError } = await supabase
            .from('job_skills')
            .select('skill_id')
            .eq('job_id', jobId);

        if (jobSkillsError) {
            throw jobSkillsError;
        }

        // Get current skill IDs in the job
        const currentSkillIds = job_skills.map(skill => skill.skill_id);

        // Store new skill IDs in a Set
        const updatedSkillIds = new Set();

        // Get the skill IDs for the new skill names
        for (const skill of newskills) {
            const { data: skillWithId, error: skillError } = await supabase
                .from('skills')
                .select('id')
                .eq('skill_name', skill)
                .single();

            if (skillError) {
                throw skillError;
            }

            updatedSkillIds.add(skillWithId.id);
        }

        // Determine which skills to remove and add
        const skillsToRemove = currentSkillIds.filter(id => !updatedSkillIds.has(id));
        const skillsToAdd = [...updatedSkillIds].filter(id => !currentSkillIds.includes(id));

        // Remove the old skills
        if (skillsToRemove.length > 0) {
            const { error: removeError } = await supabase
                .from('job_skills')
                .delete()
                .in('skill_id', skillsToRemove)
                .eq('job_id', jobId);

            if (removeError) {
                throw removeError;
            }
        }

        // Add the new skills
        if (skillsToAdd.length > 0) {
            const skillEntries = skillsToAdd.map(skillId => ({
                job_id: jobId,
                skill_id: skillId,
            }));

            const { error: addError } = await supabase
                .from('job_skills')
                .insert(skillEntries);

            if (addError) {
                throw addError;
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating skills for job:', error);
        return { success: false, message: 'Error updating skills' };
    }
};

// Get all the skills
const getAllSkills = async () => {
    try {
        const { data: skills, error: skillError } = await supabase
            .from('skills')
            .select('skill_name')

        if (skillError) throw skillError;

        return skills;
    } catch (error) {
        console.error('Error getting skills', error);
        throw error; 
    }
}

module.exports = {
    addSkillToUser,
    deleteSkillFromUser,
    getAllSkillsForUser,
    getAllSkillsForJob,
    UpdateSkillsForJob,
    getAllSkills
};