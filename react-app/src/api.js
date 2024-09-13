// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001'; // Replace with your API base URL

// Get all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Get a user by email
export const getUser = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

// Create a new user
export const addUser = async (userData) => {
    try {
        const formData = new FormData();

        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });

        const response = await axios.post(`${API_BASE_URL}/users`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            // Request made and server responded with a status code
            // that falls out of the range of 2xx
            return error.response;
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            throw new Error('Error setting up request');
        }
    }
};

// Update a user
export const updateUser = async (email, updateData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${email}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete a user
export const deleteUser = async (email) => {
    try {
        await axios.delete(`${API_BASE_URL}/users/${email}`);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Login a user
export const loginUser = async (email, password) => {
    try {
        console.log("Logging in with", email, password);
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        console.log("Login response:", response);
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            const { data } = error.response;
            throw new Error(data.error || 'An error occurred during login');
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request
            throw new Error('Error setting up login request');
        }
    }
};
// Get a article using userId
export const getArticle = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles/${userEmail}`);
        console.log('article is', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching article by userid:', error);
        throw error;
    }
};
// Get a articles using userId
export const getOtherUsersArticles = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notarticles/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article by userid:', error);
        throw error;
    }
};
// Get an article using its id
export const getArticleById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/article/${id}`);
        console.log('article is', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching article by its id:', error);
        throw error;
    }
};
//get all the articles
export const getAllArticles = async (userEmail) => {
    try {
        // Fetch all users and contacts
        const [myarticles, othersarticles] = await Promise.all([
            getArticle(userEmail),
            getOtherUsersArticles(userEmail)
        ]);
        
        return {myarticles, othersarticles};
    } catch (error) {
        console.error('Error fetching all the articles:', error);
        throw error;
    }
};
// Delete an article
export const deleteArticle = async (articleId) => {
    try {
        await axios.delete(`${API_BASE_URL}/articles/${articleId}`);
        console.log('Article deleted successfully');
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
};

// Create a new article
export const addArticle = async (title, authorEmail, publishDate, content) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/articles`, { title, authorEmail, publishDate, content });
        return response.data;
    } catch (error) {
        console.error('Error creating a new article:', error);
        throw error;
    }
};

// Create a new interest
export const addInterest = async (userEmail, articleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/interests/add`, { userEmail, articleId });
        return response;
    } catch (error) {
        console.error('Error creating an interest:', error);
        throw error;
    }
};

// Create a new interest
export const removeInterest = async (userEmail, articleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/interests/remove`, { userEmail, articleId });
        return response;
    } catch (error) {
        console.error('Error deleting an interest:', error);
        throw error;
    }
};

// Get interests using userId
export const getUserInterests = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/interests/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interests by userid:', error);
        throw error;
    }
};

// Get all users interested in a specific article
export const getArticleInterests = async (articleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles/${articleId}/interests`);
        return response.data;
    } catch (error) {
        console.error('Error retrieving user interests:', error);
        throw error;
    }
};

// Get all contacts for a specific user by email
export const getAllContactsByUserEmail = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/contacts/${userEmail}`);
        console.log('Contacts fetched successfully:', response.data); // Added logging
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            // No response received
            console.error('No response received from server:', error.request);
        } else {
            // Error setting up request
            console.error('Error setting up request:', error.message);
        }
        throw error; // Rethrow to handle higher up if necessary
    }
};


// Add a contact for a user by email
export const addContact = async (userEmail, contactEmail) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/contacts`, { userEmail, contactEmail });
        return response;
    } catch (error) {
        console.error('Error adding contact:', error);
        throw error;
    }
};

// Remove a contact for a user by email
export const removeContact = async (userEmail, contactEmail) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/contacts`, { data: { userEmail, contactEmail } });
        return response;
    } catch (error) {
        console.error('Error removing contact:', error);
        throw error;
    }
};


export const getNonConnectedUsersByEmail = async (userEmail) => {
    try {
        // Fetch all users and contacts
        const [allUsers, connectedUsers] = await Promise.all([
            getAllUsers(),
            getAllContactsByUserEmail(userEmail)
        ]);
        // Create a set of connected user emails for quick lookup
        const connectedEmails = new Set(connectedUsers.map(contact => contact.contact_email));

        // Filter out the current user and connected users from all users
        const nonConnectedUsers = allUsers.filter(user =>
            user.email !== userEmail && !connectedEmails.has(user.email)
        );
        return nonConnectedUsers;
    } catch (error) {
        console.error('Error fetching non-connected users:', error);
        throw error;
    }
};


// Send a friend request
export const sendFriendRequest = async (senderEmail, receiverEmail) => {
    try {
        console.log("api", senderEmail, receiverEmail)
        const response = await axios.post(`${API_BASE_URL}/send`, { senderEmail, receiverEmail });
        return response.data;
    } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
    }
};

// Get sent friend requests for a user
export const getSentFriendRequests = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/sent`, { params: { email } });
        return response.data;
    } catch (error) {
        console.error('Error fetching sent friend requests:', error);
        throw error;
    }
};

// Get received friend requests for a user
export const getReceivedFriendRequests = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/received`, { params: { email } });
        return response.data;
    } catch (error) {
        console.error('Error fetching received friend requests:', error);
        throw error;
    }
};

// Delete a friend request
export const deleteFriendRequest = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/friendrequests/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting friend request:', error);
        throw error;
    }
};

// Update friend request status
export const updateFriendRequestStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/friendrequests/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating friend request status:', error);
        throw error;
    }
};

// Get a friend request by two emails
export const getFriendRequestByEmails = async (email1, email2) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/friend-request`, {
            params: { email1, email2 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friend request by emails:', error);
        throw error;
    }
};

// Get all experiences for a specific user by id
export const getAllExperiencesForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/experiences/${userId}`);
        console.log('Experiences fetched successfully:', response.data); // Added logging
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            // No response received
            console.error('No response received from server:', error.request);
        } else {
            // Error setting up request
            console.error('Error setting up request:', error.message);
        }
        throw error; // Rethrow to handle higher up if necessary
    }
};


// Add an experience to a user
export const addExperience = async (userId, profession, workplace, start_date, end_date) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/experiences`, { userId, profession, workplace, start_date, end_date });
        return response;
    } catch (error) {
        console.error('Error adding experience:', error);
        throw error;
    }
};

// Remove an experience for a user
export const deleteExperience = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/experiences/${id}`);
        return response;
    } catch (error) {
        console.error('Error removing experience:', error);
        throw error;
    }
};

// Get all studies for a specific user by id
export const getAllStudiesForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/studies/${userId}`);
        console.log('Studies fetched successfully:', response.data); // Added logging
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            // No response received
            console.error('No response received from server:', error.request);
        } else {
            // Error setting up request
            console.error('Error setting up request:', error.message);
        }
        throw error; // Rethrow to handle higher up if necessary
    }
};

// Add a study for a user
export const addStudy = async (userId, university, degree, start_date, end_date) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/studies`, { userId, university, degree, start_date, end_date });
        return response;
    } catch (error) {
        console.error('Error adding study:', error);
        throw error;
    }
};

// Remove a study for a user
export const deleteStudy = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/studies/${id}`);
        return response;
    } catch (error) {
        console.error('Error removing study:', error);
        throw error;
    }
};

// Function to add a skill to a user
export const addSkillToUser = async (userId, skillName) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/skills`, { userId, skillName });
        console.log(`Skill '${skillName}' added to user ID ${userId}:`, response.data);
        return response;
    } catch (error) {
        console.error('Error adding skill:', error);
        throw error;
    }
};

// Function to delete a skill from a user
export const deleteSkillFromUser = async (userId, skillId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/skills`, { data: { userId, skillId } });
        console.log(`Skill with ID ${skillId} deleted for user ID ${userId}:`, response);
        return response;
    } catch (error) {
        console.error('Error deleting skill:', error);
        throw error;
    }
};

// Function to get all skills for a specific user by user ID
export const getAllSkillsForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/skills/${userId}`);
        console.log('Skills fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            // No response received
            console.error('No response received from server:', error.request);
        } else {
            // Error setting up request
            console.error('Error setting up request:', error.message);
        }
        throw error; // Rethrow to handle higher up if necessary
    }
};

// Function to add a comment
export const addComment = async (articleId, authorEmail, text) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/comments`, {
            articleId,
            authorEmail,
            text
        });
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error; // Rethrow the error to handle it further up if necessary
    }
};

// Function to get all comments for a specific article
export const getComments = async (articleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/comments/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error; // Rethrow the error to handle it further up if necessary
    }
};

// Function to get all comments by a specific user
export const getCommentsOfUser = async (authorEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/comments/user/${authorEmail}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments by user:', error);
        throw error; // Rethrow the error to handle it further up if necessary
    }
};

// Function to delete a comment
export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error; // Rethrow the error to handle it further up if necessary
    }
};

// Function to add an attachment to an article
export const addAttachment = async (articleId, type, attachedFile) => {
    try {
        const formData = new FormData();
        formData.append('articleId', articleId);
        formData.append('type', type);
        formData.append('file', attachedFile); // 'file' should match the key expected on the server

        const response = await axios.post(`${API_BASE_URL}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the correct content type for form data
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding attachment:', error);
        throw error;
    }
};

// Function to get attachments for a specific article by article ID
export const getAttachments = async (articleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/attachments/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attachments:', error);
        throw error;
    }
};

//Add a new job
export const addJob = async (title, company, location, publishDate, type, profession, experience, salary, details , creatorEmail) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/jobs`, {title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail});
        return response.data;
    } catch (error) {
        console.error('Error adding job:', error);
        throw error;
    }
};

//Update an existing job
export const updateJob = async (jobId, updatedData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
};

//Delete a job
export const deleteJob = async (jobId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

//Get job adds for a user
export const getJobsOfUser = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs/user/${userEmail}`);
        return response.data;
    } catch (error) {
        console.error('Error getting jobs for user:', error);
        throw error;
    }
};

//Add a submission
export const addSubmission = async (jobId, userEmail, submissionDate) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/submissions`, {
            jobId,
            userEmail,
            submissionDate
        });
        return response.data;
    } catch (error) {
        console.error('Error adding submission:', error);
        throw error;
    }
};

//get all submissions for a job
export const getSubmissionsForJob = async (jobId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/submissions/job/${jobId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching submissions for job:', error);
        throw error;
    }
};

// add a new message
export const addMessage = async (senderEmail, receiverEmail, message, created_at) => {
    try {
        console.log("hello3", senderEmail,receiverEmail,message, created_at)
        const response = await axios.post(`${API_BASE_URL}/messages`, {
           senderEmail,
           receiverEmail,
           message,
           created_at
        });
        console.log(response)
        return response.data;
    } catch(err) {
        console.error('Error adding message:', err);
        throw err;
    }
}

// fetch messages between 2 users
export const getMessagesBetweenUsers = async (email1, email2) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages`, {
            params: { email1, email2 } // Pass emails as query parameters
        });
        return response.data;
    } catch(err){
        console.error('Error fetching messages:', err);
        throw err;
    }
}

// Get privacy settings for a user
export const getPrivacySettings = async (userEmail) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/privacy/${userEmail}`);
        console.log('Settings fetched successfully:', response.data); // Added logging
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
            // No response received
            console.error('No response received from server:', error.request);
        } else {
            // Error setting up request
            console.error('Error setting up request:', error.message);
        }
        throw error; // Rethrow to handle higher up if necessary
    }
};

//update a field of privacy for a specific user
export const updatePrivacy = async (email, privacyField, newValue) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/users/privacy`, {
            email,
            privacyField,
            newValue,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating privacy:', error);
        throw error;
    }
};