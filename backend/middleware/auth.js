const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log('No Authorization header provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Correct token extraction
    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded user:', decoded);

        // Assign the userId from token to req.user._id
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.log('Invalid token:', error.message);
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
