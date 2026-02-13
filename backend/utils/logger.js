// ============================================================
// Logger — Production-grade structured logging via Pino
// ============================================================

const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';

// Sensitive key paths for PII redaction
const REDACT_PATHS = [
    'password',
    'secret',
    'token',
    'api_key',
    'apiKey',
    'authToken',
    'phone_number',
    'email',
    'req.headers.authorization',
    'req.headers["x-api-key"]',
    '*.password',
    '*.secret',
    '*.token',
    '*.api_key',
    '*.apiKey',
    '*.authToken',
    '*.phone_number',
    '*.email',
];

const logger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    redact: {
        paths: REDACT_PATHS,
        censor: '***REDACTED***',
    },
    base: {
        service: 'voice-forge-backend',
        env: process.env.NODE_ENV || 'development',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level(label) {
            return { level: label };
        },
    },
    // Only use pino-pretty in development; in production, raw JSON goes to stdout
    // for ingestion by log aggregators (Datadog, ELK, CloudWatch, etc.)
    ...(isProduction
        ? {}
        : {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    ignore: 'pid,hostname',
                    translateTime: 'SYS:HH:MM:ss.l',
                },
            },
        }),
});

/**
 * Creates a child logger bound to a specific request's correlation ID.
 * Usage:  req.log = logger.child({ requestId });
 *
 * @param {string} requestId
 * @returns {pino.Logger}
 */
logger.withContext = (requestId) => {
    return logger.child({ requestId });
};

module.exports = logger;
