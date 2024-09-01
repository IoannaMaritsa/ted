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
const addUser = async (name, profilePic, profession, workplace, location, dob, email, password) => {
    try {
        const result = await pool.query(
            'INSERT INTO users (name, profilePic, profession, workplace, location, dob, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, profilePic, profession, workplace, location, dob, email, password]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};

// Update a user's info
const updateUser = async (id, updates) => {
    const { name, profilePic, profession, workplace, location, dob } = updates;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, profile_pic = $2, profession = $3, workplace = $4, location = $5, dob = $6 WHERE id = $7 RETURNING *',
            [name, profilePic, profession, workplace, location, dob, id]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};

//Updates the email for a specific user
async function updateEmail(userId, newEmail) {
    try {
      const query = 'UPDATE users SET email = $1 WHERE id = $2';
      const values = [newEmail, userId];
  
      await pool.query(query, values);
      console.log(`Email updated for user ID ${userId}`);
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
};

//Updates the password for a specific user
async function updatePassword(userId, newPassword) {
    try {
      // Hash the new password before storing
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      const query = 'UPDATE users SET password = $1 WHERE id = $2';
      const values = [hashedPassword, userId];
  
      await pool.query(query, values);
      console.log(`Password updated for user ID ${userId}`);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error; // Optional: re-throw error for further handling
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

//addUser('Charles Brown','/path/to/profile-pic.jpg','Product Management','Jumbo A.E','Λάρισα','1989-06-09','charles@example.com', '1234');

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    updateEmail,
    updatePassword,
    deleteUser
};