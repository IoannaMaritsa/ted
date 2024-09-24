const jose = require('node-jose');
const fs = require('fs');

async function generateKey() {
    // Create a keystore
    const keystore = jose.JWK.createKeyStore();

    // Generate a symmetric (octet) key
    const key = await keystore.generate('oct', 256); // 'oct' for symmetric keys, '256' is the key size

    // Export the key as a JSON string
    const keyJSON = key.toJSON(true); // `true` to include private key material
    fs.writeFileSync('jwtKey.json', JSON.stringify(keyJSON));

    console.log('Key generated and saved to jwtKey.json');
}

generateKey();