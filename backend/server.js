// FILE: backend/server.js
// ** THIS IS THE MODIFIED FILE **
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const User = require('./models/user.model'); // Import User model

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// --- Ensure the documented demo admin exists ---
const ensureDemoAdmin = async () => {
    try {
        const demoUserExists = await User.findOne({ username: 'demo' });
        if (!demoUserExists) {
            console.log('No demo admin found. Creating demo admin...');
            const demoAdmin = new User({
                username: 'demo',
                password: 'demo12345'
            });
            await demoAdmin.save();
            console.log('Demo admin user created successfully.');
            console.log('Username: demo');
            console.log('Password: demo12345');
        } else {
            console.log('Demo admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating demo admin user:', error);
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected to Shahjalal Library Corner DB.");
        ensureDemoAdmin();
    })
    .catch(err => console.error("MongoDB connection error:", err));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Shahjalal Library Corner API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server is live on port ${PORT}`));
