// ============================================================
// Config — Validates & exports all environment variables
// ============================================================
//
// This module validates required env vars at startup and fails
// fast with a clear error if anything critical is missing.
// Import this FIRST in server.js (after dotenv.config()).
// ============================================================

const logger = require('./logger');

// ─── Define required vs optional config ─────────────────────
const config = {
    // Server
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    frontendUrl: process.env.FRONTEND_URL || '',

    // Database
    mongoUri: process.env.MONGODB_URI || '',
    mongoPoolSize: parseInt(process.env.MONGO_POOL_SIZE, 10) || 10,
    interactionTtlDays: parseInt(process.env.INTERACTION_TTL_DAYS, 10) || 90,

    // Auth
    jwtSecret: process.env.JWT_SECRET || '',
    jwtMaxAge: process.env.JWT_MAX_AGE || '24h',

    // LLM
    llmApiKey: process.env.LLM_API_KEY || '',
    llmModel: process.env.LLM_MODEL || 'gemini-2.0-flash',
    llmTimeoutMs: parseInt(process.env.LLM_TIMEOUT_MS, 10) || 30000,

    // Ultravox
    ultravoxApiKey: process.env.ULTRAVOX_API_KEY || '',
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
    elevenLabsAgentId: process.env.ELEVENLABS_AGENT_ID || '',

    // SMS / Twilio
    smsAccountSid: process.env.SMS_ACCOUNT_SID || '',
    smsAuthToken: process.env.SMS_AUTH_TOKEN || '',
    smsFromNumber: process.env.SMS_FROM_NUMBER || '',
    smsToNumber: process.env.SMS_TO_NUMBER || '',

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 30,

    // Task Queue
    taskMaxRetries: parseInt(process.env.TASK_MAX_RETRIES, 10) || 3,
    taskMaxQueueSize: parseInt(process.env.TASK_MAX_QUEUE_SIZE, 10) || 500,

    // Logging
    logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
};

// ─── Startup Validation ─────────────────────────────────────

function validateConfig() {
    const errors = [];
    const warnings = [];

    // --- PRODUCTION HARD REQUIREMENTS ---
    if (config.isProduction) {
        if (!config.mongoUri) errors.push('MONGODB_URI is required in production');
        if (!config.jwtSecret) errors.push('JWT_SECRET is required in production');
        if (config.jwtSecret === 'CHANGE_ME_TO_A_RANDOM_64_CHAR_SECRET') {
            errors.push('JWT_SECRET is still the default placeholder — set a real secret');
        }
    }

    // --- WARNINGS (non-fatal) ---
    if (!config.mongoUri) warnings.push('MONGODB_URI not set — interactions will NOT be persisted');
    if (!config.jwtSecret) warnings.push('JWT_SECRET not set — JWT auth will be disabled');
    if (!config.llmApiKey) warnings.push('LLM_API_KEY not set — LLM will run in simulation mode');
    if (!config.ultravoxApiKey && !config.elevenLabsApiKey) warnings.push('Neither ULTRAVOX_API_KEY nor ELEVENLABS_API_KEY set — voice sessions will be demo mode');
    if (!config.smsAccountSid) warnings.push('SMS credentials not set — SMS sending disabled');

    // --- Report ---
    warnings.forEach((w) => logger.warn(w));

    if (errors.length > 0) {
        errors.forEach((e) => logger.error(`CONFIG ERROR: ${e}`));
        logger.fatal('Server cannot start — fix the above configuration errors');
        process.exit(1);
    }

    logger.info('Configuration validated', {
        env: config.nodeEnv,
        services: {
            database: config.mongoUri ? 'configured' : 'disabled',
            llm: config.llmApiKey ? 'configured' : 'simulation',
            ultravox: config.ultravoxApiKey ? 'configured' : 'demo',
            sms: config.smsAccountSid ? 'configured' : 'disabled',
        },
    });
}

module.exports = { config, validateConfig };
