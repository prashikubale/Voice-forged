// ============================================================
// Voice Controller — Handles all voice/transcript endpoints
// ============================================================

const { getIntentService } = require('../services/intent.service');
const ApiResponse = require('../utils/response');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class VoiceController {
    /**
     * POST /api/voice/process
     * Processes a transcript through LLM → validates → triggers action
     */
    static async processTranscript(req, res) {
        const requestId = uuidv4();
        const { transcript } = req.body;

        logger.info('Transcript processing request received', {
            requestId,
            transcriptLength: transcript.length,
        });

        try {
            // ─── SIMULATION MODE (If no LLM Key) ───
            if (!process.env.LLM_API_KEY) {
                logger.warn('LLM_API_KEY missing - returning SIMULATED data for MVP testing');
                await new Promise(r => setTimeout(r, 1500)); // Fake delay
                return ApiResponse.success(res, {
                    data: {
                        requestId,
                        intent: 'book_meeting',
                        confidence: 0.99,
                        actionTaken: false,
                        targetNumber: process.env.WHATSAPP_TARGET_NUMBER || process.env.SMS_TO_NUMBER,
                        extractedData: {
                            full_name: 'Demo User',
                            phone_number: process.env.WHATSAPP_TARGET_NUMBER || '9100000000',
                            preferred_date: 'Tomorrow',
                            preferred_time: '10:00 AM',
                            purpose_of_meeting: 'MVP Demo Testing',
                            additional_notes: 'Encrypted channel established.',
                        },
                        message: 'Simulation: Data extracted successfully',
                    },
                    message: 'Simulation Mode (No LLM Key)',
                });
            }

            const intentService = getIntentService();
            const result = await intentService.processTranscript(transcript);

            if (result.success) {
                logger.info('Transcript processing succeeded', { requestId, actionTaken: result.actionTaken });
                return ApiResponse.success(res, {
                    data: {
                        requestId,
                        intent: result.llmResult?.intent,
                        confidence: result.llmResult?.confidence_score,
                        actionTaken: result.actionTaken || false,
                        extractedData: result.llmResult?.data,
                        targetNumber: process.env.WHATSAPP_TARGET_NUMBER || process.env.SMS_TO_NUMBER,
                        message: result.message,
                    },
                    message: result.message,
                });
            } else {
                logger.warn('Transcript processing failed at stage', {
                    requestId,
                    stage: result.stage,
                    errors: result.errors,
                });
                return ApiResponse.badRequest(res, result.errors?.[0] || result.error || 'Processing failed', result.errors);
            }
        } catch (error) {
            logger.error('Transcript processing error', { requestId, error: error.message });
            return ApiResponse.error(res, { message: 'Failed to process transcript. Please try again.' });
        }
    }

    /**
     * POST /api/voice/create-session
     * Creates an UltraVox call session (proxied from backend for security)
     */
    static async createSession(req, res) {
        const apiKey = process.env.ULTRAVOX_API_KEY;

        if (!apiKey) {
            // Return a demo mode response when no API key
            logger.info('UltraVox key not set — returning demo mode');
            return ApiResponse.success(res, {
                data: { mode: 'demo', sessionId: `demo_${Date.now()}` },
                message: 'Demo mode — UltraVox API key not configured',
            });
        }

        try {
            const response = await fetch('https://api.ultravox.ai/api/calls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify({
                    systemPrompt: "You are the Voice Forge AI, a professional meeting scheduler. Your goal is to have a natural, helpful conversation to help the user book a meeting. Greet the user, ask for their name, purpose, date and time. Confirm details. Be natural and professional.",
                    model: 'fixie-ai/ultravox-70B'
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error('UltraVox session creation failed', { status: response.status, error: errorText });
                throw new Error(`UltraVox API returned ${response.status}`);
            }

            const data = await response.json();
            logger.info('UltraVox session created', { callId: data.callId });

            return ApiResponse.created(res, {
                data: {
                    joinUrl: data.joinUrl,
                    callId: data.callId,
                    mode: 'live',
                },
                message: 'Voice session created',
            });
        } catch (error) {
            logger.error('Session creation error', { error: error.message });
            return ApiResponse.error(res, { message: 'Failed to create voice session' });
        }
    }

    /**
     * GET /api/voice/health
     * Health check for the voice processing pipeline
     */
    static async healthCheck(req, res) {
        const status = {
            llm: !!process.env.LLM_API_KEY,
            sms: !!(process.env.SMS_ACCOUNT_SID && process.env.SMS_AUTH_TOKEN),
            ultravox: !!process.env.ULTRAVOX_API_KEY,
        };

        return ApiResponse.success(res, {
            data: {
                status: 'operational',
                services: status,
                timestamp: new Date().toISOString(),
            },
            message: 'Voice pipeline health check',
        });
    }
}

module.exports = VoiceController;
