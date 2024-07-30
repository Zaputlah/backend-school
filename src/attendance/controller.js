// controllers/attendanceController.js
const Attendance = require('./model');
const Class = require('../classes/model');
const User = require('../users/model');
const { validationResult } = require('express-validator');

exports.markAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const userId = req.user._id;
    const medicalNote = req.file; // Mengambil file dari request

    console.log('Request body:', req.body);
    console.log('Uploaded file:', medicalNote);

    const today = new Date().setHours(0, 0, 0, 0); // Mulai hari ini (midnight)
    const endOfDay = new Date(today).setHours(23, 59, 59, 999); // Akhir hari ini (just before midnight)

    try {
        // Cari kelas yang terkait dengan pengguna yang login
        const userClass = await Class.findOne({
            $or: [
                { siswa: userId }, 
                { guru: userId }
            ]
        });

        if (!userClass) {
            return res.status(400).json({ message: 'User not associated with any class' });
        }

        // Validasi status dan file
        if (status === 'sakit' && !medicalNote) {
            return res.status(400).json({ message: 'Medical note is required for sick leave' });
        }

        // Cek apakah sudah ada absensi hari ini
        const existingAttendance = await Attendance.findOne({
            user: userId,
            date: { $gte: today, $lte: endOfDay }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Anda sudah absen hari ini' });
        }

        // Simpan surat dokter jika ada
        let medicalNotePath = null;
        if (medicalNote) {
            const ext = path.extname(medicalNote.originalname);
            const filename = `${Date.now()}${ext}`;
            medicalNotePath = `uploads/${filename}`;
            fs.renameSync(medicalNote.path, medicalNotePath);
        }

        // Buat entri absensi
        const newAttendance = new Attendance({
            user: userId,
            class: userClass._id,
            status,
            medicalNote: medicalNotePath
        });

        const savedAttendance = await newAttendance.save();
        res.status(201).json(savedAttendance);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: err.message });
    }
};


// Melihat sejarah absensi (untuk user)
exports.getAttendanceHistory = async (req, res) => {
    const userId = req.user._id;

    try {
        const history = await Attendance.find({ user: userId }).populate('class');
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Melihat rekap absensi siswa (untuk guru berdasarkan kelas)
exports.getClassAttendance = async (req, res) => {
    const { classId } = req.params;
    const userId = req.user._id;

    try {
        const classData = await Class.findById(classId);
        if (!classData || classData.guru.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Anda bukan wali kelas ini' });
        }

        const attendance = await Attendance.find({ class: classId }).populate('user');
        res.json(attendance);
    } catch (err) {
        res.status_500().json({ message: err.message });
    }
};

// Edit absensi siswa (untuk guru)
exports.editStudentAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { attendanceId, status } = req.body;
    const userId = req.user._id;

    try {
        const attendance = await Attendance.findById(attendanceId).populate('class');
        if (!attendance || attendance.class.guru.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Anda bukan wali kelas ini' });
        }

        attendance.status = status;
        const updatedAttendance = await attendance.save();
        res.json(updatedAttendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
