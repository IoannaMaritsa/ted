require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersModel = require('./models/users'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Initialize Multer for handling file uploads
const storage = multer.memoryStorage(); // Use memoryStorage if you are directly uploading to Supabase
const upload = multer({ storage });

// Enable CORS with specific configuration
app.use(cors({
    origin: ['http://localhost:5001', 'http://localhost:3000'], // Replace with your actual domains
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

        const result = await usersModel.addUser(name, email, password, location, dob, profilepic);
        if (result) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(400).json({ error: 'User creation failed' });
        }
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
        if (result) {
            res.status(204).send();  // 204 No Content when deletion is successful
        } else {
            res.status(404).json({ error: 'User not found' });
        }
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

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Incoming user data:", {
            email, password
        });
    try {
        const user = await usersModel.getUser(email);
        console.log("User found:", user)
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({
            "userId": user.id,
            "email": email,
            "role": "user",
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
