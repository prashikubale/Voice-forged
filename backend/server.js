// ============================================================
// Voice Forge — AI Voice-to-Action Backend Server
// ============================================================

require('dotenv').config();

// ─── Config Validation (must be first) ──────────────────────
const { config, validateConfig } = require('./utils/config');
validateConfig();

// ─── Core Dependencies ─────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// ─── Internal Modules ───────────────────────────────────────
const logger = require('./utils/logger');
const { connectDB, disconnectDB } = require('./utils/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizerMiddleware } = require('./middleware/sanitizer');
const { requestContextMiddleware } = require('./middleware/requestContext');
const { globalErrorHandler } = require('./middleware/errorHandler');
const ApiResponse = require('./utils/response');

const app = express();

// ─── Trust Proxy (needed behind Nginx / Load Balancer) ──────
if (config.isProduction) {
    app.set('trust proxy', 1);
}

// ─── Database Connection ────────────────────────────────────
connectDB();

// ─── Security & Performance Middleware ──────────────────────
app.use(helmet());
app.use(compression());          // gzip response bodies
app.use(requestContextMiddleware);
app.use(cors({
    origin: config.isProduction
        ? config.frontendUrl.split(',').map((u) => u.trim()).filter(Boolean)
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-correlation-id'],
    credentials: true,
}));

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Global Middleware ──────────────────────────────────────
app.use(sanitizerMiddleware);
app.use(apiLimiter);

// ─── Routes ─────────────────────────────────────────────────
const voiceRoutes = require('./routes/voice.routes');
app.use('/api/voice', voiceRoutes);

// ─── Health Probes (unauthenticated — for load balancers) ───

// Liveness — "is the process alive?"
app.get('/api/health', (req, res) => {
    ApiResponse.success(res, {
        data: {
            status: 'alive',
            uptime: Math.round(process.uptime()),
        },
    });
});

// Readiness — "is the app ready to serve traffic?"
app.get('/api/health/ready', async (req, res) => {
    const mongoose = require('mongoose');
    const dbReady = mongoose.connection.readyState === 1;

    if (!config.mongoUri || dbReady) {
        return ApiResponse.success(res, {
            data: { status: 'ready', database: dbReady ? 'connected' : 'disabled' },
        });
    }

    return ApiResponse.error(res, {
        message: 'Not ready — database unavailable',
        statusCode: 503,
    });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
    ApiResponse.error(res, { message: 'Endpoint not found', statusCode: 404 });
});

// ─── Global Error Handler (must be last) ────────────────────
app.use(globalErrorHandler);

// ─── Start Server ───────────────────────────────────────────
const server = app.listen(config.port, () => {
    logger.info('Voice Forge Backend started', {
        port: config.port,
        env: config.nodeEnv,
        pid: process.pid,
        node: process.version,
    });
});

// Keep-alive & header timeouts (prevent slow-loris attacks)
server.keepAliveTimeout = 65000;    // slightly > typical load-balancer timeout (60s)
server.headersTimeout = 66000;

// ─── Graceful Shutdown ──────────────────────────────────────
const SHUTDOWN_TIMEOUT_MS = 15000;
let isShuttingDown = false;

async function gracefulShutdown(signal) {
    if (isShuttingDown) return;     // prevent double-shutdown
    isShuttingDown = true;

    logger.info(`${signal} received — starting graceful shutdown`);

    // Stop accepting new connections
    server.close(async () => {
        logger.info('HTTP server closed — draining resources');

        await disconnectDB();

        logger.info('Shutdown complete — exiting');
        process.exit(0);
    });

    // Hard kill if shutdown hangs
    setTimeout(() => {
        logger.error('Graceful shutdown timed out — forcing exit');
        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Process Error Handlers ────────────────────────────────
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection', {
        error: reason?.message || String(reason),
        stack: reason?.stack,
    });
});

process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception — exiting', {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});

module.exports = app;
