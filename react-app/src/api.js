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

// Get a user by ID
export const getUser= async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};



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

        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
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
