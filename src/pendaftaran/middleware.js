const { check, validationResult } = require('express-validator');

exports.validateStudent = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('age').isInt({ min: 21, max: 24 }).withMessage('Age must be between 21 and 24'),
    check('previousSchool').not().isEmpty().withMessage('Previous school is required'),
    check('grade').isIn(['10', '11', '12']).withMessage('Grade must be 10, 11, or 12'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
