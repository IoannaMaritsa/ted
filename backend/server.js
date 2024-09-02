require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const usersModel = require('./routes/users'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads/profile-pics');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


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
app.post('/users', upload.single('profilePhoto'), async (req, res) => {
    try {
        const { name, email, password, location, dob } = req.body;
        const profilePic = req.file ? req.file.path : 'uploads/profile-pics/default-avatar.jpeg';

        const newUser = await usersModel.addUser(name, email, password, location, dob, profilePic);
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

        if (result.success) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


// Delete all users
app.delete('/users', async (req, res) => {
    try {
        const result = await usersModel.deleteAllUsers();
        if (result.success) {
            res.json({ message: 'All users deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete all users' });
        }
    } catch (err) {
        console.error('Error deleting all users:', err);
        res.status(500).json({ error: 'Failed to delete all users' });
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
