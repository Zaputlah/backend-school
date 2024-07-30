// validators/attendanceValidator.js
const { body } = require('express-validator');

exports.validateMarkAttendance = [
    body('status').isIn(['present', 'izin', 'sakit']).withMessage('Status must be either "present", "izin", or "sakit"'),
    body('classId').optional().notEmpty().withMessage('Class ID is required if present'), // Class ID tidak diperlukan di sini jika sudah diambil dari kelas
    body('medicalNote').if(body('status').equals('sakit')).notEmpty().withMessage('Medical note is required for "sakit" status')
];

exports.validateEditAttendance = [
    body('attendanceId').notEmpty().withMessage('Attendance ID is required'),
    body('status').isIn(['present', 'izin', 'sakit']).withMessage('Status must be either "present", "izin", or "sakit"'),
    body('medicalNote').if(body('status').equals('sakit')).optional().notEmpty().withMessage('Medical note is required for "sakit" status')
];
