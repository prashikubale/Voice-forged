// ============================================================
// Voice Routes — API endpoint definitions
// ============================================================

const express = require('express');
const router = express.Router();
const VoiceController = require('../controllers/voice.controller');
const { voiceLimiter } = require('../middleware/rateLimiter');
const { validateTranscriptRequest, validateCallSession } = require('../middleware/validator');

const { apiKeyAuth } = require('../middleware/auth');

// Process transcript through LLM pipeline
router.post('/process',
    apiKeyAuth, // Secure via API Key
    voiceLimiter,
    validateTranscriptRequest,
    VoiceController.processTranscript
);

// Create UltraVox voice session
router.post('/create-session',
    apiKeyAuth, // Secure via API Key
    voiceLimiter,
    validateCallSession,
    VoiceController.createSession
);

// Health check
router.get('/health', VoiceController.healthCheck);

module.exports = router;
