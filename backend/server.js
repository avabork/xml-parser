import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import reportRoutes from './routes/report.routes.js';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Set the allowed origin from an environment variable
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendURL
}));

app.use(express.json()); // To accept JSON data

// API Routes
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('CreditSea API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));