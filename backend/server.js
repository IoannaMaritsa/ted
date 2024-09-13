require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersModel = require('./models/users'); // Adjust the path as necessary
const articlesModel = require('./models/articles');
const contactsModel = require('./models/contacts');
const friend_requestsModel = require('./models/friendrequests');
const experiencesModel = require('./models/experiences');
const studiesModel = require('./models/studies');
const skillsModel = require('./models/skills');
const commentsModel = require('./models/comments');
const attachmentsModel = require('./models/attachments');
const jobsModel = require('./models/jobs');
const submissionsModel = require('./models/submissions');
const messagesModel = require('./models/messages');

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
app.put('/users/:email', upload.single('profilepic'), async (req, res) => {
    const { email } = req.params;
    const { profession, workplace, location, dob } = req.body;
    const profilepic = req.file; // The uploaded file will be available in req.file

    try {
        const updatedUser = await usersModel.updateUser(email, profession, workplace, location, dob, profilepic);
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
app.get('/articles/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const articles = await articlesModel.getArticlesByUserEmail(userEmail);
        if (articles) {
            res.json(articles);
        }

    } catch (err) {
        console.error('Error fetching articles of a user:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
// Get a all the articles not made by user id
app.get('/notarticles/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const articles = await articlesModel.getArticlesNotByUserEmail(userEmail);
        if (articles) {
            res.json(articles);
        }
    } catch (err) {
        console.error('Error fetching articles of everyone but the user:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
// Get an articles by its id
app.get('/article/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const articles = await articlesModel.getArticlesById(id);
        if (!articles) {
            res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(articles);
    } catch (err) {
        console.error('Error fetching articles of a user:', err);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
// Delete a article
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
        const { title, authorEmail, publishDate, content } = req.body;

        console.log('Incoming user data:', {
            title, authorEmail, publishDate, content
        });

        const result = await articlesModel.addArticle(title, authorEmail, publishDate, content);
        if (result) {
            // If user creation is successful, send a 201 status
            res.status(201).json(result);
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
    const { userEmail, articleId } = req.body;
    try {
        await articlesModel.addInterest(userEmail, articleId);
        res.status(200).json({ message: 'Interest added successfully' });
    } catch (err) {
        console.error('Error adding interest:', err);
        res.status(500).json({ error: 'Failed to add interest' });
    }
});

// Remove an article from a user's list of interests
app.post('/interests/remove', async (req, res) => {
    const { userEmail, articleId } = req.body;
    try {
        await articlesModel.removeInterest(userEmail, articleId);
        res.status(200).json({ message: 'Interest removed successfully' });
    } catch (err) {
        console.error('Error removing interest:', err);
        res.status(500).json({ error: 'Failed to remove interest' });
    }
});

// Get all articles that a user is interested in
app.get('/interests/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const articles = await articlesModel.getUserInterests(userEmail);
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
// Get all interests of a specific article
app.get('/articles/:id/interests', async (req, res) => {
    const articleId = req.params.id;

    try {
        const interests = await articlesModel.getArticleInterests(articleId);
        if (!interests) {
            return res.status(404).json({ message: 'No interests found for this article' });
        }
        res.status(200).json(interests);
    } catch (error) {
        console.error('Error retrieving user interests:', error);
        res.status(500).json({ message: 'Error retrieving user interests', error: error.message });
    }
});
// ---------- CONTACT ROUTES -----------

// Get all contacts for a specific user by email
app.get('/contacts/:email', async (req, res) => {
    const { email } = req.params;
    console.log(`Fetching contacts for email: ${email}`);
    try {
        const contacts = await contactsModel.getAllContactsByEmail(email);
        if (!contacts) {
            return res.status(404).json({ message: 'No contacts found' });
        }
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});


// Add a contact for a user by email
app.post('/contacts', async (req, res) => {
    const { userEmail, contactEmail } = req.body;
    try {
        await contactsModel.addContact(userEmail, contactEmail);
        res.status(201).json({ message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact', error });
    }
});

// Remove a contact for a user by email
app.delete('/contacts', async (req, res) => {
    const { userEmail, contactEmail } = req.body;
    console.log("serverside", userEmail, contactEmail)
    try {
        await contactsModel.removeContact(userEmail, contactEmail);
        res.status(200).json({ message: 'Contact removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing contact', error });
    }
});

// ---------- FRIEND REQUEST ROUTES -----------
// Send a friend request
app.post('/send', async (req, res) => {
    const { senderEmail, receiverEmail } = req.body;
    console.log("server side")
    try {
        const result = await friend_requestsModel.sendFriendRequest(senderEmail, receiverEmail);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});

// Get sent friend requests for a user
app.get('/sent', async (req, res) => {
    const { email } = req.query;

    try {
        const sentRequests = await friend_requestsModel.getSentFriendRequests(email);
        res.status(200).json(sentRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve sent friend requests' });
    }
});

// Get received friend requests for a user
app.get('/received', async (req, res) => {
    const { email } = req.query;

    try {
        const receivedRequests = await friend_requestsModel.getReceivedFriendRequests(email);
        res.status(200).json(receivedRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve received friend requests' });
    }
});

// Delete a friend request
app.delete('/friendrequests/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await friend_requestsModel.deleteFriendRequest(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete friend request' });
    }
});

// Update friend request status
app.patch('/friendrequests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await friend_requestsModel.updateFriendRequestStatus(id, status);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update friend request status' });
    }
});

// Route to get a friend request by two emails
app.get('/friend-request', async (req, res) => {
    const { email1, email2 } = req.query;

    console.log("serverside", email1, email2)
    if (!email1 || !email2) {
        return res.status(400).json({ error: 'Missing email parameters' });
    }

    try {
        const request = await friend_requestsModel.getFriendRequestByEmails(email1, email2);
        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ message: 'No friend request found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// ---------- EXPERIENCE ROUTES -----------

// Get all experiences for a specific user by id
app.get('/experiences/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching experiences for id: ${userId}`);
    try {
        const experiences = await experiencesModel.getExperiencesByUserId(userId);
        if (!experiences) {
            return res.status(404).json({ message: 'No experiences found' });
        }
        res.status(200).json(experiences);
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ message: 'Error fetching experiences', error: error.message });
    }
});


// Add an experience for a user by id
app.post('/experiences', async (req, res) => {
    const { userId, profession, workplace, start_date, end_date } = req.body;
    try {
        await experiencesModel.addExperience(userId, profession, workplace, start_date, end_date);
        res.status(201).json({ message: 'Experience added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding experience', error });
    }
});

// Delete an experience by id
app.delete('/experiences/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const experience = await experiencesModel.deleteUserExperience(id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.status(200).json(experience);
    } catch (err) {
        console.error('Error deleting experience:', err);
        res.status(500).json({ error: 'Failed to delete experience' });
    }
});
// ---------- STUDIES ROUTES -----------

// Get all studies for a specific user by id
app.get('/studies/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching studies for id: ${userId}`);
    try {
        const studies = await studiesModel.getStudiesByUserId(userId);
        if (!studies || studies.length === 0) {
            return res.status(404).json({ message: 'No studies found' });
        }
        res.status(200).json(studies);
    } catch (error) {
        console.error('Error fetching studies:', error);
        res.status(500).json({ message: 'Error fetching studies', error: error.message });
    }
});

// Add a study for a user by id
app.post('/studies', async (req, res) => {
    const { userId, university, degree, start_date, end_date } = req.body;
    try {
        await studiesModel.addStudies(userId, university, degree, start_date, end_date);
        res.status(201).json({ message: 'Study added successfully' });
    } catch (error) {
        console.error('Error adding study:', error);
        res.status(500).json({ message: 'Error adding study', error });
    }
});

// Delete a study by id
app.delete('/studies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const study = await studiesModel.deleteUserStudy(id);
        if (!study) {
            return res.status(404).json({ message: 'Study not found' });
        }
        res.status(200).json(study);
    } catch (err) {
        console.error('Error deleting study:', err);
        res.status(500).json({ error: 'Failed to delete study' });
    }
});
// ---------- SKILL ROUTES -----------

// Route to add a skill to a user
app.post('/skills', async (req, res) => {
    const { userId, skillName } = req.body;
    try {
        const skills = await skillsModel.addSkillToUser(userId, skillName);
        if (!skills || skills.length === 0) {
            return res.status(404).json({ message: 'skills not found' });
        }
        res.status(201).json({ message: `Skill '${skillName}' added to user ID ${userId}` });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ message: 'Error adding skill', error: error.message });
    }
});

// Route to delete a skill from a user
app.delete('/skills', async (req, res) => {
    const { userId, skillId } = req.body;
    try {
        const result = await skillsModel.deleteSkillFromUser(userId, skillId);
        if (!result) {
            res.status(404).json({ message: 'skills not found' });
        }
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }
});

// Route to get all skills for a specific user by user ID
app.get('/skills/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching skills for id: ${userId}`);
    try {
        const skills = await skillsModel.getAllSkillsForUser(userId);
        if (!skills || skills.length === 0) {
            return res.status(404).json({ message: 'No skills found for user' }); // Ensure to return here
        }
        res.status(200).json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
});

// ---------- Comment ROUTES -----------
// Route to add a comment
app.post('/comments', async (req, res) => {
    const { articleId, authorEmail, text } = req.body;
    try {
        const comments = await commentsModel.addComment(articleId, authorEmail, text);

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
});

// Route to get all comments for a specific article
app.get('/comments/:articleId', async (req, res) => {
    const { articleId } = req.params;
    try {
        const comments = await commentsModel.getComments(articleId);
        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this article' });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

// Route to get all comments by a specific user
app.get('/comments/user/:authorEmail', async (req, res) => {
    const { authorEmail } = req.params;
    try {
        const comments = await commentsModel.getCommentsOfUser(authorEmail);
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this user' });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments by user:', error);
        res.status(500).json({ message: 'Error fetching comments by user', error: error.message });
    }
});

// Route to delete a comment
app.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const result = await deleteComment(commentId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
});

// Add an attachment to an article
app.post('/attachments', upload.single('file'), async (req, res) => {
    const { articleId, type } = req.body;
    const attachedFile = req.file; // The file object provided by multer

    try {
        if (!attachedFile) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Pass the buffer and the original name to the addAttachment function
        const attachment = await attachmentsModel.addAttachment(articleId, type, attachedFile);

        res.status(201).json(attachment);
    } catch (error) {
        console.error('Error adding attachment:', error);
        res.status(500).json({ message: 'Error adding attachment', error: error.message });
    }
});

// Get attachments for a specific article by article ID
app.get('/attachments/:articleId', async (req, res) => {
    const { articleId } = req.params;

    try {
        const attachments = await attachmentsModel.getAttachments(articleId);
        if (!attachments || attachments.length === 0) {
            res.status(404).json({ message: 'No attachments found for this article' });
        } else {
            res.status(200).json(attachments);
        }
    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({ message: 'Error fetching attachments', error: error.message });
    }
});
// ---------- Job ROUTES -----------
//Adding a job
app.post('/jobs', async (req, res) => {
    const { title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail } = req.body;

    try {
        const job = await jobsModel.addJob(title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail);
        if (!job.success) {
            return res.status(404).json({ message: 'failed adding job' });
        }
        res.status(201).json({ message: 'Job added successfully', job });
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).json({ message: 'Error adding job', error: error.message });
    }
});
//updating job
app.put('/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const updatedData = req.body;

    try {
        const result = await jobsModel.updateJob(jobId, updatedData);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: 'Job updated successfully', job: result.job });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
});
//deleting job
app.delete('/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const result = await jobsModel.deleteJob(jobId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
});
//get job adds of a specific user
app.get('/jobs/user/:userEmail', async (req, res) => {
    const { userEmail } = req.params;

    try {
        const jobs = await jobsModel.getJobOfUser(userEmail);

        if (!jobs) {
            return res.status(404).json({ message: 'No jobs found' });
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error getting jobs for user:', error);
        res.status(500).json({ message: 'Error getting jobs for user', error: error.message });
    }
});
// ---------- Job ROUTES -----------
//Add a submission
app.post('/submissions', async (req, res) => {
    const { jobId, userEmail, submissionDate } = req.body;

    try {
        const result = await submissionsModel.addSubmission(jobId, userEmail, submissionDate);
        if (!result.success) {
            return res.status(400).json({ message: 'Failed to add submission' });
        }
        res.status(201).json({ message: 'Submission added successfully', submission: result.submission });
    } catch (error) {
        console.error('Error adding submission:', error);
        res.status(500).json({ message: 'Error adding submission', error: error.message });
    }
});
//get all submissions for a job
app.get('/submissions/job/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const result = await submissionsModel.getSubmissionsForJob(jobId);
        if (!result.success) {
            return res.status(404).json({ message: 'No submissions found for this job' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
});

// ---------- MESSAGE ROUTES -----------
// add a new message
app.post('/messages', async (req, res) => {
    const { senderEmail, receiverEmail, message, created_at } = req.body;

    try {
        const result = await messagesModel.addMessage(senderEmail, receiverEmail, message, created_at);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error adding a message:', err);
        res.status(500).json({ message: 'Error adding message', error: err.message });
    }
});

// get all messages between 2 users
app.get('/messages', async (req, res) => {
    const { email1, email2 } = req.query;
    console.log(req.body)
    try {
        const result = await messagesModel.getMessagesBetweenUsers(email1, email2);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Error fetching messages', error: err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
