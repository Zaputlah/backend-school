const express = require('express');
const router = express.Router();
const studentController = require('./controller');
const { validateStudent } = require('./middleware');

// Route untuk mendapatkan semua siswa
router.get('/pendaftaran/all', studentController.getAllregisters);

// Route untuk mendaftarkan siswa baru
router.post('/', validateStudent, studentController.createregister);

module.exports = router;
