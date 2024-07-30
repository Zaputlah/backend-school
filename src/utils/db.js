const mongoose = require('mongoose');
const logger = require('../logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        // console.log('MONGODB_URI:', process.env.MONGODB_URI);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
