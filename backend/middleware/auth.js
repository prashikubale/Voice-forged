// ============================================================
// Auth Middleware — Protects endpoints via JWT or API Key
// ============================================================

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Account = require('../models/account.model');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Timing-safe comparison to prevent timing-based API key enumeration.
 */
function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ─── API Key Authentication (For agent / programmatic access) ─

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return ApiResponse.unauthorized(res, 'Missing x-api-key header');
    }

    // Validate format before hitting DB
    if (!apiKey.startsWith('vf_') || apiKey.length < 20) {
        return ApiResponse.unauthorized(res, 'Invalid API key format');
    }

    try {
        const account = await Account.findOne({ apiKey, isActive: true }).lean();
        if (!account) {
            return ApiResponse.unauthorized(res, 'Invalid or inactive API key');
        }

        // Timing-safe verification (compare the stored key with the provided one)
        if (!timingSafeEqual(account.apiKey, apiKey)) {
            return ApiResponse.unauthorized(res, 'Invalid API key');
        }

        req.account = account;
        // Enrich the child logger with tenant context
        req.log = req.log.child({ tenantId: account._id.toString() });
        next();
    } catch (error) {
        const log = req.log || logger;
        log.error('API key authentication error', { error: error.message });
        return ApiResponse.error(res, { message: 'Authentication failed' });
    }
};

// ─── JWT Authentication (For dashboard / management UI) ──────

const jwtAuth = async (req, res, next) => {
    if (!JWT_SECRET) {
        const log = req.log || logger;
        log.error('JWT_SECRET is not configured — refusing authentication');
        return ApiResponse.error(res, { message: 'Server authentication misconfigured' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ApiResponse.unauthorized(res, 'Missing or malformed Authorization header');
    }

    const token = authHeader.slice(7); // strip "Bearer "

    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256'],
            maxAge: process.env.JWT_MAX_AGE || '24h',
        });

        const account = await Account.findById(decoded.id).lean();

        if (!account || !account.isActive) {
            return ApiResponse.unauthorized(res, 'Account not found or deactivated');
        }

        req.account = account;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.unauthorized(res, 'Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            return ApiResponse.unauthorized(res, 'Invalid token');
        }
        return ApiResponse.unauthorized(res, 'Authentication failed');
    }
};

module.exports = { apiKeyAuth, jwtAuth };
