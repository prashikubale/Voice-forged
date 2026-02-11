// ============================================================
// Intent Service — Orchestrates LLM → Validate → Action
// ============================================================

const { getLLMService } = require('./llm.service');
const { getSMSService } = require('./sms.service');
const { validateLLMOutput } = require('../middleware/validator');
const logger = require('../utils/logger');

// Intent-to-action mapping — easily extensible
const INTENT_ACTIONS = {
    meeting_booking: async (data, smsService) => {
        return await smsService.send('meeting_booking', data);
    },
    // Future intents:
    // callback_request: async (data, smsService) => { ... },
    // service_inquiry: async (data, smsService) => { ... },
};

class IntentService {
    constructor() {
        this.llm = getLLMService();
        this.sms = getSMSService();
    }

    async processTranscript(transcript) {
        // Step 1: LLM extraction
        logger.info('Intent processing started');
        const llmResult = await this.llm.processTranscript(transcript);

        // Step 2: Validate LLM output
        const validation = validateLLMOutput(llmResult);
        if (!validation.valid) {
            logger.warn('LLM output validation failed', { errors: validation.errors });
            return {
                success: false,
                stage: 'validation',
                errors: validation.errors,
                llmResult,
            };
        }

        // Step 3: Check if action is required
        if (!llmResult.action_required) {
            logger.info('No action required', { intent: llmResult.intent });
            return {
                success: true,
                stage: 'complete',
                actionTaken: false,
                message: 'Transcript processed — no actionable intent detected',
                llmResult,
            };
        }

        // Step 4: Execute intent action
        const actionHandler = INTENT_ACTIONS[llmResult.intent];
        if (!actionHandler) {
            logger.warn('No action handler for intent', { intent: llmResult.intent });
            return {
                success: true,
                stage: 'complete',
                actionTaken: false,
                message: `No action handler registered for intent: ${llmResult.intent}`,
                llmResult,
            };
        }

        try {
            const actionResult = await actionHandler(llmResult.data, this.sms);
            logger.info('Intent action completed', {
                intent: llmResult.intent,
                actionSuccess: actionResult.success,
            });

            return {
                success: true,
                stage: 'complete',
                actionTaken: true,
                message: 'Meeting details processed and sent successfully',
                llmResult,
                actionResult,
            };
        } catch (actionError) {
            logger.error('Intent action failed', {
                intent: llmResult.intent,
                error: actionError.message,
            });
            return {
                success: false,
                stage: 'action',
                error: actionError.message,
                llmResult,
            };
        }
    }
}

// Singleton
let instance = null;
function getIntentService() {
    if (!instance) instance = new IntentService();
    return instance;
}

module.exports = { getIntentService };
