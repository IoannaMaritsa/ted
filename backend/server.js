require('dotenv').config();
const express = require('express');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// Define a schema for user data
const userSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(8).max(30).required(),
    dob: Joi.date().required(),
    profession: Joi.string().min(3).max(30).optional(),
}).options({ abortEarly: false });

// Middleware function to validate user data
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.log('Validation Error:', error.details);  // Log validation errors
        return res.status(400).json({ error: error.details });
    }
    next();
};

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Route with validation
app.post('/users', validateUser, (req, res) => {
    res.status(201).json({ message: 'User created successfully', data: req.body });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
