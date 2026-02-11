// ============================================================
// LLM Service — Gemini-powered transcript processing
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

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
            this.client = null;
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        this.client = true;
    }

    async processTranscript(transcript) {
        if (!this.client) {
            throw new Error('LLM service not configured — missing API key');
        }

        logger.info('Processing transcript with LLM', { transcriptLength: transcript.length });

        try {
            const result = await this.model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nTRANSCRIPT:\n${transcript}` }] },
                ],
                generationConfig: {
                    temperature: 0.1,
                    topP: 0.8,
                    maxOutputTokens: 1024,
                    responseMimeType: 'application/json',
                },
            });

            const responseText = result.response.text().trim();
            logger.debug('Raw LLM response received', { responseLength: responseText.length });

            // Parse and validate JSON
            let parsed;
            try {
                parsed = JSON.parse(responseText);
            } catch (parseError) {
                // Try to extract JSON from response if wrapped in markdown
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('LLM returned non-JSON response');
                }
            }

            logger.info('LLM processing complete', {
                intent: parsed.intent,
                confidence: parsed.confidence_score,
                actionRequired: parsed.action_required,
            });

            return parsed;
        } catch (error) {
            logger.error('LLM processing failed', { error: error.message });
            throw new Error(`LLM processing failed: ${error.message}`);
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
