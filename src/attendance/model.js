// models/Attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'izin', 'sakit'], required: true },
    medicalNote: { type: String } // Path to the uploaded medical note
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
