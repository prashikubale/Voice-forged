// ============================================================
// Rate Limiter — Configurable request throttling
// ============================================================

const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response');

function createRateLimiter(options = {}) {
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
    const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30;

    return rateLimit({
        windowMs: options.windowMs || windowMs,
        max: options.max || max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            ApiResponse.tooMany(res, 'Rate limit exceeded. Please try again later.');
        },
        keyGenerator: (req) => {
            return req.ip || req.headers['x-forwarded-for'] || 'unknown';
        },
    });
}

// Stricter limiter for voice/LLM endpoints (expensive operations)
const voiceLimiter = createRateLimiter({ windowMs: 60000, max: 10 });

// General API limiter
const apiLimiter = createRateLimiter();

module.exports = { createRateLimiter, voiceLimiter, apiLimiter };
