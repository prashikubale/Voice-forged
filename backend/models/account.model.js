// ============================================================
// Account Model — Tenant / API Consumer
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true,
        maxlength: 200,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false, // never return password by default
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true, // allows multiple null without unique violation
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['admin', 'tenant'],
        default: 'tenant',
    },
    lastLoginAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// ─── Pre-save: hash password ────────────────────────────────
AccountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (err) {
        next(err);
    }
});

// ─── Pre-save: auto-generate API key if missing ─────────────
AccountSchema.pre('save', function (next) {
    if (!this.apiKey) {
        this.apiKey = `vf_${crypto.randomBytes(32).toString('hex')}`;
    }
    next();
});

// ─── Instance methods ───────────────────────────────────────
AccountSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

AccountSchema.methods.regenerateApiKey = function () {
    this.apiKey = `vf_${crypto.randomBytes(32).toString('hex')}`;
    return this.save();
};

// ─── JSON serialisation — strip sensitive fields ────────────
AccountSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model('Account', AccountSchema);
