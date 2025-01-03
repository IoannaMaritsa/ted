
// ! Uncomment this for https connection
// if (typeof globalThis === 'undefined') {
//     global.globalThis = global;
//   }


require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const https = require("https");
const usersModel = require("./models/users");
const articlesModel = require("./models/articles");
const contactsModel = require("./models/contacts");
const friend_requestsModel = require("./models/friendrequests");
const experiencesModel = require("./models/experiences");
const studiesModel = require("./models/studies");
const skillsModel = require("./models/skills");
const commentsModel = require("./models/comments");
const attachmentsModel = require("./models/attachments");
const jobsModel = require("./models/jobs");
const submissionsModel = require("./models/submissions");
const messagesModel = require("./models/messages");
const privacyModel = require("./models/privacy");
const jobViewsModel = require("./models/job_views");
const articlesViewsModel = require("./models/article_views");

const app = express();


// ! Uncomment this for https connection
// const options = {
//     key: fs.readFileSync('./certificates/localhost-key.pem'),
//     cert: fs.readFileSync('./certificates/localhost-cert.pem')
//   };

// app.use(cors({
//     origin: ['https://localhost', 'https://localhost:3000'], // Replace with your actual domains
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Initialize Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ! Comment this for https connection

app.use(
  cors({
    origin: ["http://localhost:5001", "http://localhost:3000"], // Replace with your actual domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// ---------- USER ROUTES -----------
// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a user by email
app.get("/users/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await usersModel.getUser(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a new user
app.post("/users", upload.single("profilepic"), async (req, res) => {
  try {
    const { name, email, password, location, dob } = req.body;
    const profilepic = req.file;

    console.log("Incoming user data:", {
      name,
      email,
      password,
      location,
      dob,
      profilepic,
    });

    const result = await usersModel.addUser(
      name,
      email,
      password,
      location,
      dob,
      profilepic
    );
    if (result.success === false) {
      return res.status(409).json({ error: result.message });
    }

    res.status(201).json({ message: result.message });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Delete a user by email
app.delete("/users/:email", upload.none(), async (req, res) => {
  const { email } = req.params;
  try {
    const result = await usersModel.deleteUser(email);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Update user
app.put("/users/:email", upload.single("profilepic"), async (req, res) => {
  const { email } = req.params;
  const { name, profession, workplace, location, dob, previousPic } = req.body;
  const profilepic = req.file;

  try {
    const updatedUser = await usersModel.updateUser(
      email,
      name,
      profession,
      workplace,
      location,
      dob,
      previousPic,
      profilepic
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Fetch a user's hashed password and check if it matches with the password given
app.get("/password", async (req, res) => {
  const { email, password } = req.query;
  try {
    const pass = await usersModel.getPassword(email);
    const isPasswordValid = await bcrypt.compare(password, pass.password);
    if (isPasswordValid) res.status(201).json(true);
    else res.status(201).json(false);
  } catch (err) {
    res.status(500).json({ error: "Error checking password" });
  }
});

// Update a user's password
app.put("/password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await usersModel.updatePassword(email, password);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: "Error updating password" });
  }
});

// Update a user's email
app.put("/email", async (req, res) => {
  const { email, newemail } = req.body;
  try {
    const response = await usersModel.updateEmail(email, newemail);
    const user = await usersModel.getUser(newemail);
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: newemail,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error updating email" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming user data:", {
    email,
    password,
  });

  try {
    const response = await usersModel.isAdmin(email);
    if (response != null) {
      const admin = response;
      const isPasswordValid = admin.password === password;
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: admin.id,
          email: email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      const user = await usersModel.getUser(email);
      if (!user) {
        return res.status(404).json({ error: "Email not found" });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: email,
          role: "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---------- ARTICLE ROUTES -----------
// Get all the articles by user id
app.get("/articles/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const articles = await articlesModel.getArticlesByUserEmail(userEmail);
    if (articles) {
      res.json(articles);
    }
  } catch (err) {
    console.error("Error fetching articles of a user:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Get all the articles not made by user
app.get("/notarticles/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const articles = await articlesModel.getArticlesNotByUserEmail(userEmail);
    if (articles) {
      res.json(articles);
    }
  } catch (err) {
    console.error("Error fetching articles of everyone but the user:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Get an article by its id
app.get("/article/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const articles = await articlesModel.getArticlesById(id);
    if (!articles) {
      res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(articles);
  } catch (err) {
    console.error("Error fetching articles of a user:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Delete an article
app.delete("/articles/:articleId", upload.none(), async (req, res) => {
  const { articleId } = req.params;
  try {
    const result = await articlesModel.deleteArticleById(articleId);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});
// Create a new article
app.post("/articles", async (req, res) => {
  try {
    const { title, authorEmail, publishDate, content } = req.body;

    const result = await articlesModel.addArticle(
      title,
      authorEmail,
      publishDate,
      content
    );
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(404).json({ error: "Article not created" });
    }
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// ---------- USER INTEREST ROUTES -----------
// Add an article to a user's list of interests
app.post("/interests/add", async (req, res) => {
  const { userEmail, articleId } = req.body;
  try {
    await articlesModel.addInterest(userEmail, articleId);
    res.status(200).json({ message: "Interest added successfully" });
  } catch (err) {
    console.error("Error adding interest:", err);
    res.status(500).json({ error: "Failed to add interest" });
  }
});

// Remove an article from a user's list of interests
app.post("/interests/remove", async (req, res) => {
  const { userEmail, articleId } = req.body;
  try {
    await articlesModel.removeInterest(userEmail, articleId);
    res.status(200).json({ message: "Interest removed successfully" });
  } catch (err) {
    console.error("Error removing interest:", err);
    res.status(500).json({ error: "Failed to remove interest" });
  }
});

// Get all articles that a user is interested in
app.get("/interests/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const articles = await articlesModel.getUserInterests(userEmail);

    res.json(articles);

  } catch (err) {
    console.error("Error retrieving user interests:", err);
    res.status(500).json({ error: "Failed to retrieve user interests" });
  }
});

// Get all interests for all users and articles
app.get("/interests", async (req, res) => {
  try {
    const interests = await articlesModel.getAllInterests();
    res.json(interests);
  } catch (err) {
    console.error("Error retrieving user interests:", err);
    res.status(500).json({ error: "Failed to retrieve user interests" });
  }
});

// Get all interests of a specific article
app.get("/articles/:id/interests", async (req, res) => {
  const articleId = req.params.id;

  try {
    const interests = await articlesModel.getArticleInterests(articleId);
    if (!interests) {
      return res
        .status(404)
        .json({ message: "No interests found for this article" });
    }
    res.status(200).json(interests);
  } catch (error) {
    console.error("Error retrieving user interests:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving user interests",
        error: error.message,
      });
  }
});

// ---------- CONTACT ROUTES -----------
// Get all contacts for a specific user by email
app.get("/contacts/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const contacts = await contactsModel.getAllContactsByEmail(email);
    if (!contacts) {
      return res.status(404).json({ message: "No contacts found" });
    }
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res
      .status(500)
      .json({ message: "Error fetching contacts", error: error.message });
  }
});

// Add a contact for a user by email
app.post("/contacts", async (req, res) => {
  const { userEmail, contactEmail } = req.body;
  try {
    await contactsModel.addContact(userEmail, contactEmail);
    res.status(201).json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact", error });
  }
});

// Remove a contact for a user by email
app.delete("/contacts", async (req, res) => {
  const { userEmail, contactEmail } = req.body;
  try {
    await contactsModel.removeContact(userEmail, contactEmail);
    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing contact", error });
  }
});

// ---------- FRIEND REQUEST ROUTES -----------
// Send a friend request
app.post("/send", async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;
  try {
    const result = await friend_requestsModel.sendFriendRequest(
      senderEmail,
      receiverEmail
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Get sent friend requests for a user
app.get("/sent", async (req, res) => {
  const { email } = req.query;

  try {
    const sentRequests = await friend_requestsModel.getSentFriendRequests(
      email
    );
    res.status(200).json(sentRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sent friend requests" });
  }
});

// Get received friend requests for a user
app.get("/received", async (req, res) => {
  const { email } = req.query;

  try {
    const receivedRequests =
      await friend_requestsModel.getReceivedFriendRequests(email);
    res.status(200).json(receivedRequests);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve received friend requests" });
  }
});

// Delete a friend request
app.delete("/friendrequests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await friend_requestsModel.deleteFriendRequest(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete friend request" });
  }
});

// Update friend request status
app.patch("/friendrequests/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await friend_requestsModel.updateFriendRequestStatus(
      id,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update friend request status" });
  }
});

// Get a friend request by two emails
app.get("/friend-request", async (req, res) => {
  const { email1, email2 } = req.query;

  if (!email1 || !email2) {
    return res.status(400).json({ error: "Missing email parameters" });
  }

  try {
    const request = await friend_requestsModel.getFriendRequestByEmails(
      email1,
      email2
    );
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ message: "No friend request found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ---------- EXPERIENCE ROUTES -----------
// Get all experiences for a specific user by id
app.get("/experiences/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const experiences = await experiencesModel.getExperiencesByUserId(userId);
    if (!experiences) {
      return res.status(404).json({ message: "No experiences found" });
    }
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res
      .status(500)
      .json({ message: "Error fetching experiences", error: error.message });
  }
});

// Add an experience for a user by id
app.post("/experiences", async (req, res) => {
  const { userId, profession, workplace, start_date, end_date } = req.body;
  try {
    await experiencesModel.addExperience(
      userId,
      profession,
      workplace,
      start_date,
      end_date
    );
    res.status(201).json({ message: "Experience added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding experience", error });
  }
});

// Delete an experience by id
app.delete("/experiences/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const experience = await experiencesModel.deleteUserExperience(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.status(200).json(experience);
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

// ---------- STUDIES ROUTES -----------
// Get all studies for a specific user by id
app.get("/studies/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const studies = await studiesModel.getStudiesByUserId(userId);

    res.status(200).json(studies);
  } catch (error) {
    console.error("Error fetching studies:", error);
    res
      .status(500)
      .json({ message: "Error fetching studies", error: error.message });
  }
});

// Add a study for a user by id
app.post("/studies", async (req, res) => {
  const { userId, university, degree, start_date, end_date } = req.body;
  try {
    await studiesModel.addStudies(
      userId,
      university,
      degree,
      start_date,
      end_date
    );
    res.status(201).json({ message: "Study added successfully" });
  } catch (error) {
    console.error("Error adding study:", error);
    res.status(500).json({ message: "Error adding study", error });
  }
});

// Delete a study by id
app.delete("/studies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const study = await studiesModel.deleteUserStudy(id);
    if (!study) {
      return res.status(404).json({ message: "Study not found" });
    }
    res.status(200).json(study);
  } catch (err) {
    console.error("Error deleting study:", err);
    res.status(500).json({ error: "Failed to delete study" });
  }
});

// ---------- SKILL ROUTES -----------
// Add a skill to a user
app.post("/skills", async (req, res) => {
  const { userId, skillName } = req.body;
  try {
    const skills = await skillsModel.addSkillToUser(userId, skillName);
    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "skills not found" });
    }
    res
      .status(201)
      .json({ message: `Skill '${skillName}' added to user ID ${userId}` });
  } catch (error) {
    console.error("Error adding skill:", error);
    res
      .status(500)
      .json({ message: "Error adding skill", error: error.message });
  }
});

// Delete a skill from a user
app.delete("/skills", async (req, res) => {
  const { userId, skillId } = req.body;
  try {
    const result = await skillsModel.deleteSkillFromUser(userId, skillId);
    if (!result) {
      res.status(404).json({ message: "skills not found" });
    }
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res
      .status(500)
      .json({ message: "Error deleting skill", error: error.message });
  }
});

// Get all skills for a specific user by user ID
app.get("/skills/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const skills = await skillsModel.getAllSkillsForUser(userId);
    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "No skills found for user" });
    }
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res
      .status(500)
      .json({ message: "Error fetching skills", error: error.message });
  }
});

// Get all skills for a specific job
app.get("/job_skills/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const skills = await skillsModel.getAllSkillsForJob(jobId);
    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "No skills found for job" });
    }
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res
      .status(500)
      .json({ message: "Error fetching skills", error: error.message });
  }
});

// Update job skills
app.put("/job/:jobId/skills", async (req, res) => {
  const { jobId } = req.params;
  const { skills } = req.body;

  if (!jobId || !skills || !Array.isArray(skills)) {
    return res
      .status(400)
      .json({
        message: "Invalid input. Ensure jobId and skills array are provided.",
      });
  }

  try {
    const result = await skillsModel.UpdateSkillsForJob(jobId, skills);

    if (result.success) {
      res.status(200).json({ message: "Skills updated successfully." });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error updating job skills:", error);
    res
      .status(500)
      .json({ message: "Server error while updating job skills." });
  }
});

// Get all skills
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await skillsModel.getAllSkills();
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// ---------- Comment ROUTES -----------
// Add a comment
app.post("/comments", async (req, res) => {
  const { articleId, authorEmail, text } = req.body;
  try {
    const comments = await commentsModel.addComment(
      articleId,
      authorEmail,
      text
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
});

// Get all comments for a specific article
app.get("/comments/:articleId", async (req, res) => {
  const { articleId } = req.params;
  try {
    const comments = await commentsModel.getComments(articleId);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
});

// Get all comments for a specific article
app.get("/comments", async (req, res) => {
  try {
    const comments = await commentsModel.getAllComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
});

// Get all comments by a specific user
app.get("/comments/user/:authorEmail", async (req, res) => {
  const { authorEmail } = req.params;
  try {
    const comments = await commentsModel.getCommentsOfUser(authorEmail);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by user:", error);
    res
      .status(500)
      .json({
        message: "Error fetching comments by user",
        error: error.message,
      });
  }
});

// Delete a comment
app.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    const result = await deleteComment(commentId);
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
});

// Add an attachment to an article
app.post("/attachments", upload.single("file"), async (req, res) => {
  const { articleId, type } = req.body;
  const attachedFile = req.file;

  try {
    if (!attachedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await attachmentsModel.addAttachment(
      articleId,
      type,
      attachedFile
    );

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Error adding attachment:", error);
    res
      .status(500)
      .json({ message: "Error adding attachment", error: error.message });
  }
});

// Get attachments for a specific article by article ID
app.get("/attachments/:articleId", async (req, res) => {
  const { articleId } = req.params;

  try {
    const attachments = await attachmentsModel.getAttachments(articleId);
    if (!attachments || attachments.length === 0) {
      res
        .status(404)
        .json({ message: "No attachments found for this article" });
    } else {
      res.status(200).json(attachments);
    }
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res
      .status(500)
      .json({ message: "Error fetching attachments", error: error.message });
  }
});


// ---------- Job ROUTES -----------
//Add a job
app.post("/jobs", async (req, res) => {
  const {
    title,
    company,
    location,
    publishDate,
    type,
    profession,
    experience,
    salary,
    details,
    creatorEmail,
    skills,
  } = req.body;

  try {
    const job = await jobsModel.addJob(
      title,
      company,
      location,
      publishDate,
      type,
      profession,
      experience,
      salary,
      details,
      creatorEmail,
      skills
    );
    if (!job.success) {
      return res.status(404).json({ message: "failed adding job" });
    }
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Error adding job", error: error.message });
  }
});
// Update a job
app.put("/jobs/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const updatedData = req.body;

  try {
    const result = await jobsModel.updateJob(jobId, updatedData);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: result.job });
  } catch (error) {
    console.error("Error updating job:", error);
    res
      .status(500)
      .json({ message: "Error updating job", error: error.message });
  }
});
// Delete a job
app.delete("/jobs/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await jobsModel.deleteJob(jobId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error deleting job:", error);
    res
      .status(500)
      .json({ message: "Error deleting job", error: error.message });
  }
});
//Get job ads of a specific user
app.get("/jobs/user/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const jobs = await jobsModel.getJobOfUser(userEmail);

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error getting jobs for user:", error);
    res
      .status(500)
      .json({ message: "Error getting jobs for user", error: error.message });
  }
});

//Add a submission
app.post("/submissions", async (req, res) => {
  const { jobId, userEmail, submissionDate } = req.body;

  try {
    const result = await submissionsModel.addSubmission(
      jobId,
      userEmail,
      submissionDate
    );
    if (!result.success) {
      return res.status(400).json({ message: "Failed to add submission" });
    }
    res
      .status(201)
      .json({
        message: "Submission added successfully",
        submission: result.submission,
      });
  } catch (error) {
    console.error("Error adding submission:", error);
    res
      .status(500)
      .json({ message: "Error adding submission", error: error.message });
  }
});

//Get all submissions for a job
app.get("/submissions/job/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await submissionsModel.getSubmissionsForJob(jobId);
    if (!result.success) {
      return res
        .status(404)
        .json({ message: "No submissions found for this job" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
});

// ---------- MESSAGE ROUTES -----------
// Add a new message
app.post("/messages", async (req, res) => {
  const { senderEmail, receiverEmail, message, created_at } = req.body;

  try {
    const result = await messagesModel.addMessage(
      senderEmail,
      receiverEmail,
      message,
      created_at
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Error adding a message:", err);
    res
      .status(500)
      .json({ message: "Error adding message", error: err.message });
  }
});

// Get all messages between 2 users
app.get("/messages", async (req, res) => {
  const { email1, email2 } = req.query;
  try {
    const result = await messagesModel.getMessagesBetweenUsers(email1, email2);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
});

// ---------- PRIVACY ROUTES -----------
// Get privacy settings for a user
app.get("/privacy/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const privacy = await privacyModel.getPrivacySettings(userEmail);
    if (!privacy) {
      return res.status(404).json({ message: "No settings found" });
    }
    res.status(200).json(privacy);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res
      .status(500)
      .json({ message: "Error fetching settings", error: error.message });
  }
});

// Update privacy settings for a user
app.put("/api/users/privacy", async (req, res) => {
  const { email, privacyField, newValue } = req.body;

  if (!email || !privacyField || newValue === undefined) {
    return res
      .status(400)
      .json({ error: "Missing email, privacy field, or new value" });
  }

  try {
    await privacyModel.updatePrivacy(email, privacyField, newValue);
    res
      .status(200)
      .json({
        message: `Privacy field '${privacyField}' updated successfully.`,
      });
  } catch (error) {
    console.error("Error updating privacy field:", error);
    res.status(500).json({ error: "Failed to update privacy field" });
  }
});

// ---------- JOB VIEWS ROUTES -----------
// Add a view for a job by a user
app.post("/job-views", async (req, res) => {
  const { userEmail, jobId } = req.body;

  if (!userEmail || !jobId) {
    return res
      .status(400)
      .json({ error: "User email and job ID are required" });
  }

  try {
    await jobViewsModel.addViewtoJob(userEmail, jobId);
    res.status(200).json({ message: "View added successfully" });
  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ error: "Error adding view" });
  }
});

//Get all the views for a specific user
app.get("/job-views-user/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const views = await jobViewsModel.getJobViewsByUser(userEmail);
    res.status(200).json(views);
  } catch (error) {
    console.error("Error fetching job views:", error);
    res.status(500).json({ error: "Error fetching job views" });
  }
});

// ---------- ARTICLE VIEWS ROUTES -----------
// Add a view for an article by a user
app.post("/article-views", async (req, res) => {
  const { userEmail, articleId } = req.body;

  if (!userEmail || !articleId) {
    return res
      .status(400)
      .json({ error: "User email and article ID are required" });
  }

  try {
    await articlesViewsModel.addViewtoArticle(userEmail, articleId);
    res.status(200).json({ message: "View added successfully" });
  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ error: "Error adding view" });
  }
});

// Get all the views for a specific user
app.get("/article-views", async (req, res) => {
  const { userEmail } = req.params;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const views = await articlesViewsModel.getArticleViewsByUser(userEmail);
    res.status(200).json(views);
  } catch (error) {
    console.error("Error fetching article views:", error);
    res.status(500).json({ error: "Error fetching article views" });
  }
});

// Get all the views for a specific user
app.get("/article-views/article", async (req, res) => {
  const { articleId } = req.params;

  if (!articleId) {
    return res.status(400).json({ error: "Article Id is required" });
  }

  try {
    const views = await articlesViewsModel.getArticleViewsByUser(articleId);
    res.status(200).json(views);
  } catch (error) {
    console.error("Error fetching article views:", error);
    res.status(500).json({ error: "Error fetching article views" });
  }
});

// Get all article views
app.get("/article-views/all", async (req, res) => {
  try {
    const views = await articlesViewsModel.getArticleViews();
    res.status(200).json(views);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});


// ! Uncomment this for https connection
// Create HTTPS server
// https.createServer(options, app).listen(443, () => {
//     console.log('HTTPS server running on port 443');
// });

// Start server (http)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
