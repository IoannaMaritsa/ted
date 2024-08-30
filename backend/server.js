// server.js
require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const app = express();

const PORT = process.env.PORT; 
const URL = process.env.REACT_APP_BACKEND_URL;

// Middleware to parse JSON
app.use(express.json());

app.use(bodyParser.json());
app.use('/users', usersRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${URL}`);
});
