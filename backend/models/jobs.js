const supabase = require('../supabaseClient');


// Add a new job ad
const addJob = async (title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail, skills) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .insert([{
                title,
                company,
                location,
                publish_date: publishDate,
                type,
                profession,
                experience,
                salary,
                details,
                creator_email: creatorEmail
            }])
            .select();

        if (error) {
            throw error;
        }

        const jobId = data[0].id;

        for (const skill of skills) {

            const { data: skillwithid } = await supabase
                .from('skills')
                .select('id')
                .eq('skill_name', skill)
                .single();

            const skillId = skillwithid.id;

            const { data: skilldata, error: skillerror } = await supabase
                .from('job_skills')
                .insert([{
                    job_id: jobId,
                    skill_id: skillId
                }]);

            if (skillerror) {
                console.error(`Error adding skill ${skillId} to job ${jobId}:`, skillerror);
                continue; // Skip this skill and continue with the rest
            }
        }

        return { success: true, job: data };
    } catch (err) {
        console.error('Error adding job:', err);
        return { success: false, message: 'error adding job' };
    }
};

const updateJob = async (jobId, updatedData) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update(updatedData)
            .select('id')
            .eq('id', jobId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            console.error(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        return { success: true, job: data };
    } catch (err) {
        console.error('Error updating job:', err);
        return { success: false, message: 'Error updating job' };
    }
};

// Delete a job ad
const deleteJob = async (jobId) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .delete()
            .select('id')
            .eq('id', jobId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            console.error(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        return { success: true, message: 'Job deleted' };
    } catch (err) {
        console.error('Error deleting job:', err);
        return { success: false, message: 'Error deleting job' };
    }
};


// Get job ads created by a user
const getJobOfUser = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('creator_email', userEmail)
            .order('publish_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.error(`No jobs found for user with ID ${userEmail}.`);
            return { success: false, message: 'No jobs found' };
        }

        return { success: true, data: data };
    } catch (err) {
        console.error('Error getting jobs for user:', err);
        return { success: false, message: 'Error getting jobs' };
    }
};

module.exports = {
    addJob,
    updateJob,
    deleteJob,
    getJobOfUser
};