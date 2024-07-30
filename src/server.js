const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer'); // Pastikan multer diimpor
const userRouter = require('./users/router');
const classRouter = require('./classes/router'); 
const logger = require('./logger');
const connectDB = require('./utils/db');
const attendanceRoutes = require('./attendance/router');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware untuk CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk parsing URL-encoded
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing multipart/form-data
const upload = multer({ dest: 'uploads/' });
app.use(upload.any()); // Menggunakan multer untuk parsing form-data

// Middleware untuk logging dengan morgan
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Koneksi ke database
connectDB();

// Rute API
app.use('/api/users', userRouter);
app.use('/api/class', classRouter);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
