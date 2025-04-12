require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Auth middleware for protected routes
app.use('/api/users/me', auth);
app.use('/api/users/favorites', auth);

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));