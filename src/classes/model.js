const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    guru: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referensi ke model User yang menyimpan data guru
        required: true
    },
    siswa: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Referensi ke model User yang menyimpan data siswa
    }]
});

module.exports = mongoose.model('Class', classSchema);
