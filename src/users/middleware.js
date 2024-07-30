const jwt = require('jsonwebtoken');
const User = require('./model'); // Sesuaikan path dengan lokasi model Anda

const protectAndCheckRole = (role) => {
    return async (req, res, next) => {
        let token = req.headers.authorization; // Ambil token langsung dari header Authorization

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            // Periksa peran pengguna jika role diberikan
            if (role && req.user.role !== role) {
                return res.status(403).json({ message: 'hanya bisa diakses oleh superadmin' });
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error); // Tambahkan log untuk debugging
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    };
};

module.exports = protectAndCheckRole;
