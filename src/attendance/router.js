const express = require('express');
const router = express.Router();
const multer = require('multer'); // Pastikan multer diimpor
const path = require('path'); // Untuk menangani path file
const fs = require('fs'); // Untuk memindahkan file
const attendanceController = require('./controller');
const { authenticateToken } = require('./middleware');
const { validateMarkAttendance, validateEditAttendance } = require('./validation');

const upload = multer({ dest: 'uploads/' }); // Setup multer

router.post('/', authenticateToken, upload.single('medicalNote'), validateMarkAttendance, attendanceController.markAttendance);
router.get('/history', authenticateToken, attendanceController.getAttendanceHistory);
router.get('/class/:classId', authenticateToken, attendanceController.getClassAttendance);
router.put('/edit', authenticateToken, validateEditAttendance, attendanceController.editStudentAttendance);

module.exports = router;
