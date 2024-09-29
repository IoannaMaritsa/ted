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
    if (typeof str !== 'string') {
        return ''; // Return empty string or handle non-string cases as needed
    }
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
            
            // Add a label for the field
            xml += `<${sanitizedKey}Label>${escapeXML(sanitizedKey)}</${sanitizedKey}Label>`;
            
            if (Array.isArray(value)) {
                xml += `<${sanitizedKey}>`;
                value.forEach(item => {
                    xml += `<item>`;
                    for (const [subKey, subValue] of Object.entries(item)) {
                        let sanitizedSubKey = sanitizeTagName(subKey);
                        xml += `<${sanitizedSubKey}>${escapeXML(subValue)}</${sanitizedSubKey}>`;
                    }
                    xml += `</item>`;
                });
                xml += `</${sanitizedKey}>`;
            } else if (typeof value === 'object' && value !== null) {
                xml += `<${sanitizedKey}>`;
                for (const [subKey, subValue] of Object.entries(value)) {
                    let sanitizedSubKey = sanitizeTagName(subKey);
                    xml += `<${sanitizedSubKey}>${escapeXML(subValue)}</${sanitizedSubKey}>`;
                }
                xml += `</${sanitizedKey}>`;
            } else {
                xml += `<${sanitizedKey}>${escapeXML(value)}</${sanitizedKey}>`;
            }
        }
        
        xml += `</user>`;
    });
    
    xml += `</${rootElement}>`;
    return xml;
};

const convertToXML2 = (obj, rootElement) => {
    let xml = `<${rootElement}>`;
    xml += `<user>`;
    
    for (const [key, value] of Object.entries(obj)) {
        let sanitizedKey = sanitizeTagName(key);
        
        // Add a label for the field
        xml += `<${sanitizedKey}Label>${escapeXML(sanitizedKey)}</${sanitizedKey}Label>`;
        
        if (Array.isArray(value)) {
            xml += `<${sanitizedKey}>`;
            value.forEach(item => {
                xml += `<item>`;
                for (const [subKey, subValue] of Object.entries(item)) {
                    let sanitizedSubKey = sanitizeTagName(subKey);
                    xml += `<${sanitizedSubKey}>${escapeXML(subValue)}</${sanitizedSubKey}>`;
                }
                xml += `</item>`;
            });
            xml += `</${sanitizedKey}>`;
        } else if (typeof value === 'object' && value !== null) {
            xml += `<${sanitizedKey}>`;
            for (const [subKey, subValue] of Object.entries(value)) {
                let sanitizedSubKey = sanitizeTagName(subKey);
                xml += `<${sanitizedSubKey}>${escapeXML(subValue)}</${sanitizedSubKey}>`;
            }
            xml += `</${sanitizedKey}>`;
        } else {
            xml += `<${sanitizedKey}>${escapeXML(value)}</${sanitizedKey}>`;
        }
    }
    
    xml += `</user>`;
    xml += `</${rootElement}>`;
    return xml;
};


const exportData = (data, exportFormat, fileName) => {
    let blob;
    if (exportFormat === 'xml') {
        const xmlContent = convertToXML1(data, 'users');
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