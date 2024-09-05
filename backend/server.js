require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersModel = require('./models/users'); // Adjust the path as necessary
const articlesModel = require('./models/articles');

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
        if (result.success === false) {
            // If the user already exists, send a 409 status with the message
            return res.status(409).json({ error: result.message });
        }

        // If user creation is successful, send a 201 status
        res.status(201).json({ message: result.message });
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
// ---------- ARTICLE ROUTES -----------
// Get a all the articles by user id
app.get('/articles/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const articles = await articlesModel.getArticlesByUserId(userId);
        if (articles) {
            res.json(articles);
        }
    
    } catch (err) {
        console.error('Error fetching articles of a user:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
// Get a all the articles not made by user id
app.get('/notarticles/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const articles = await articlesModel.getArticlesNotByUserId(userId);
        if (articles){ 
            res.json(articles);
        }
    } catch (err) {
        console.error('Error fetching articles of everyone but the user:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
// Delete a user by email
app.delete('/articles/:articleId', upload.none(), async (req, res) => {
    const { articleId } = req.params;
    try {
        const result = await articlesModel.deleteArticleById(articleId);
        if (result) {
            res.status(204).send();  // 204 No Content when deletion is successful
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (err) {
        console.error('Error deleting article:', err);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});
// Handle article creation
app.post('/articles', async (req, res) => {
    try {
        const { title, authorId, publishDate, content } = req.body;

        console.log('Incoming user data:', {
            title, authorId, publishDate, content
        });

        const result = await articlesModel.addArticle(title, authorId, publishDate, content);
        if(result){
            // If user creation is successful, send a 201 status
            res.status(201).json({ message: result.message });
        }
        else {
            res.status(404).json({ error: 'Article not created' });
        }
        
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ error: 'Failed to add user' });
    }
});
// ---------- USER INTEREST ROUTES -----------

// Add an article to a user's list of interests
app.post('/interests/add', async (req, res) => {
    const { userId, articleId } = req.body;
    try {
        await addInterest(userId, articleId);
        res.status(200).json({ message: 'Interest added successfully' });
    } catch (err) {
        console.error('Error adding interest:', err);
        res.status(500).json({ error: 'Failed to add interest' });
    }
});

// Remove an article from a user's list of interests
app.post('/interests/remove', async (req, res) => {
    const { userId, articleId } = req.body;
    try {
        await removeInterest(userId, articleId);
        res.status(200).json({ message: 'Interest removed successfully' });
    } catch (err) {
        console.error('Error removing interest:', err);
        res.status(500).json({ error: 'Failed to remove interest' });
    }
});

// Get all articles that a user is interested in
app.get('/interests/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const articles = await getUserInterests(userId);
        if (articles.length > 0) {
            res.json(articles);
        } else {
            res.status(404).json({ error: 'No interests found for this user' });
        }
    } catch (err) {
        console.error('Error retrieving user interests:', err);
        res.status(500).json({ error: 'Failed to retrieve user interests' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
