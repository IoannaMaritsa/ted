const bcrypt = require('bcrypt');
const supabase = require('../supabaseClient');
const path = require('path');

// Get all users
const getAllUsers = async () => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Error getting users:', error);
            throw error;
        }
        console.log('Successfully retrieved all users.');
        return data;
    } catch (err) {
        console.error('Error getting users:', err);
        throw err;
    }
};

// Get a user by email
const getUser = async (email) => {
    try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
        if (data.rows.length === 0) {
            console.log(`No user found with email ${email}.`);
            return null;
        }
        console.log(`Successfully retrieved user with email ${email}.`);
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user by email:', err);
        throw err;
    }
};

// Helper function to upload the profile picture
const uploadProfilePic = async (buffer, originalname) => {

    const fileExtension = path.extname(originalname).toLowerCase();
    let contentType;

    switch (fileExtension) {
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        default:
            throw new Error('Unsupported file type');
    }
    const { data, error } = await supabase
        .storage
        .from('profilepics') // Adjust the bucket name as necessary
        .upload(`${originalname}`, buffer, {
            contentType: contentType,
        });
    if (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
    return data.Key; // Return the file path or key for the uploaded file
};

// Add a new user
const addUser = async (name, email, password, location, dob, profilepic) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicUrl = null;

        if (profilepic) {
            // Upload profile picture and get its URL
            const profilePicPath = await uploadProfilePic(profilepic.buffer, profilepic.originalname);
            profilePicUrl = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/profilepics/${profilePicPath}`;
        }   else {
            profilePicUrl = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/profilepics/default-avatar.jpeg`;
        }

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    name: name,
                    email: email,
                    password: hashedPassword,
                    location: location,
                    dob: dob,
                    profilepic: profilePicUrl,
                }
            ])
            .single();
        if (error) {
            console.error('Error adding user:', error);
            throw error;
        }
        console.log('User added:', data);
        return data;
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};

// Function to delete a user and their profile picture if applicable
const deleteUser = async (email) => {
    try {
        // First fetch the user's profile pic
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('profilepic')
            .eq('email', email)
            .single();
        if (fetchError) {
            console.error('Error fetching image:', fetchError);
            throw fetchError;
        }

        const fileName = currentUser.profilepic.split('/').pop();
        const filePath = new URL(currentUser.profilepic).pathname.replace('/storage/v1/object/', '');

        // Handle profile picture deletion if it's not the default
        if (fileName !== 'default-avatar.jpeg') {
            // Delete the old profile picture from Supabase Storage
            const { error: deleteFileError } = await supabase
                .storage
                .from('profilepics') 
                .remove([filePath]);

                if (deleteFileError) {
                    console.error('Error deleting image:', deleteFileError);
                    throw deleteFileError;
                }
            console.log(`Profile picture deleted for user with email ${email}`);
        }
        // Delete the profile pic from the storage
        const { error: deleteImageError } = await supabase
            .storage
            .from('profilepics')
            .remove([filePath]);
        if (deleteImageError) {
            console.error('Error deleting image from storage:', deleteImageError);
        } else {
            console.log('Image deleted successfully');
        }

        // Delete the user
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('email', email);
        if (error) {
            console.error('Error deleting user:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user' };
    }
};

// Update a user by email
const updateUser = async (email, updates) => {
    try {
        // Fetch the current user's details to get their current profile picture path
        const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('profilepic')
            .eq('email', email)
            .single();
        if (fetchError) {
            console.error('Error fetching image:', fetchError);
            throw fetchError;
        }

        // Check if a new profile picture is provided and handle the full path
        if (updates.profilepic) {
            // Assuming profilepic in updates is a relative path or filename
            const newProfilePic = updates.profilepic;
            updates.profilepic = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/profilepics/${newProfilePic}`;
        }

        // Proceed to update the user in the database
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updates)
            .eq('email', email)
            .single();
        if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
        }
        console.log(`User with email ${email} updated successfully.`);

        // Extract the file name from the current profilepic URL
        const oldFileName = currentUser.profilepic.split('/').pop();
        const filePath = new URL(currentUser.profilepic).pathname.replace('/storage/v1/object/', '');

        // Handle old profile picture deletion if a new profile picture is provided
        if (updates.profilepic && updates.profilepic !== oldFileName && oldFileName !== 'default-avatar.jpeg') {
            // Delete the old profile picture from Supabase Storage
            const { error: deleteFileError } = await supabase
                .storage
                .from('profilepics') 
                .remove([filePath]);

                if (deleteFileError) {
                    console.error('Error deleting image:', deleteFileError);
                    throw deleteFileError;
                }
            console.log(`Old profile picture deleted for user with email ${email}`);
        }

        return updatedUser;
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};


// Update the email for a specific user
const updateEmail = async (oldEmail, newEmail) => {
    try {
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({email : newEmail})
            .eq('email', email)
            .single();
        if (updateError) {
            console.error('Error updating user email:', updateError);
            throw updateError;
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

        const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({password : newPassword})
        .eq('email', email)
        .single();
    if (updateError) {
        console.error('Error updating user password:', updateError);
        throw updateError;
    }
    console.log(`Password updated successfully for user  ${newEmail}.`);
} catch (error) {
    console.error('Error updating password:', error);
    throw error;
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
};