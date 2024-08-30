const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Database time:', res.rows[0]);
  }

  // End the pool connections
  pool.end();
});