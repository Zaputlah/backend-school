const { body, param, validationResult } = require('express-validator');

// Validasi untuk membuat kelas
exports.validateCreateClass = [
    body('className').notEmpty().withMessage('Class name is required'),
    body('guru').isMongoId().withMessage('Valid teacher ID is required'),
    body('siswa').isArray().withMessage('Students should be an array of IDs'),
    body('siswa.*').isMongoId().withMessage('Each student ID should be valid'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validasi untuk menambahkan siswa ke kelas
exports.validateAddStudentToClass = [
    body('classId').isMongoId().withMessage('Valid class ID is required'),
    body('studentId').isMongoId().withMessage('Valid student ID is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
