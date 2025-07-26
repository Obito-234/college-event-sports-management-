const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug: Check environment variables
console.log('Environment variables check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('Current working directory:', process.cwd());
console.log('Env file path:', path.join(__dirname, '.env'));

const connectDB = require('./config/database');

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routers
const authRouter = require("./api/auth");
const sportsRouter = require("./api/sports");
const galleryRouter = require("./api/gallery");
const eventsRouter = require("./api/events");
const matchesRouter = require("./api/matches");

// Use routers
app.use("/api/auth", authRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/events", eventsRouter);
app.use("/api/matches", matchesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
