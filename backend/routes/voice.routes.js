// ============================================================
// Voice Routes — API endpoint definitions
// ============================================================

const express = require('express');
const router = express.Router();
const VoiceController = require('../controllers/voice.controller');
const { voiceLimiter } = require('../middleware/rateLimiter');
const { validateTranscriptRequest, validateCallSession } = require('../middleware/validator');

// Process transcript through LLM pipeline
router.post('/process',
    voiceLimiter,
    validateTranscriptRequest,
    VoiceController.processTranscript
);

// Create UltraVox voice session
router.post('/create-session',
    voiceLimiter,
    validateCallSession,
    VoiceController.createSession
);

// Health check
router.get('/health', VoiceController.healthCheck);

module.exports = router;
