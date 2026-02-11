// ============================================================
// Logger — Structured logging with PII protection
// ============================================================

const isProduction = process.env.NODE_ENV === 'production';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = isProduction ? LEVELS.info : LEVELS.debug;

function sanitizeForLog(data) {
    if (!data || typeof data !== 'object') return data;
    const sanitized = { ...data };
    const sensitiveKeys = ['phone_number', 'email', 'api_key', 'token', 'password', 'secret'];
    for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
            sanitized[key] = '***REDACTED***';
        }
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeForLog(sanitized[key]);
        }
    }
    return sanitized;
}

function formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logData = isProduction ? sanitizeForLog(meta) : meta;
    return { timestamp, level, message, ...logData };
}

const logger = {
    error(message, meta = {}) {
        if (currentLevel >= LEVELS.error) {
            console.error(JSON.stringify(formatMessage('ERROR', message, meta)));
        }
    },
    warn(message, meta = {}) {
        if (currentLevel >= LEVELS.warn) {
            console.warn(JSON.stringify(formatMessage('WARN', message, meta)));
        }
    },
    info(message, meta = {}) {
        if (currentLevel >= LEVELS.info) {
            console.log(JSON.stringify(formatMessage('INFO', message, meta)));
        }
    },
    debug(message, meta = {}) {
        if (currentLevel >= LEVELS.debug) {
            console.log(JSON.stringify(formatMessage('DEBUG', message, meta)));
        }
    },
};

module.exports = logger;
