const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } = require('./controller');
const protectAndCheckRole = require('./middleware'); // Sesuaikan path

const router = express.Router();

// Rute Publik
router.post('/login', loginUser);

// Rute yang Dilindungi
router.post('/register', protectAndCheckRole('superadmin'), registerUser); // Tambahkan middleware di sini
router.get('/profile', protectAndCheckRole(), getUserProfile);
router.put('/profile/:id', protectAndCheckRole('superadmin'), updateUserProfile);
router.delete('/profile/:id', protectAndCheckRole('superadmin'), deleteUser);

// Rute Khusus Admin
router.get('/admin/users', protectAndCheckRole('superadmin'), (req, res) => {
    // Handle admin-specific logic here
});

module.exports = router;
