const express = require('express');
const router = express.Router();
const classController = require('./controller');
const { authenticateToken, authorizeSuperadmin, authorizeGuru } = require('./middleware');
const { validateCreateClass, validateAddStudentToClass } = require('./validation');

// Mengambil semua kelas (superadmin)
router.get('/', authenticateToken, authorizeSuperadmin, classController.getAllClasses);

// Mengambil kelas yang diajar oleh guru (guru)
router.get('/my-classes', authenticateToken, authorizeGuru, classController.getClassesByTeacher);

// Membuat kelas baru (superadmin)
router.post('/', authenticateToken, authorizeSuperadmin, validateCreateClass, classController.createClass);

// Menambahkan siswa ke kelas (superadmin)
router.post('/add-student', authenticateToken, authorizeSuperadmin, validateAddStudentToClass, classController.addStudentToClass);

module.exports = router;
