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
export const getArticle = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article by userid:', error);
        throw error;
    }
};
// Get a articles using userId
export const getOtherUsersArticles = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notarticles/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching article by userid:', error);
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
export const addArticle = async (title, authorId, publishDate, content) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/articles`, { title, authorId, publishDate, content });
        return response;
    } catch (error) {
        console.error('Error creating a new article:', error);
        throw error;
    }
};

// Create a new interest
export const addInterest = async (userId, articleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/interests/add`, { userId, articleId });
        return response;
    } catch (error) {
        console.error('Error creating an interest:', error);
        throw error;
    }
};

// Create a new interest
export const removeInterest = async (userId, articleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/interests/remove`, { userId, articleId });
        return response;
    } catch (error) {
        console.error('Error deleting an interest:', error);
        throw error;
    }
};

// Get interests using userId
export const getUserInterests = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/interests/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching interests by userid:', error);
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
        console.log("api",senderEmail, receiverEmail)
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