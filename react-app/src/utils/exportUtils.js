const sanitizeTagName = (name) => {
    // Check if the name starts with a digit
    if (/^\d/.test(name)) {
        // Prepend an underscore if the name starts with a digit
        return `_${name}`;
    }
    // Replace any invalid characters with underscores
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
};

const escapeXML = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const convertToXML1 = (objArray, rootElement) => {
    let xml = `<${rootElement}>`;
    objArray.forEach(obj => {
        xml += `<user>`;
        for (const [key, value] of Object.entries(obj)) {
            let sanitizedKey = sanitizeTagName(key);
            xml += `<${sanitizedKey}>${escapeXML(value)}</${sanitizedKey}>`;
        }
        xml += `</user>`;
    });
    xml += `</${rootElement}>`;
    return xml;
};

const convertToXML2 = (data, rootElement) => {
    let xmlString = `<${rootElement}>`;

    const toXML = (obj, sectionTitle) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let sanitizedKey = sanitizeTagName(key);

                if (Array.isArray(obj[key])) {
                    if (sectionTitle) {
                        xmlString += `<${sectionTitle}>`;
                    }
                    obj[key].forEach((item, index) => {
                        xmlString += `<${sanitizedKey}>`;
                        toXML(item);
                        xmlString += `</${sanitizedKey}>`;
                    });
                    if (sectionTitle) {
                        xmlString += `</${sectionTitle}>`;
                    }
                } else if (typeof obj[key] === 'object') {
                    xmlString += `<${sanitizedKey}>`;
                    toXML(obj[key]);
                    xmlString += `</${sanitizedKey}>`;
                } else {
                    xmlString += `<${sanitizedKey}>${escapeXML(obj[key].toString())}</${sanitizedKey}>`;
                }
            }
        }
    };
    // Adding titles for each section with valid XML tags
    xmlString += `<UserProfile>`;
    toXML(data.userProfile);
    xmlString += `</UserProfile>`;

    xmlString += `<WorkExperience>`;
    toXML(data.workExperience, 'Experience');
    xmlString += `</WorkExperience>`;

    xmlString += `<Studies>`;
    toXML(data.studies, 'Study');
    xmlString += `</Studies>`;

    xmlString += `<Skills>`;
    toXML(data.skills, 'Skill');
    xmlString += `</Skills>`;

    xmlString += `<JobAds>`;
    toXML(data.jobAds, 'Ad');
    xmlString += `</JobAds>`;

    xmlString += `<Articles>`;
    toXML(data.articles, 'Article');
    xmlString += `</Articles>`;

    xmlString += `<Comments>`;
    toXML(data.comments, 'Comment');
    xmlString += `</Comments>`;

    xmlString += `<Likes>`;
    toXML(data.likes, 'Like');
    xmlString += `</Likes>`;

    xmlString += `</${rootElement}>`;

    return xmlString;
};

const exportData = (data, exportFormat, fileName) => {
    let blob;
    if (exportFormat === 'xml') {
        const xmlContent = convertToXML1(data, 'UserData');
        blob = new Blob([xmlContent], { type: 'application/xml' });
    } else {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
};

const exportDataProfile = (data, exportFormat, fileName) => {

    let blob;
    if (exportFormat === 'xml') {
        const xmlContent = convertToXML2(data, 'UserData');
        blob = new Blob([xmlContent], { type: 'application/xml' });
    } else {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
};


export {exportData, exportDataProfile };