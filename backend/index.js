// This is the entry point of our backend.
// It starts an Express server and sets up basic middleware.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());          // allows our React frontend to call this backend
app.use(express.json());  // lets us read JSON data sent in requests
app.use('/api/auth', authRoutes);

// A simple test route, just to confirm the server works
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});