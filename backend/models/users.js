const bcrypt = require('bcrypt');
const supabase = require('../supabaseClient');
const path = require('path');
const { addPrivacy } = require('./privacy');

// Get all users
const getAllUsers = async () => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Error getting users:', error);
            throw error;
        }
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
        if (data.length === 0) {
            console.error(`No user found with email ${email}.`);
            return null;
        }
        return data;
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
    const timestampedFilename = `${Date.now()}_${originalname}`;

    const { data, error } = await supabase
        .storage
        .from('profilepics') 
        .upload(timestampedFilename, buffer, {
            contentType: contentType,
        });
    if (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }

    return timestampedFilename; 
};



// Add a new user
const addUser = async (name, email, password, location, dob, profilepic) => {
    try {
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return { success: false, message: 'Email already in use' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicUrl = null;

        if (profilepic) {
            // Upload profile picture and get its URL
            const profilePicPath = await uploadProfilePic(profilepic.buffer, profilepic.originalname);
            profilePicUrl = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/profilepics/${profilePicPath}`;
        } else {
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
        await addPrivacy(email);

        return true;
    } catch (err) {
        console.error('Error adding user:', err);
        throw err;
    }
};

// Delete a user and their profile picture if applicable
const deleteUser = async (email) => {
    try {
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
        const filePath = new URL(currentUser.profilepic).pathname.replace('/storage/v1/object/profilepics', '');

        // Handle profile picture deletion if it's not the default
        if (fileName !== 'default-avatar.jpeg') {
            // Delete the old profile picture from storage
            const { error: deleteFileError } = await supabase
                .storage
                .from('profilepics')
                .remove([filePath]);

            if (deleteFileError) {
                console.error('Error deleting image:', deleteFileError);
                throw deleteFileError;
            }
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
const updateUser = async (email, name, profession, workplace, location, dob, previousPic, profilepic) => {
    try {
        let profilePicUrl = null;

        if (profilepic) {
            // Upload profile picture and get its URL
            const profilePicPath = await uploadProfilePic(profilepic.buffer, profilepic.originalname);
            profilePicUrl = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/profilepics/${profilePicPath}`;
        } else {
            profilePicUrl = previousPic;
        }

        // Update the user in the database
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                name: name || null,
                profession: profession || null,
                workplace: workplace || null,
                location: location || null,
                dob: dob || null,
                profilepic: profilePicUrl, 
            })
            .eq('email', email)
            .single();
        if (updateError) {
            console.error('Error updating user:', updateError);
            throw updateError;
        }

        const fileName = previousPic.split('/').pop();
        const filePath = new URL(previousPic).pathname.replace('/storage/v1/object/profilepics/', '');

        // Handle profile picture deletion if it's not the default
        if (profilepic && fileName !== 'default-avatar.jpeg') {
            // Delete the old profile picture from Supabase Storage
            const { error: deleteFileError } = await supabase
                .storage
                .from('profilepics')
                .remove([filePath]);

            if (deleteFileError) {
                console.error('Error deleting image:', deleteFileError);
                throw deleteFileError;
            }
        }

        return updatedUser;
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
};


// Update the email for a specific user
const updateEmail = async (email, newEmail) => {
    try {


        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ email: newEmail })
            .eq('email', email)
            .single();

        if (updateError) {
            console.error('Error updating user email:', updateError);
            throw updateError;
        }

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
            .update({ password: hashedPassword })
            .eq('email', email)
            .single();
        if (updateError) {
            console.error('Error updating user password:', updateError);
            throw updateError;
        }
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

// Get users that the specified user is not connected to and exclude the user themselves
const getUnconnectedUsers = async (userId) => {
    try {
        // Fetch all users
        const { data: allUsers, error: allUsersError } = await supabase.from('users').select('*');
        if (allUsersError) {
            console.error('Error getting all users:', allUsersError);
            throw allUsersError;
        }

        // Fetch user's contacts
        const { data: contacts, error: contactsError } = await supabase
            .from('contacts')
            .select('contact_id')
            .eq('user_id', userId);
        if (contactsError) {
            console.error('Error getting contacts:', contactsError);
            throw contactsError;
        }

        // Extract contact IDs
        const contactIds = contacts.map(contact => contact.contact_id);

        // Filter out the user themselves and their contacts
        const unconnectedUsers = allUsers.filter(user =>
            user.id !== userId && !contactIds.includes(user.id)
        );

        return unconnectedUsers;
    } catch (err) {
        console.error('Error getting unconnected users:', err);
        throw err;
    }
};


// Check if the user is an admin
const isAdmin = async (email, password) => {
    try {
        const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq('email', email)
            .single();
        return data;
    } catch (err) {
        console.error('Error getting admin:', err);
        throw err;
    }
}

// Fetch the hased password of a user
const getPassword = async (email) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('password')
            .eq('email', email)
            .single()
        return data;
    } catch (err) {
        console.error('Error checking password:', err);
        throw err;
    }
}


module.exports = {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    updateEmail,
    updatePassword,
    deleteUser,
    getUnconnectedUsers,
    isAdmin,
    getPassword,
};