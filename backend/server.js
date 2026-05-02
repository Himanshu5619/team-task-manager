// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


// MIDDLEWARE

app.use(cors());
app.use(express.json());


// API ROUTES

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));


//  SERVE FRONTEND 

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Catch-all route (for SPA behavior)
app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});




const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(' DB Connection Error:', err);
  });