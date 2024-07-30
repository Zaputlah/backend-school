const Register = require('./model');

// Mengambil semua siswa
exports.getAllregisters = async (req, res) => {
    try {
        const registers = await Register.find();
        res.json(registers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mendaftarkan siswa baru
exports.createregister = async (req, res) => {
    const newRegister = new Register({
        name: req.body.name,
        age: req.body.age,
        previousSchool: req.body.previousSchool,
        grade: req.body.grade
    });

    try {
        const savedRegister = await newRegister.save();
        res.status(201).json(savedRegister);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
