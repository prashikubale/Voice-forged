// ============================================================
// Intent Service — Orchestrates LLM → Validate → Action
// ============================================================

const { getLLMService } = require('./llm.service');
const { getTaskQueueService } = require('./taskQueue.service');
const { validateLLMOutput } = require('../middleware/validator');
const logger = require('../utils/logger');

// Intent-to-action mapping — add new intents here
const INTENT_ACTIONS = {
    meeting_booking: async (data, taskQueue, correlationId) => {
        return taskQueue.addTask('SEND_SMS', {
            intent: 'meeting_booking',
            payload: data,
        }, { correlationId });
    },
};

class IntentService {
    constructor() {
        this.llm = getLLMService();
        this.taskQueue = getTaskQueueService();
    }

    /**
     * Full processing pipeline:  LLM → Validate → Route Action
     *
     * @param {string}      transcript  Raw voice transcript
     * @param {pino.Logger} [reqLog]    Request-scoped logger
     * @returns {Promise<object>}       Pipeline result
     */
    async processTranscript(transcript, reqLog) {
        const log = reqLog || logger;

        // Step 1: LLM extraction
        log.info('Intent pipeline started');
        const llmResult = await this.llm.processTranscript(transcript, log);

        // Step 2: Structural validation
        const validation = validateLLMOutput(llmResult);
        if (!validation.valid) {
            log.warn('LLM output validation failed', { errors: validation.errors });
            return {
                success: false,
                stage: 'validation',
                errors: validation.errors,
                llmResult,
            };
        }

        // Step 3: Should we take action?
        if (!llmResult.action_required) {
            log.info('No action required', { intent: llmResult.intent });
            return {
                success: true,
                stage: 'complete',
                actionTaken: false,
                message: 'Transcript processed — no actionable intent detected',
                llmResult,
            };
        }

        // Step 4: Route to action handler
        const actionHandler = INTENT_ACTIONS[llmResult.intent];
        if (!actionHandler) {
            log.warn('No action handler registered', { intent: llmResult.intent });
            return {
                success: true,
                stage: 'complete',
                actionTaken: false,
                message: `No action handler for intent: ${llmResult.intent}`,
                llmResult,
            };
        }

        // Step 5: Execute
        try {
            const correlationId = log.bindings?.()?.requestId || undefined;
            const taskId = actionHandler(llmResult.data, this.taskQueue, correlationId);

            log.info('Intent action dispatched', {
                intent: llmResult.intent,
                taskId,
            });

            return {
                success: true,
                stage: 'complete',
                actionTaken: true,
                message: 'Intent processed — action queued in background',
                llmResult,
                taskId,
            };
        } catch (actionError) {
            log.error('Intent action dispatch failed', {
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
