// ============================================================
// Error Handler Middleware — Centralised Exception Capture
// ============================================================

const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Express-compatible global error handler.
 *
 * - Catches JSON SyntaxErrors (malformed request body)
 * - Prevents double-send if headers are already flushed
 * - Sanitises stack traces in production
 */
const globalErrorHandler = (err, req, res, _next) => {
    // If headers are already sent, delegate to Express default handler
    if (res.headersSent) {
        return _next(err);
    }

    const log = req.log || logger;

    // ─── Malformed JSON body ─────────────────────────────────
    if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400)) {
        log.warn('Malformed JSON in request body', { error: err.message });
        return ApiResponse.badRequest(res, 'Invalid JSON in request body');
    }

    // ─── Payload too large ───────────────────────────────────
    if (err.type === 'entity.too.large') {
        log.warn('Request payload too large', { limit: err.limit });
        return ApiResponse.error(res, { message: 'Request payload too large', statusCode: 413 });
    }

    // ─── Generic / unknown errors ────────────────────────────
    const statusCode = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    log.error({
        msg: 'Unhandled exception',
        error: err.message,
        stack: isProduction ? undefined : err.stack,
        path: req.originalUrl,
        method: req.method,
    });

    return ApiResponse.error(res, {
        message: isProduction
            ? 'An internal error occurred. Our team has been notified.'
            : err.message,
        statusCode,
        errors: err.errors || undefined,
    });
};

module.exports = { globalErrorHandler };
