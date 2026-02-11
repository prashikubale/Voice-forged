// ============================================================
// Input Sanitizer — Strip dangerous content from inputs
// ============================================================

const ApiResponse = require('../utils/response');

function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/<[^>]*>/g, '')        // Strip HTML tags
        .replace(/javascript:/gi, '')    // Remove JS protocol
        .replace(/on\w+=/gi, '')         // Remove event handlers
        .trim();
}

function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            cleaned[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            cleaned[key] = sanitizeObject(value);
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

function sanitizerMiddleware(req, res, next) {
    try {
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body);
        }
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query);
        }
        next();
    } catch (err) {
        ApiResponse.badRequest(res, 'Invalid input data');
    }
}

module.exports = { sanitizerMiddleware, sanitizeString, sanitizeObject };
