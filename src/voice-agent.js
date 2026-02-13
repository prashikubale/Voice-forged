import { UltravoxSession, UltravoxSessionStatus } from 'ultravox-client';
import { Conversation } from '@elevenlabs/client';

// ============================================================
// Voice Agent — Frontend Real-Time Controller
// Supports: UltraVox (primary) → ElevenLabs (fallback) → Demo
// ============================================================

const overlay = document.getElementById('vmOverlay');

if (overlay) {
    // ── DOM Elements ─────────────────────────────────────────────
    const closeBtn = document.getElementById('vmClose');
    const orb = document.getElementById('vmOrb');
    const wave = document.getElementById('vmWave');
    const statusEl = document.getElementById('vmStatus');
    const transcriptEl = document.getElementById('vmTranscript');
    const resultEl = document.getElementById('vmResult');
    const resultDataEl = document.getElementById('vmResultData');
    const actionsEl = document.getElementById('vmActions');
    const startBtn = document.getElementById('vmStart');
    const waSection = document.getElementById('vmWaSection');
    const waInput = document.getElementById('vmWaInput');
    const waSendBtn = document.getElementById('vmWaSend');

    // ── State ────────────────────────────────────────────────────
    let state = 'idle';
    let activeSession = null; // UltravoxSession or ElevenLabs Conversation
    let activeMode = null;    // 'ultravox' | 'elevenlabs' | 'demo'
    let lastExtractedData = null;

    // ── Open / Close Modal ───────────────────────────────────────
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    function closeModal() {
        endActiveSession();
        overlay.classList.remove('open');
        setTimeout(resetModal, 300);
    }

    function endActiveSession() {
        if (!activeSession) return;
        try {
            if (activeMode === 'ultravox') {
                activeSession.leaveCall();
            } else if (activeMode === 'elevenlabs') {
                activeSession.endSession();
            }
        } catch (e) {
            console.warn('Error ending session:', e);
        }
        activeSession = null;
        activeMode = null;
    }

    function resetModal() {
        setState('idle');
        transcriptEl.innerHTML = '';
        resultEl.classList.remove('show');
        waSection.classList.remove('show');
        waInput.value = '';
        resultDataEl.innerHTML = '';
        lastExtractedData = null;

        if (actionsEl) {
            actionsEl.innerHTML = `
            <button class="vm-btn vm-btn-start" id="vmStart" onclick="window._voiceStart()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
                Start AI Call
            </button>`;
        }
    }

    // ── State Machine ────────────────────────────────────────────
    function setState(newState) {
        state = newState;
        orb.className = 'vm-orb';
        statusEl.className = 'vm-status';
        wave.classList.remove('active');

        switch (newState) {
            case 'idle':
                statusEl.textContent = 'Click Start to begin real-time AI conversation';
                break;
            case 'connecting':
                orb.classList.add('processing');
                statusEl.textContent = 'Contacting AI agent...';
                break;
            case 'listening':
                orb.classList.add('listening');
                wave.classList.add('active');
                statusEl.textContent = 'AI Agent is Online. Speak naturally.';
                statusEl.classList.add('active');
                break;
            case 'done':
                orb.classList.add('done');
                statusEl.textContent = 'Meeting details confirmed by AI!';
                break;
            case 'error':
                orb.classList.add('error');
                statusEl.classList.add('error');
                statusEl.textContent = 'AI Agent Busy or Key Invalid.';
                break;
        }
    }

    // ── Provider Badge ───────────────────────────────────────────
    function showProviderBadge(mode) {
        const badge = mode === 'elevenlabs' ? '🔊 ElevenLabs' : '🎙️ UltraVox';
        const color = mode === 'elevenlabs' ? '#8b5cf6' : '#22d3ee';
        statusEl.innerHTML = `<span style="color:${color};font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:800;">${badge}</span><br>AI Agent is Online. Speak naturally.`;
    }

    // ── Main Entry Point ─────────────────────────────────────────
    window._voiceStart = startConversation;
    if (startBtn) startBtn.onclick = startConversation;

    async function startConversation() {
        setState('connecting');
        transcriptEl.innerHTML = '';
        resultEl.classList.remove('show');

        try {
            // 1. Ask backend which provider to use
            const response = await fetch('/api/voice/create-session', { method: 'POST' });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unspecified server error' }));
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            const result = await response.json();
            const mode = result.data.mode;
            activeMode = mode;

            // 2. Route to appropriate provider
            if (mode === 'ultravox') {
                await startUltravox(result.data);
            } else if (mode === 'elevenlabs') {
                await startElevenLabs(result.data);
            } else {
                // Demo mode
                setState('listening');
                showProviderBadge('demo');
                statusEl.innerHTML = `<span style="color:#f59e0b;font-size:10px;letter-spacing:1px;text-transform:uppercase;font-weight:800;">⚠️ DEMO MODE</span><br>No voice API keys configured. Set ULTRAVOX_API_KEY or ELEVENLABS_API_KEY + ELEVENLABS_AGENT_ID in backend .env`;
                transcriptEl.innerHTML = `<div style="color:#f59e0b;font-size:12px;padding:8px;">Demo mode active — configure API keys in backend/.env to enable live voice AI.</div>`;
            }

        } catch (err) {
            console.error('Call failed:', err);
            setState('error');
            statusEl.textContent = err.message || 'Connection Error. Check API keys.';
        }
    }

    // ══════════════════════════════════════════════════════════════
    // PROVIDER 1: UltraVox
    // ══════════════════════════════════════════════════════════════
    async function startUltravox(data) {
        const session = new UltravoxSession();
        activeSession = session;
        session.joinCall(data.joinUrl);

        session.on('status', (status) => {
            console.log('Ultravox Status:', status);
            if (status === UltravoxSessionStatus.CONNECTED) {
                setState('listening');
                showProviderBadge('ultravox');
                showEndButton();
            } else if (status === UltravoxSessionStatus.DISCONNECTED) {
                if (state !== 'done') resetModal();
            }
        });

        session.on('transcript', (transcript) => {
            appendTranscript(transcript.role === 'agent', transcript.text);
        });

        session.on('client_tool_call', (toolCall) => {
            if (toolCall.toolName === 'saveBooking') {
                handleBookingData(toolCall.args);
                toolCall.respond('Data sent to CRM.');
                setTimeout(() => { endActiveSession(); }, 5000);
            }
        });

        session.on('error', (err) => {
            console.error('Ultravox error:', err);
            setState('error');
        });
    }

    // ══════════════════════════════════════════════════════════════
    // PROVIDER 2: ElevenLabs Conversational AI
    // ══════════════════════════════════════════════════════════════
    async function startElevenLabs(data) {
        try {
            const conversation = await Conversation.startSession({
                signedUrl: data.signedUrl,
                onConnect: () => {
                    console.log('ElevenLabs connected');
                    setState('listening');
                    showProviderBadge('elevenlabs');
                    showEndButton();
                },
                onDisconnect: () => {
                    console.log('ElevenLabs disconnected');
                    if (state !== 'done') resetModal();
                },
                onError: (error) => {
                    console.error('ElevenLabs error:', error);
                    setState('error');
                    statusEl.textContent = 'ElevenLabs connection error.';
                },
                onMessage: (message) => {
                    console.log('ElevenLabs message:', message);
                    // Handle transcript messages
                    if (message.type === 'transcript' || message.type === 'agent_response') {
                        const isAgent = message.role === 'agent' || message.type === 'agent_response';
                        const text = message.text || message.message || '';
                        if (text) appendTranscript(isAgent, text);
                    }
                },
                clientTools: {
                    saveBooking: async (params) => {
                        handleBookingData(params);
                        setTimeout(() => { endActiveSession(); }, 5000);
                        return 'Booking data captured successfully.';
                    },
                },
            });

            activeSession = conversation;

        } catch (err) {
            console.error('ElevenLabs session failed:', err);
            setState('error');
            statusEl.textContent = 'Failed to connect to ElevenLabs. Check Agent ID.';
        }
    }

    // ══════════════════════════════════════════════════════════════
    // SHARED HELPERS
    // ══════════════════════════════════════════════════════════════
    function appendTranscript(isAgent, text) {
        const color = isAgent ? '#22c55e' : '#cbd5e1';
        const label = isAgent ? '🤖 Agent' : '👤 You';
        transcriptEl.innerHTML += `<div style="margin-bottom: 8px; font-size: 13px;">
            <span style="color: ${color}; font-weight: 600;">${label}:</span> 
            <span style="color: #e2e8f0;">${text}</span>
        </div>`;
        transcriptEl.scrollTop = transcriptEl.scrollHeight;
    }

    function showEndButton() {
        if (actionsEl) {
            actionsEl.innerHTML = `
            <button class="vm-btn vm-btn-stop" onclick="window._voiceStop()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                End AI Call
            </button>`;
        }
    }

    function handleBookingData(data) {
        console.log('AI Tool Call - Data Extracted:', data);
        lastExtractedData = data;
        displayResult({ extractedData: data });
        setState('done');
    }

    window._voiceStop = () => {
        endActiveSession();
        if (state !== 'done') resetModal();
    };

    // ── Display Extracted Data ───────────────────────────────────
    function displayResult(data) {
        if (!data.extractedData) return;

        const fields = {
            full_name: 'Full Name',
            phone_number: 'Phone Number',
            email: 'Email',
            preferred_date: 'Preferred Date',
            preferred_time: 'Preferred Time',
            purpose_of_meeting: 'Purpose',
            additional_notes: 'Additional Notes',
        };

        let html = '';
        for (const [key, label] of Object.entries(fields)) {
            const value = data.extractedData[key];
            if (value) {
                html += `<div class="vm-result-row">
                    <span class="vm-result-key">${label}</span>
                    <span class="vm-result-val">${value}</span>
                </div>`;
            }
        }

        if (html) {
            resultDataEl.innerHTML = html;
            resultEl.classList.add('show');
            waSection.classList.add('show');

            if (data.targetNumber) {
                waInput.value = data.targetNumber;
            } else if (data.extractedData.phone_number) {
                waInput.value = data.extractedData.phone_number;
            }
        }
    }

    // ── WhatsApp Handler ─────────────────────────────────────────
    waSendBtn.addEventListener('click', () => {
        const rawNumber = waInput.value;
        if (!rawNumber || rawNumber.length < 5) {
            alert('Please enter a valid phone number');
            return;
        }

        if (!lastExtractedData) return;

        const d = lastExtractedData;
        const text = `📅 *NEW MEETING REQUEST*
━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* ${d.full_name || 'N/A'}
📞 *Phone:* ${d.phone_number || 'N/A'}
📧 *Email:* ${d.email || 'N/A'}
🗓 *Date:* ${d.preferred_date || 'N/A'}
⏰ *Time:* ${d.preferred_time || 'N/A'}
📝 *Purpose:* ${d.purpose_of_meeting || 'N/A'}
${d.additional_notes ? `ℹ️ *Notes:* ${d.additional_notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━
_Sent via Voice Forge Intelligence_`;

        const cleanNumber = rawNumber.replace(/[^\d+]/g, '');
        const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    });

    // ── Keyboard shortcut ────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeModal();
        }
    });
}
