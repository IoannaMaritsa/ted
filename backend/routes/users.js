const express = require('express');
const router = express.Router();

// Mock Data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', dob: '11-01-2000', profession: 'Chef' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', dob: '05-12-1995', profession: 'Tiktoker' },
];

// Get all users
router.get('/', (req, res) => {
    res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// Create a new user
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        profession: req.body.profession,
    };
    users.push(newUser);
    res.status(200).json(newUser);
});

// Update user by ID
router.put('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');

    user.name = req.body.name;
    user.email = req.body.email;
    user.dob = req.body.dob;
    user.profession = req.body.profession;
    res.json(user);
});

// Delete user by ID
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');

    users.splice(userIndex, 1);
    res.status(201).send();
});

module.exports = router;