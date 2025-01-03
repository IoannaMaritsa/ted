const supabase = require('../supabaseClient');
const path = require('path');

// Helper function to upload files
const uploadfile = async (buffer, originalname) => {

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
        case '.mp4':
            contentType = 'video/mp4';
            break;
        case '.mp3':
            contentType = 'audio/mpeg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        default:
            throw new Error('Unsupported file type');
    }
    const timestampedFilename = `${Date.now()}_${originalname}`;

    const { data, error } = await supabase
        .storage
        .from('attachments') 
        .upload(timestampedFilename, buffer, {
            contentType: contentType,
        });
    if (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }

    return timestampedFilename; 
};


// Add an attachment
const addAttachment = async (articleId, type, attachedFile) => {
    try {

        let attachmentUrl = null;
        if (attachedFile) {
            // Upload profile picture and get its URL
            const attachmentPath = await uploadfile(attachedFile.buffer, attachedFile.originalname);
            attachmentUrl = `https://deenohwgdmmzsnyvpnxz.supabase.co/storage/v1/object/attachments/${attachmentPath}`;
        }

        const { data, error } = await supabase
            .from('attachments')
            .insert([{ article_id: articleId, type : type , url : attachmentUrl }]);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error adding attachment:', err);
        throw err;
    }
};

// Get attachments for an article
const getAttachments = async (articleId) => {
    try {
        const { data, error } = await supabase
            .from('attachments')
            .select('*')
            .eq('article_id', articleId);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error fetching attachments:', err);
        throw err;
    }
};

module.exports = {
    addAttachment,
    getAttachments
};