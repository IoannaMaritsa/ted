  // Function to get the profile image URL
  const getAttachmentUrl = (url) => {
    const baseURL = 'https://deenohwgdmmzsnyvpnxz.supabase.co';
    const bucketName = 'attachments';
    if (url) {
        return url.replace(
            `${baseURL}/storage/v1/object/${bucketName}/`,
            `${baseURL}/storage/v1/object/public/${bucketName}/`
        );
    } else {
        return `${baseURL}/storage/v1/object/public/profilepics/default-avatar.jpeg`;
    }
};

export default getProfileImageUrl;