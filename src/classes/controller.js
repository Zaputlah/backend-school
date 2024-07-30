const Class = require('./model');
const User = require('../users/model'); // Pastikan ini adalah model pengguna Anda

// Mengambil semua kelas (superadmin)
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('guru').populate('siswa');
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mengambil kelas yang diajar oleh guru (guru)
exports.getClassesByTeacher = async (req, res) => {
    try {
        const classes = await Class.find({ guru: req.user._id }).populate('guru').populate('siswa');
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Membuat kelas baru (superadmin)
exports.createClass = async (req, res) => {
    const { className, guru, siswa } = req.body;

    try {

        const existingClassWithName = await Class.findOne({ className });
        if (existingClassWithName) {
            return res.status(400).json({ message: `Kelas dengan nama ${className} sudah ada` });
        }

        // Cek apakah guru sudah menjadi wali kelas di kelas lain
        const existingClassWithGuru = await Class.findOne({ guru });
        if (existingClassWithGuru) {
            const teacher = await User.findById(guru);
            return res.status(400).json({ message: `Guru ${teacher.username} sudah menjadi wali kelas di kelas lain` });
        }

        // Cek apakah ada siswa yang sudah terdaftar di kelas lain
        for (const studentId of siswa) {
            const existingClassWithStudent = await Class.findOne({ siswa: studentId });
            if (existingClassWithStudent) {
                const student = await User.findById(studentId);
                return res.status(400).json({ message: `Siswa ${student.username} sudah terdaftar di kelas lain` });
            }
        }

        const newClass = new Class({
            className,
            guru,
            siswa
        });

        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Menambahkan siswa ke kelas (superadmin)
exports.addStudentToClass = async (req, res) => {
    try {
        const { classId, studentId } = req.body;
        const classData = await Class.findById(classId);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        // Cek apakah siswa sudah terdaftar di kelas lain
        const existingClassWithStudent = await Class.findOne({ siswa: studentId });
        if (existingClassWithStudent) {
            const student = await User.findById(studentId);
            return res.status(400).json({ message: `Siswa ${student.username} sudah terdaftar di kelas lain` });
        }

        if (!classData.siswa.includes(studentId)) {
            classData.siswa.push(studentId);
            await classData.save();
            res.json(classData);
        } else {
            res.status(400).json({ message: 'Student already in class' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
