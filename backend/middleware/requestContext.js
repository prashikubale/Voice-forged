// ============================================================
// Request Context Middleware — Correlation ID & Observability
// ============================================================

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Injects a unique correlation ID into every request + response,
 * attaches a child logger, and logs completed request metrics.
 */
const requestContextMiddleware = (req, res, next) => {
    // Honour an upstream correlation ID (e.g. from a gateway/load-balancer)
    const correlationId = req.header('x-correlation-id') || uuidv4();

    // Attach to request + response
    req.id = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    // Child logger carries the correlationId in every log line automatically
    req.log = logger.child({ requestId: correlationId });

    const startHrTime = process.hrtime.bigint(); // nanosecond precision

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startHrTime) / 1e6;

        // Choose log level based on status code
        const level = res.statusCode >= 500 ? 'error'
            : res.statusCode >= 400 ? 'warn'
                : 'info';

        req.log[level]({
            msg: 'request completed',
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: Math.round(durationMs * 100) / 100,  // 2 decimal places
            contentLength: res.getHeader('content-length') || 0,
            userAgent: req.get('user-agent') || 'unknown',
            ip: req.ip,
        });
    });

    next();
};

module.exports = { requestContextMiddleware };
