// ============================================================
// Voice Controller — Handles all voice/transcript endpoints
// ============================================================

const { getIntentService } = require('../services/intent.service');
const { getTaskQueueService } = require('../services/taskQueue.service');
const ApiResponse = require('../utils/response');
const Interaction = require('../models/interaction.model');

class VoiceController {
    /**
     * POST /api/voice/process
     * Processes a transcript through LLM → validates → triggers action
     */
    static async processTranscript(req, res) {
        const { transcript } = req.body;
        const startTime = process.hrtime.bigint();
        const tenantId = req.account?._id;

        req.log.info('Transcript received for processing', {
            transcriptLength: transcript?.length || 0,
            tenantId,
        });

        try {
            // ─── SIMULATION MODE (If no LLM Key) ───────────────
            if (!process.env.LLM_API_KEY) {
                req.log.warn('LLM_API_KEY missing — running in simulation mode');

                const simData = {
                    requestId: req.id,
                    intent: 'book_meeting',
                    confidence: 0.99,
                    actionTaken: false,
                    extractedData: {
                        full_name: 'Demo User',
                        phone_number: '9100000000',
                        preferred_date: 'Tomorrow',
                        preferred_time: '10:00 AM',
                        purpose_of_meeting: 'Simulated booking',
                    },
                    mode: 'simulation',
                };

                // Fire-and-forget persistence
                Interaction.record({
                    correlationId: req.id,
                    tenantId,
                    transcript,
                    intent: simData.intent,
                    confidenceScore: simData.confidence,
                    actionTaken: false,
                    extractedData: simData.extractedData,
                    status: 'success',
                    stage: 'complete',
                    processingTimeMs: 0,
                    metadata: { mode: 'simulation' },
                }, req.log);

                return ApiResponse.success(res, {
                    data: simData,
                    message: 'Simulation mode — LLM key not configured',
                });
            }

            // ─── LIVE MODE ──────────────────────────────────────
            const intentService = getIntentService();
            const result = await intentService.processTranscript(transcript, req.log);
            const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;

            // Fire-and-forget persistence
            Interaction.record({
                correlationId: req.id,
                tenantId,
                transcript,
                intent: result.llmResult?.intent,
                confidenceScore: result.llmResult?.confidence_score,
                actionTaken: result.actionTaken || false,
                extractedData: result.llmResult?.data,
                status: result.success ? 'success' : 'failure',
                stage: result.stage,
                errors: result.errors || (result.error ? [result.error] : undefined),
                processingTimeMs: Math.round(durationMs),
            }, req.log);

            if (result.success) {
                req.log.info('Transcript processing succeeded', {
                    actionTaken: result.actionTaken,
                    durationMs: Math.round(durationMs),
                });

                return ApiResponse.success(res, {
                    data: {
                        requestId: req.id,
                        intent: result.llmResult?.intent,
                        confidence: result.llmResult?.confidence_score,
                        actionTaken: result.actionTaken || false,
                        extractedData: result.llmResult?.data,
                        taskId: result.taskId || null,
                        message: result.message,
                    },
                });
            }

            req.log.warn('Transcript processing failed', {
                stage: result.stage,
                errors: result.errors,
            });
            return ApiResponse.badRequest(
                res,
                result.errors?.[0] || result.error || 'Processing failed',
                result.errors,
            );
        } catch (error) {
            const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
            req.log.error('Transcript processing exception', {
                error: error.message,
                durationMs: Math.round(durationMs),
            });

            // Persist failure
            Interaction.record({
                correlationId: req.id,
                tenantId,
                transcript,
                status: 'failure',
                errors: [error.message],
                processingTimeMs: Math.round(durationMs),
            }, req.log);

            return ApiResponse.error(res, { message: 'Failed to process transcript.' });
        }
    }

    /**
     * POST /api/voice/create-session
     * Creates a voice call session — tries UltraVox first, then ElevenLabs, then demo
     */
    static async createSession(req, res) {
        const ultravoxKey = process.env.ULTRAVOX_API_KEY;
        const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
        const elevenLabsAgentId = process.env.ELEVENLABS_AGENT_ID;

        // ── 1. Try UltraVox ──────────────────────────────────────
        if (ultravoxKey) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            try {
                req.log.info('Creating UltraVox voice session');

                const response = await fetch('https://api.ultravox.ai/api/calls', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': ultravoxKey,
                    },
                    body: JSON.stringify({
                        systemPrompt:
                            'You are the Voice Forge AI, a professional meeting scheduler. ' +
                            'Greet the user, ask for their name, purpose, preferred date and time. ' +
                            'Confirm details before finalising. Be natural and professional.',
                        model: 'fixie-ai/ultravox-70B',
                    }),
                    signal: controller.signal,
                });

                clearTimeout(timeout);

                if (!response.ok) {
                    const errorText = await response.text();
                    req.log.error('UltraVox API error', {
                        status: response.status,
                        body: errorText.slice(0, 500),
                    });
                    throw new Error(`UltraVox API returned ${response.status}`);
                }

                const data = await response.json();
                req.log.info('UltraVox session created', { callId: data.callId });

                return ApiResponse.created(res, {
                    data: {
                        joinUrl: data.joinUrl,
                        callId: data.callId,
                        mode: 'ultravox',
                    },
                    message: 'Voice session created (UltraVox)',
                });
            } catch (error) {
                clearTimeout(timeout);
                req.log.warn('UltraVox failed, checking ElevenLabs fallback', { error: error.message });
                // Fall through to ElevenLabs
            }
        }

        // ── 2. Try ElevenLabs ────────────────────────────────────
        if (elevenLabsKey && elevenLabsAgentId) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            try {
                req.log.info('Creating ElevenLabs Conversational AI session');

                // Get a signed URL for the agent
                const response = await fetch(
                    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${elevenLabsAgentId}`,
                    {
                        method: 'GET',
                        headers: { 'xi-api-key': elevenLabsKey },
                        signal: controller.signal,
                    }
                );

                clearTimeout(timeout);

                if (!response.ok) {
                    const errorText = await response.text();
                    req.log.error('ElevenLabs API error', {
                        status: response.status,
                        body: errorText.slice(0, 500),
                    });
                    throw new Error(`ElevenLabs API returned ${response.status}`);
                }

                const data = await response.json();
                req.log.info('ElevenLabs session created', { agentId: elevenLabsAgentId });

                return ApiResponse.created(res, {
                    data: {
                        signedUrl: data.signed_url,
                        agentId: elevenLabsAgentId,
                        mode: 'elevenlabs',
                    },
                    message: 'Voice session created (ElevenLabs)',
                });
            } catch (error) {
                clearTimeout(timeout);

                if (error.name === 'AbortError') {
                    req.log.error('ElevenLabs session creation timed out');
                    return ApiResponse.error(res, {
                        message: 'Voice session creation timed out',
                        statusCode: 504,
                    });
                }

                req.log.error('ElevenLabs session creation failed', { error: error.message });
                return ApiResponse.error(res, { message: 'Failed to create voice session' });
            }
        }

        // ── 3. Demo mode ─────────────────────────────────────────
        req.log.info('No voice API keys set — demo mode returned');
        return ApiResponse.success(res, {
            data: { mode: 'demo', sessionId: `demo_${Date.now()}` },
            message: 'Demo mode — No voice API keys configured',
        });
    }

    /**
     * GET /api/voice/health
     * Deep health check — verifies service dependencies
     */
    static async healthCheck(req, res) {
        const mongoose = require('mongoose');
        const taskQueue = getTaskQueueService();

        const services = {
            llm: !!process.env.LLM_API_KEY,
            sms: !!(process.env.SMS_ACCOUNT_SID && process.env.SMS_AUTH_TOKEN),
            ultravox: !!process.env.ULTRAVOX_API_KEY,
            elevenlabs: !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_AGENT_ID),
            database: mongoose.connection.readyState === 1,
        };

        const allHealthy = Object.values(services).every(Boolean);

        return ApiResponse.success(res, {
            data: {
                status: allHealthy ? 'healthy' : 'degraded',
                services,
                uptime: Math.round(process.uptime()),
                taskQueue: taskQueue.getStats(),
                timestamp: new Date().toISOString(),
            },
            message: allHealthy ? 'All systems operational' : 'One or more services degraded',
        });
    }
}

module.exports = VoiceController;
