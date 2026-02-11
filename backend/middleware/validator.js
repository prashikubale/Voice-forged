// ============================================================
// Validator — Schema validation for LLM output & requests
// ============================================================

const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');

// JSON schema definitions for each intent
const INTENT_SCHEMAS = {
    meeting_booking: {
        required: ['full_name', 'preferred_date', 'preferred_time', 'purpose_of_meeting'],
        optional: ['phone_number', 'email', 'additional_notes'],
        all() { return [...this.required, ...this.optional]; },
    },
    // Future intents can be added here
    callback_request: {
        required: ['full_name', 'phone_number', 'preferred_time'],
        optional: ['purpose_of_meeting', 'additional_notes'],
        all() { return [...this.required, ...this.optional]; },
    },
    service_inquiry: {
        required: ['full_name', 'purpose_of_meeting'],
        optional: ['phone_number', 'email', 'preferred_date', 'preferred_time', 'additional_notes'],
        all() { return [...this.required, ...this.optional]; },
    },
};

function validateTranscriptRequest(req, res, next) {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string') {
        return ApiResponse.badRequest(res, 'Transcript is required and must be a string');
    }

    if (transcript.trim().length < 10) {
        return ApiResponse.badRequest(res, 'Transcript is too short to process');
    }

    if (transcript.length > 50000) {
        return ApiResponse.badRequest(res, 'Transcript exceeds maximum length (50,000 characters)');
    }

    next();
}

function validateLLMOutput(output) {
    const errors = [];

    if (!output || typeof output !== 'object') {
        return { valid: false, errors: ['LLM output is not a valid object'] };
    }

    // Check required top-level fields
    if (!output.intent || typeof output.intent !== 'string') {
        errors.push('Missing or invalid "intent" field');
    }

    if (typeof output.confidence_score !== 'number' || output.confidence_score < 0 || output.confidence_score > 1) {
        errors.push('Invalid "confidence_score" — must be a number between 0 and 1');
    }

    if (typeof output.action_required !== 'boolean') {
        errors.push('Missing or invalid "action_required" field');
    }

    if (!output.data || typeof output.data !== 'object') {
        errors.push('Missing or invalid "data" field');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    // Validate against intent schema
    const schema = INTENT_SCHEMAS[output.intent];
    if (!schema) {
        logger.warn('Unknown intent received', { intent: output.intent });
        return { valid: true, warnings: [`Unknown intent: ${output.intent}`] };
    }

    const missingRequired = schema.required.filter(field => !output.data[field] || output.data[field].trim() === '');
    if (missingRequired.length > 0) {
        return {
            valid: false,
            errors: [`Missing required fields for ${output.intent}: ${missingRequired.join(', ')}`],
        };
    }

    return { valid: true };
}

function validateCallSession(req, res, next) {
    // For creating UltraVox call sessions
    next();
}

module.exports = {
    validateTranscriptRequest,
    validateLLMOutput,
    validateCallSession,
    INTENT_SCHEMAS,
};
