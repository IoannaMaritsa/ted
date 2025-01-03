const supabase = require('../supabaseClient');

// Get messages between 2 users
const getMessagesBetweenUsers = async(email1, email2) => {
    try {
        const {data, error} = await supabase 
            .from('messages')
            .select('*')
            .or(`and(sender_email.eq.${email1},receiver_email.eq.${email2}),and(sender_email.eq.${email2},receiver_email.eq.${email1})`);

        return data;
    } catch(err) {
        console.error('Error getting messages:', err);
        throw err;
    }
}

// Add a new message
const addMessage = async(senderEmail, receiverEmail, message, created_at) => {

    try {
        const { data, error } = await supabase
        .from('messages')
        .insert([{ 
            sender_email: senderEmail, 
            receiver_email: receiverEmail, 
            text: message, 
            created_at: created_at 
        }])
        .single();

    if (error) {
        console.error('Error adding a new message:', error); // Log the actual error from Supabase
        throw error; // Throw the error so the catch block can handle it
    }


        return data;
    } catch (err) {
        console.error('Error adding a new message:', err);
        throw err;
    }
}


module.exports = {
    getMessagesBetweenUsers,
    addMessage,

};