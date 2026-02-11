// ============================================================
// SMS Service — Twilio-powered message delivery
// ============================================================

const logger = require('../utils/logger');

class SMSService {
    constructor() {
        this.accountSid = process.env.SMS_ACCOUNT_SID;
        this.authToken = process.env.SMS_AUTH_TOKEN;
        this.fromNumber = process.env.SMS_FROM_NUMBER;
        this.toNumber = process.env.SMS_TO_NUMBER;

        if (!this.accountSid || !this.authToken || !this.fromNumber || !this.toNumber) {
            logger.warn('SMS credentials not fully configured — SMS sending disabled');
            this.client = null;
            return;
        }

        try {
            const twilio = require('twilio');
            this.client = twilio(this.accountSid, this.authToken);
            logger.info('SMS service initialized');
        } catch (err) {
            logger.error('Failed to initialize Twilio client', { error: err.message });
            this.client = null;
        }
    }

    formatMeetingMessage(data) {
        const lines = [
            '📅 NEW MEETING REQUEST',
            '━━━━━━━━━━━━━━━━━━━━━',
            `Name: ${data.full_name || 'N/A'}`,
            `Phone: ${data.phone_number || 'N/A'}`,
            `Email: ${data.email || 'N/A'}`,
            `Date: ${data.preferred_date || 'N/A'}`,
            `Time: ${data.preferred_time || 'N/A'}`,
            `Purpose: ${data.purpose_of_meeting || 'N/A'}`,
        ];
        if (data.additional_notes) {
            lines.push(`Notes: ${data.additional_notes}`);
        }
        lines.push('━━━━━━━━━━━━━━━━━━━━━');
        lines.push('Via Voice Forge AI Agent');
        return lines.join('\n');
    }

    formatMessage(intent, data) {
        switch (intent) {
            case 'meeting_booking':
                return this.formatMeetingMessage(data);
            default:
                return `Voice Forge Alert\nIntent: ${intent}\nData: ${JSON.stringify(data)}`;
        }
    }

    async send(intent, data) {
        const message = this.formatMessage(intent, data);

        if (!this.client) {
            logger.warn('SMS client not available — simulating send', { intent });
            // In development, log what would be sent
            logger.info('SMS would be sent', { to: this.toNumber, messageLength: message.length });
            return {
                success: true,
                simulated: true,
                message: 'SMS simulated (no credentials configured)',
                sid: `SIM_${Date.now()}`,
            };
        }

        try {
            logger.info('Sending SMS', { to: this.toNumber, intent });

            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: this.toNumber,
            });

            logger.info('SMS sent successfully', { sid: result.sid, status: result.status });

            return {
                success: true,
                simulated: false,
                sid: result.sid,
                status: result.status,
            };
        } catch (error) {
            logger.error('SMS sending failed', { error: error.message, code: error.code });
            throw new Error(`SMS delivery failed: ${error.message}`);
        }
    }
}

// Singleton
let instance = null;
function getSMSService() {
    if (!instance) instance = new SMSService();
    return instance;
}

module.exports = { getSMSService };
