// ============================================================
// Interaction Model — Persists voice processing history
// ============================================================

const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    correlationId: {
        type: String,
        required: true,
        index: true,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        index: true,
    },
    transcript: {
        type: String,
        required: true,
        maxlength: 50000,
    },
    intent: {
        type: String,
        index: true,
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 1,
    },
    actionTaken: {
        type: Boolean,
        default: false,
    },
    extractedData: {
        type: mongoose.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'pending'],
        default: 'pending',
        index: true,
    },
    stage: {
        type: String,
        enum: ['llm', 'validation', 'action', 'complete'],
    },
    errors: {
        type: [{ type: String }],
        default: undefined,  // don't store empty array
    },
    processingTimeMs: {
        type: Number,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
});

// ─── Compound Indexes for Analytics Queries ──────────────────
InteractionSchema.index({ tenantId: 1, createdAt: -1 });
InteractionSchema.index({ intent: 1, status: 1, createdAt: -1 });

// ─── TTL Index — auto-delete interactions older than 90 days ─
// This can be overridden via INTERACTION_TTL_DAYS env var
InteractionSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: (parseInt(process.env.INTERACTION_TTL_DAYS, 10) || 90) * 86400 }
);

// ─── Static helper for safe, fire-and-forget persistence ─────
InteractionSchema.statics.record = function (data, log) {
    return this.create(data).catch((err) => {
        (log || console).error?.('Failed to persist interaction', { error: err.message });
    });
};

module.exports = mongoose.model('Interaction', InteractionSchema);
