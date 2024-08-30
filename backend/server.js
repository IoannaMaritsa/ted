// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;  // Use a different port than your React app

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
