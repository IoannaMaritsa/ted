  // Function to get the profile image URL
  const getProfileImageUrl = (url) => {
    const baseURL = 'https://deenohwgdmmzsnyvpnxz.supabase.co';
    const bucketName = 'profilepics';
    if (url) {
        return url.replace(
            `${baseURL}/storage/v1/object/${bucketName}/`,
            `${baseURL}/storage/v1/object/public/${bucketName}/`
        );
    } else {
        return `${baseURL}/storage/v1/object/public/${bucketName}/default-avatar.jpeg`;
    }
};

export default getProfileImageUrl;