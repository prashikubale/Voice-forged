// ============================================================
// Voice Forge — AI Voice-to-Action Backend Server
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const { sanitizerMiddleware } = require('./middleware/sanitizer');
const ApiResponse = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://yourdomain.com'
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// ─── Body Parsing ────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Global Middleware ───────────────────────────────────────
app.use(sanitizerMiddleware);
app.use(apiLimiter);

// ─── Routes ──────────────────────────────────────────────────
const voiceRoutes = require('./routes/voice.routes');
app.use('/api/voice', voiceRoutes);

// Root health endpoint
app.get('/api/health', (req, res) => {
    ApiResponse.success(res, {
        data: {
            service: 'Voice Forge Backend',
            version: '1.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        },
        message: 'Server is running',
    });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
    ApiResponse.error(res, { message: 'Endpoint not found', statusCode: 404 });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, _next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    ApiResponse.error(res, {
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
    });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
    logger.info(`Voice Forge Backend started`, {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        services: {
            llm: !!process.env.LLM_API_KEY ? 'configured' : 'not set',
            sms: !!process.env.SMS_ACCOUNT_SID ? 'configured' : 'not set',
            ultravox: !!process.env.ULTRAVOX_API_KEY ? 'configured' : 'not set',
        },
    });
});

module.exports = app;
