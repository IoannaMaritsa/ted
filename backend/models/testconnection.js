const { createSecretKey} = require('crypto')

const JWT_SECRET = 'a9cX#0$zL1pO2dT4mB8&yR7uQ6*eF!jV9gW!k@3h$N5pJ2wM7x';
const keyObject =createSecretKey(Buffer.from(JWT_SECRET, 'utf-8'));
console.log(keyObject);

module.exports = keyObject;