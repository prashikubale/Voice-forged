// ============================================================
// LLM Service — Gemini-powered transcript processing
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

const LLM_TIMEOUT_MS = parseInt(process.env.LLM_TIMEOUT_MS, 10) || 30000;

const SYSTEM_PROMPT = `You are a strict intent extraction engine for a voice automation system.
You receive a transcript of a voice conversation and MUST extract structured data from it.

RULES:
1. You MUST return ONLY valid JSON. No explanations, no markdown, no conversational text.
2. Detect the intent from the transcript.
3. Extract all relevant fields with maximum accuracy.
4. If a field is not mentioned, set it to an empty string "".
5. confidence_score must be between 0.0 and 1.0 based on how clearly the data was expressed.
6. Set action_required to true if you have enough data to take action.

SUPPORTED INTENTS:
- meeting_booking: User wants to schedule/book a meeting or appointment

REQUIRED OUTPUT FORMAT (meeting_booking):
{
  "intent": "meeting_booking",
  "confidence_score": 0.0,
  "data": {
    "full_name": "",
    "phone_number": "",
    "email": "",
    "preferred_date": "",
    "preferred_time": "",
    "purpose_of_meeting": "",
    "additional_notes": ""
  },
  "action_required": true
}

If transcript does not contain bookable intent:
{
  "intent": "unknown",
  "confidence_score": 0.0,
  "data": {},
  "action_required": false
}

CRITICAL: Return ONLY the JSON object. No other text.`;

class LLMService {
    constructor() {
        const apiKey = process.env.LLM_API_KEY;
        if (!apiKey) {
            logger.warn('LLM_API_KEY not set — LLM service will not function');
            this.ready = false;
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            this.model = genAI.getGenerativeModel({
                model: process.env.LLM_MODEL || 'gemini-2.0-flash',
            });
            this.ready = true;
            logger.info('LLM service initialised', {
                model: process.env.LLM_MODEL || 'gemini-2.0-flash',
            });
        } catch (err) {
            logger.error('LLM service initialisation failed', { error: err.message });
            this.ready = false;
        }
    }

    /**
     * Sends a transcript to the LLM and returns structured JSON.
     *
     * @param {string}      transcript  User voice transcript
     * @param {pino.Logger} [reqLog]    Optional request-scoped logger
     * @returns {Promise<object>}       Parsed intent object
     */
    async processTranscript(transcript, reqLog) {
        const log = reqLog || logger;

        if (!this.ready) {
            throw new Error('LLM service not configured — missing or invalid API key');
        }

        log.info('Sending transcript to LLM', {
            transcriptLength: transcript?.length || 0,
        });

        // AbortController for timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

        try {
            const result = await this.model.generateContent(
                {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `${SYSTEM_PROMPT}\n\nTRANSCRIPT:\n${transcript}` }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        topP: 0.8,
                        maxOutputTokens: 1024,
                        responseMimeType: 'application/json',
                    },
                },
                { signal: controller.signal },
            );

            clearTimeout(timeout);

            const responseText = result.response.text().trim();
            log.debug('Raw LLM response received', { responseLength: responseText.length });

            const parsed = this._parseJSON(responseText);

            // Structural sanity check
            if (!parsed.intent || typeof parsed.confidence_score !== 'number') {
                throw new Error('LLM response missing required fields (intent / confidence_score)');
            }

            log.info('LLM processing complete', {
                intent: parsed.intent,
                confidence: parsed.confidence_score,
                actionRequired: parsed.action_required,
            });

            return parsed;
        } catch (error) {
            clearTimeout(timeout);

            if (error.name === 'AbortError') {
                log.error('LLM request timed out', { timeoutMs: LLM_TIMEOUT_MS });
                throw new Error(`LLM request timed out after ${LLM_TIMEOUT_MS}ms`);
            }

            log.error('LLM processing failed', { error: error.message });
            throw new Error(`LLM processing failed: ${error.message}`);
        }
    }

    /**
     * Attempts to parse raw LLM text as JSON.
     * Falls back to extracting the first JSON block if wrapped in markdown.
     */
    _parseJSON(text) {
        try {
            return JSON.parse(text);
        } catch (_) {
            // Gemini sometimes wraps output in ```json ... ```
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                return JSON.parse(match[0]);
            }
            throw new Error('LLM returned non-JSON response');
        }
    }
}

// Singleton
let instance = null;
function getLLMService() {
    if (!instance) instance = new LLMService();
    return instance;
}

module.exports = { getLLMService };
