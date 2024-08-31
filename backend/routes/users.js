const pool = require('../db');

// Get all users
const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (err) {
        console.error('Error getting users:', err);
        throw err;
    }
};

// Get a user by ID
const getUserById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user by ID:', err);
        throw err;
    }
};

// Add a new user
const addUser = async (user) => {
    const { name, profilePic, profession, workplace, location, dob, email } = user;
    try {
        const result = await pool.query(
            'INSERT INTO users (name, profilePic, profession, workplace, location, dob, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, profilePic, profession, workplace, location, dob, email]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};

// Update a user
const updateUser = async (id, updates) => {
    const { name, profilePic } = updates;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, profile_pic = $2 WHERE id = $3 RETURNING *',
            [name, profilePic, id]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};

// Delete a user
const deleteUser = async (id) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    }
};

const exampleAddUser = async () => {
    try {
        const user = {
            name: 'Charles Brown',
            profilePic: '/path/to/profile-pic.jpg',
            profession: 'Product Management', 
            workplace: 'Jumbo A.E', 
            location: 'Λάρισα', 
            dob: '1989-06-09', 
            email: 'charles@example.com'
        };
        const newUser = await addUser(user);
        console.log('New user added:', newUser);
    } catch (err) {
        console.error('Error:', err);
    }
};

// Example usage of getUserById
const exampleGetUserById = async () => {
    try {
        const userId = 1; // Replace with the ID you want to query
        const user = await getUserById(userId);
        console.log('User details:', user);
    } catch (err) {
        console.error('Error:', err);
    }
};

// Uncomment to run examples
// exampleAddUser();

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};