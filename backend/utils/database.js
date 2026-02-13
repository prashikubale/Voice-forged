// ============================================================
// Database — Production-grade MongoDB Connection via Mongoose
// ============================================================

const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Connects to MongoDB with production-grade defaults:
 * - Auto-reconnect & connection pooling
 * - Lifecycle event listeners
 * - Graceful shutdown hook
 */
const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        logger.warn('MONGODB_URI not set — database features disabled. Interactions will NOT be persisted.');
        return null;
    }

    // Recommended production options for Mongoose 7+
    const options = {
        maxPoolSize: parseInt(process.env.MONGO_POOL_SIZE, 10) || 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        retryReads: true,
    };

    // ─── Connection Lifecycle Events ─────────────────────────
    mongoose.connection.on('connected', () => {
        logger.info('MongoDB connection established');
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection lost — will attempt reconnect');
    });

    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error', { error: err.message });
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected successfully');
    });

    try {
        await mongoose.connect(mongoUri, options);
        logger.info('MongoDB connected successfully', {
            poolSize: options.maxPoolSize,
        });
        return mongoose.connection;
    } catch (error) {
        logger.error('MongoDB initial connection failed', {
            error: error.message,
            uri: mongoUri.replace(/\/\/.*@/, '//***:***@'), // mask credentials
        });

        if (process.env.NODE_ENV === 'production') {
            logger.error('Exiting — database is required in production');
            process.exit(1);
        }

        return null;
    }
};

/**
 * Gracefully closes the Mongoose connection.
 * Called by the server's shutdown handler.
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed gracefully');
    } catch (err) {
        logger.error('Error during MongoDB disconnect', { error: err.message });
    }
};

module.exports = { connectDB, disconnectDB };
