const express = require('express');
const Password = require('../models/password');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');



// POST route for login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        // Generate a JWT token after successful login
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        console.log("Login successful");
        res.status(200).json({ success: true, message: 'Login successful', token });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: 'Error during login', error });
    }
});


// POST route for user registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("Username already exists");
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log("User registered successfully");
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});


//Add a new password
const normalizeUrl = (url) => {
    return url.trim().replace(/\/+$/, '').toLowerCase() + '/';
};


router.post('/add', verifyToken, async (req, res) => {
    const { url, name, email, password } = req.body;

    if (!url || !name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);

    // Get the userId from the token (set in verifyToken middleware)
    const userId = req.user.userId;
    // console.log('User ID:', userId); // To check if userId is available

    try {
        // Check if the URL already exists for the user
        const existingPassword = await Password.findOne({ userId, url: normalizedUrl });
        if (existingPassword) {
            console.log("You have already stored this URL.")
            return res.status(409).json({ message: "You have already stored this URL." });
        }

        // Save the new password with normalized URL
        const newPassword = new Password({
            userId,
            url: normalizedUrl,
            name,
            email,
            password,
        });

        await newPassword.save();

        res.status(201).json({ message: "Password saved successfully", data: newPassword });
    } catch (error) {
        console.error("Error adding password:", error);
        res.status(500).json({ message: "Error adding password", error });
    }
});

// Route to fetch all passwords for the user
router.get('/all', verifyToken, async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Unauthorized. Invalid user session.' });
    }

    const userId = req.user.userId;

    try {
        // Find all password entries for the authenticated user
        const passwords = await Password.find({ userId });

        if (passwords.length === 0) {
            return res.status(404).json({ message: 'No passwords found for this user.' });
        }

        res.status(200).json({ message: 'Passwords fetched successfully', data: passwords });
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ message: 'Error fetching passwords', error });
    }
});




// Search for a password by URL
router.get('/search/:url', verifyToken, async (req, res) => {
    const { url } = req.params;
    const normalizedUrl = normalizeUrl(url);
    const userId = req.user.userId;
    try {
        const data = await Password.findOne({ userId, url: normalizedUrl });
        if (!data) {
            console.log("No password is related to that URL");
            return res.status(404).json({ message: 'Password not found' });
        }

        console.log("Data containing that password:", { data });
        res.json(data);
    } catch (error) {
        console.log("Error in fetching data");
        res.status(400).json({ message: 'Error fetching password', error });
    }
});

// Route to delete a password by URL

router.delete('/delete/:url', verifyToken, async (req, res) => {
    const { url } = req.params;
    const decodedUrl = decodeURIComponent(url);
    const normalizedUrl = normalizeUrl(decodedUrl);


    if (!req.user || !req.user.userId) {
        console.log('Unauthorized: req.user is undefined');
        return res.status(401).json({ message: 'Unauthorized. Invalid user session.' });
    }

    const userId = req.user.userId;

    // console.log(`Raw URL: ${url}`);
    // console.log(`Decoded URL: ${decodedUrl}`);
    // console.log(`Normalized URL for deletion: ${normalizedUrl}`);

    try {
        const result = await Password.deleteOne({ userId, url: normalizedUrl });
        console.log("Delete result:", result);

        if (result.deletedCount === 0) {
            console.log("No password to delete!");
            return res.status(404).json({ message: 'Password not found to delete' });
        }

        console.log("Password deleted successfully!", { url: normalizedUrl });
        res.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.log("Error deleting password:", error);
        res.status(400).json({ message: 'Error deleting password', error });
    }
});

module.exports = router;
