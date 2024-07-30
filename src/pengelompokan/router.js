const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Student = require('../pendaftaran/model');
const { exec } = require('child_process');

// Endpoint untuk mengelompokkan siswa
router.post('/groupStudents', async (req, res) => {
    // Mengambil data siswa dari file CSV
    const studentsFilePath = path.join(__dirname, '../students_with_classes.csv');
    const results = [];

    fs.createReadStream(studentsFilePath)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
            // Mengupdate data siswa di MongoDB dengan kelas yang telah dikelompokkan
            for (const student of results) {
                await Student.updateOne(
                    { _id: student._id },
                    { $set: { class: student.class } }
                );
            }
            res.json({ message: 'Students have been grouped successfully' });
        });
});

router.post('/trigger-classification', (req, res) => {
    exec('node src/scripts/trigger-classification.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Failed to execute classification script');
        }
        res.send('Classification script executed successfully');
    });
});

module.exports = router;
