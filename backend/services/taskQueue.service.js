// ============================================================
// Task Queue Service — Durable background processing
// ============================================================

const { randomUUID } = require('crypto');
const logger = require('../utils/logger');
const { getSMSService } = require('./sms.service');

// Configurable via env
const MAX_RETRIES = parseInt(process.env.TASK_MAX_RETRIES, 10) || 3;
const MAX_QUEUE_SIZE = parseInt(process.env.TASK_MAX_QUEUE_SIZE, 10) || 500;
const BASE_BACKOFF_MS = 1000; // exponential backoff base

/**
 * In-process task queue with exponential backoff and dead-letter capture.
 *
 * MIGRATION NOTE:  When moving to multi-instance deployment, replace this
 * with BullMQ + Redis.  The public API (addTask) stays the same.
 */
class TaskQueueService {
    constructor() {
        this.queue = [];
        this.deadLetterQueue = [];
        this.isProcessing = false;
        this.stats = { queued: 0, completed: 0, failed: 0 };
        this.smsService = getSMSService();
    }

    // ─── Public API ──────────────────────────────────────────

    /**
     * Enqueues a task and kicks off processing.
     * @param {string} type   Task type identifier (e.g. SEND_SMS)
     * @param {object} data   Task payload
     * @param {object} meta   Optional metadata (correlationId, tenantId, …)
     * @returns {string}       Unique task ID
     */
    addTask(type, data, meta = {}) {
        if (this.queue.length >= MAX_QUEUE_SIZE) {
            logger.error('Task queue at capacity — rejecting task', {
                type,
                queueSize: this.queue.length,
            });
            throw new Error('Task queue is full. Please try again later.');
        }

        const taskId = `task_${randomUUID()}`;

        this.queue.push({
            id: taskId,
            type,
            data,
            meta,
            attempts: 0,
            createdAt: Date.now(),
            status: 'pending',
        });

        this.stats.queued++;
        logger.info('Task enqueued', { taskId, type, queueDepth: this.queue.length });

        // Fire-and-forget processing loop (never await — the caller returns immediately)
        this._processQueue().catch((err) => {
            logger.error('Queue processing loop crashed', { error: err.message });
        });

        return taskId;
    }

    /**
     * Returns a snapshot of queue health for monitoring endpoints.
     */
    getStats() {
        return {
            ...this.stats,
            pending: this.queue.length,
            deadLetters: this.deadLetterQueue.length,
        };
    }

    // ─── Internal Processing ─────────────────────────────────

    async _processQueue() {
        if (this.isProcessing) return; // single-threaded guard
        this.isProcessing = true;

        try {
            while (this.queue.length > 0) {
                const task = this.queue.shift();
                task.status = 'processing';
                task.attempts++;

                try {
                    logger.info('Processing task', {
                        taskId: task.id,
                        type: task.type,
                        attempt: task.attempts,
                    });

                    await this._executeTask(task);

                    task.status = 'completed';
                    this.stats.completed++;
                    logger.info('Task completed', { taskId: task.id });
                } catch (error) {
                    logger.error('Task execution failed', {
                        taskId: task.id,
                        attempt: task.attempts,
                        maxRetries: MAX_RETRIES,
                        error: error.message,
                    });

                    if (task.attempts < MAX_RETRIES) {
                        // Exponential backoff: 1s → 2s → 4s → …
                        const backoff = BASE_BACKOFF_MS * Math.pow(2, task.attempts - 1);
                        logger.info('Scheduling task retry', {
                            taskId: task.id,
                            nextAttemptIn: `${backoff}ms`,
                        });
                        task.status = 'pending';
                        await this._sleep(backoff);
                        this.queue.push(task);
                    } else {
                        task.status = 'dead';
                        task.failedAt = Date.now();
                        task.lastError = error.message;
                        this.deadLetterQueue.push(task);
                        this.stats.failed++;
                        logger.error('Task moved to dead-letter queue', { taskId: task.id });
                    }
                }
            }
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Routes a task to the correct handler.
     * Add new task types here.
     */
    async _executeTask(task) {
        switch (task.type) {
            case 'SEND_SMS':
                await this.smsService.send(task.data.intent, task.data.payload);
                break;

            case 'WEBHOOK_NOTIFY':
                // Future: POST to tenant's configured webhook URL
                logger.info('WEBHOOK_NOTIFY not implemented yet', { taskId: task.id });
                break;

            default:
                throw new Error(`Unknown task type: ${task.type}`);
        }
    }

    _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Singleton
let instance = null;
function getTaskQueueService() {
    if (!instance) instance = new TaskQueueService();
    return instance;
}

module.exports = { getTaskQueueService };
