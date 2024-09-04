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

// Login a user
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
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