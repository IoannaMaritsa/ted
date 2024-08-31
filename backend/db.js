const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost', // or the IP address of your PostgreSQL server
    port: 5432,        // or the port you chose during installation
    user: 'postgres',  // default user or any other user you have configured
    password: '212002', // password you set during installation
    database: 'tedDatabase'  // the database you want to connect 
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;
