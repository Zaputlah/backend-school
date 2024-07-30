const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi token
exports.authenticateToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    console.log('Received Token:', token);
    console.log('Secret Key:', process.env.JWT_SECRET);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        console.log('Decoded User:', user); // Log decoded user to check if role is included

        req.user = user;
        next();
    });
};

// Middleware untuk otorisasi superadmin
exports.authorizeSuperadmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'superadmin') {
        console.log('Access denied. User role:', req.user ? req.user.role : 'undefined');
        return res.status(403).json({ message: 'Access denied. You are not a superadmin' });
    }
    next();
};

// Middleware untuk otorisasi guru
exports.authorizeGuru = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user found' });
    }
    if (req.user.role !== 'guru') {
        return res.status(403).json({ message: 'Access denied. You are not a guru' });
    }
    next();
};
