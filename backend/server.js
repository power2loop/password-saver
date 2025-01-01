// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const verifyToken = require('./middleware/auth');
// const Routes = require('./routes/passwordRoutes');

const app = express();

// const mongoURL = process.env.MONGODB_URL_LOCAL // local db connect
const mongoURL = process.env.MONGODB_URL // global db connect
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json()); // to parse JSON data
app.use(cors()); // to allow cross-origin requests

// MongoDB connection
mongoose.connect(mongoURL)
    // useNewUrlParser: true,
    // useUnifiedTopology: true,

    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Routes
const passwordRoutes = require('./routes/passwordRoutes');
app.use('', passwordRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
