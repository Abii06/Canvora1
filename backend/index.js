const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
if (!process.env.MONGO_URI) {
    console.error('====================================================================');
    console.error('⚠️  CRITICAL ERROR: MONGO_URI is not defined in backend/.env!');
    console.error('Please configure your database connection string in your .env file.');
    console.error('Example: MONGO_URI=mongodb://127.0.0.1:27017/canvora');
    console.error('====================================================================');
} else {
    mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Fail fast if MongoDB is not running
    })
        .then(() => console.log('✅ MongoDB Connected successfully!'))
        .catch(err => {
            console.error('====================================================================');
            console.error('❌ MongoDB Connection Failed!');
            console.error('Error details:', err.message);
            console.error('\nPlease verify that:');
            console.error('1. Your MongoDB server is running (locally or on Atlas).');
            console.error('2. The connection string in backend/.env is correct.');
            console.error('====================================================================');
        });
}

// Database Connection Status Check Middleware
app.use((req, res, next) => {
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
        return res.status(503).json({
            message: 'Database connection is not established. Please check backend/.env and ensure your MongoDB database is running.'
        });
    }
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const requestRoutes = require('./routes/requests');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
    res.send('Canvora API is running');
});

// Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the app for Vercel Serverless
module.exports = app;
