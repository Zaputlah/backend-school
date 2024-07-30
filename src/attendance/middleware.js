const jwt = require('jsonwebtoken');
const User = require('../users/model'); // Pastikan path sesuai

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ambil token setelah 'Bearer'

    console.log('Token received:', token);

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log('Decoded token:', decoded);

        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                console.error('User not found with ID:', decoded.id);
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};
