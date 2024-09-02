const pool = require('../db');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Get all users
const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM users');
        console.log('Successfully retrieved all users.');
        return result.rows;
    } catch (err) {
        console.error('Error getting users:', err);
        throw err;
    }
};

// Get a user by ID
const getUser = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log(`No user found with ID ${id}.`);
            return null;
        }
        console.log(`Successfully retrieved user with email ${email}.`);
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user by email:', err);
        throw err;
    }
};

// Add a new user
const addUser = async (name, email, password, location, dob, profilePic = 'uploads/profile-pics/default-avatar.jpeg' ) => {
    try {
        
        console.log("name:",name, "email:", email, "pass:", password, "location", location, "dob", dob ,"pp:", profilePic);
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, location, dob, profilePic ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, hashedPassword, location, dob, profilePic ]
        );
        console.log('User added:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};

// Function to delete a user and their profile picture if applicable
const deleteUser = async (email) => {
    try {
        // Fetch the user to get their profile picture path
        const result = await pool.query('SELECT profilePic FROM users WHERE email = $1', [email]);
        // Ensure we have a result and it's not empty
        if (!result || result.rows.length === 0) {
            return { success: false, message: 'User not found' };
        }
        const profilePicPath = result.rows[0].profilepic;
        // Check if profilePicPath is valid and not the default avatar
        if (profilePicPath && profilePicPath !== 'uploads/profile-pics/default-avatar.jpeg') {
            // Check if file exists before attempting to delete
            if (fs.existsSync(profilePicPath)) {
                fs.unlink(profilePicPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            } else {
                console.log('File does not exist:', profilePicPath);
            }
        }

        // Delete the user from the database
        await pool.query('DELETE FROM users WHERE email = $1', [email]);

        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
    }
};



// Update a user's info
// ----- untested------
const updateUser = async (email, updates) => {
    const { name, profilePic, profession, workplace, location, dob } = updates;

    try {
        // Fetch the current user's profilePic to check if it needs to be deleted
        const currentUserResult = await pool.query('SELECT profilePic FROM users WHERE email = $1', [email]);
        if (currentUserResult.rowCount === 0) {
            console.log(`No user found with email ${email} to update.`);
            return null;
        }
        const currentProfilePicPath = currentUserResult.rows[0].profilepic;
        // Proceed to update the user in the database
        const result = await pool.query(
            'UPDATE users SET name = $1, profilePic = $2, profession = $3, workplace = $4, location = $5, dob = $6 WHERE email = $7 RETURNING *',
            [name, profilePic, profession, workplace, location, dob, email]
        );

        if (result.rowCount === 0) {
            console.log(`No user found with email ${email} to update.`);
            return null;
        }
        console.log(`User with email ${email} updated successfully.`);
        // If a new profilePic is provided and it is different from the current one, delete the old profile pic
        if (profilePic && currentProfilePicPath && profilePic !== currentProfilePicPath && currentProfilePicPath !== 'default-avatar.jpeg') {
            fs.unlink(currentProfilePicPath, (err) => {
                if (err) {
                    console.error(`Error deleting old profile picture for user with email ${email}:`, err);
                } else {
                    console.log(`Old profile picture deleted for user with email ${email}`);
                }
            });
        }
        return result.rows[0];
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};

// Update the email for a specific user
const updateEmail = async (oldEmail, newEmail) => {
    try {
        const query = 'UPDATE users SET email = $1 WHERE email = $2';
        const values = [newEmail, oldEmail];

        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            console.log(`No user found with email ${oldEmail} to update email.`);
            return;
        }
        console.log(`Email updated successfully for user  ${newEmail}.`);
    } catch (error) {
        console.error('Error updating email:', error);
        throw error;
    }
};

// Update the password for a specific user
const updatePassword = async (email, newPassword) => {
    try {
        // Hash the new password before storing
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = 'UPDATE users SET password = $1 WHERE email = $2';
        const values = [hashedPassword, email];

        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            console.log(`No user found with email ${email} to update password.`);
            return;
        }
        console.log(`Password updated successfully for user ${email}.`);
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};


// Function to delete all users
const deleteAllUsers = async () => {
    try {
        // Fetch all user emails to delete them one by one
        const result = await pool.query('SELECT email FROM users');
        if (!result || result.rows.length === 0) {
            return { success: false, message: 'No users found' };
        }
        // Iterate over each user and delete them using deleteUser
        for (let user of result.rows) {
            const email = user.email;
            // Call deleteUser function for each user
            const deleteResult = await deleteUser(email);
            if (!deleteResult.success) {
                console.error(`Failed to delete user with email ${email}: ${deleteResult.message}`);
            }
        }
        return { success: true, message: 'All users deleted successfully' };
    } catch (error) {
        console.error('Error deleting all users:', error);
        return { success: false, message: 'Failed to delete all users' };
    }
};


module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    updateEmail,
    updatePassword,
    deleteUser,
    deleteAllUsers
};