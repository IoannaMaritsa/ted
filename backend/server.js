require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const usersModel = require('./models/users'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Multer for handling file uploads
const storage = multer.memoryStorage(); // Use memoryStorage if you are directly uploading to Supabase
const upload = multer({ storage });

// ---------- USER ROUTES -----------
// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await usersModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get a user by email
app.get('/users/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await usersModel.getUser(email);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user by email:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


// Handle form submissions
app.post('/users', upload.single('profilepic'), async (req, res) => {
    try {
        const { name, email, password, location, dob } = req.body;
        
        // Buffer if uploading to Supabase
        const profilepic = req.file;

        console.log('Incoming user data:', {
            name, email, password, location, dob, profilepic
        });

        const newUser = await usersModel.addUser(name, email, password, location, dob, profilepic); 
        res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Delete a user by email
app.delete('/users/:email', upload.none(), async (req, res) => {
    const { email } = req.params;
    try {
        const result = await usersModel.deleteUser(email);
        res.json({ message: 'User deleted successfully' });
        res.status(201).json({ message: 'User deleted successfully'});
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


// Update user information
app.put('/users/:email', async (req, res) => {
    const { email } = req.params;
    const updates = req.body;
    try {
        const updatedUser = await usersModel.updateUser(email, updates);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
