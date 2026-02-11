import { UltravoxSession, UltravoxSessionStatus } from 'ultravox-client';

// ============================================================
// Voice Agent — Frontend Real-Time Controller
// Connects: Browser Mic → UltraVox WebRTC → Conversational AI
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
    let ultravoxSession = null;
    let lastExtractedData = null;

    // ── Open / Close Modal ───────────────────────────────────────
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    function closeModal() {
        if (ultravoxSession) {
            ultravoxSession.leaveCall();
            ultravoxSession = null;
        }
        overlay.classList.remove('open');
        setTimeout(resetModal, 300);
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

    // ── Ultravox Integration ──────────────────────────────────────
    window._voiceStart = startConversation;
    if (startBtn) startBtn.onclick = startConversation;

    async function startConversation() {
        setState('connecting');
        transcriptEl.innerHTML = '';
        resultEl.classList.remove('show');

        try {
            // 1. Create session via Backend
            const response = await fetch('/api/voice/create-session', { method: 'POST' });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unspecified server error' }));
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            const result = await response.json();

            // 2. Initialize Ultravox Session
            ultravoxSession = new UltravoxSession();
            ultravoxSession.joinCall(result.data.joinUrl);

            // 3. Setup Listeners
            ultravoxSession.on('status', (status) => {
                console.log('Ultravox Status:', status);
                if (status === UltravoxSessionStatus.CONNECTED) {
                    setState('listening');
                    if (actionsEl) {
                        actionsEl.innerHTML = `
                        <button class="vm-btn vm-btn-stop" onclick="window._voiceStop()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            End AI Call
                        </button>`;
                    }
                } else if (status === UltravoxSessionStatus.DISCONNECTED) {
                    if (state !== 'done') resetModal();
                }
            });

            ultravoxSession.on('transcript', (transcript) => {
                const isAgent = transcript.role === 'agent';
                const color = isAgent ? '#22c55e' : '#cbd5e1';
                const label = isAgent ? '🤖 Agent' : '👤 You';

                transcriptEl.innerHTML += `<div style="margin-bottom: 8px; font-size: 13px;">
                    <span style="color: ${color}; font-weight: 600;">${label}:</span> 
                    <span style="color: #e2e8f0;">${transcript.text}</span>
                </div>`;
                transcriptEl.scrollTop = transcriptEl.scrollHeight;
            });

            // ── TOOL CALL HANDLING ──
            ultravoxSession.on('client_tool_call', (toolCall) => {
                if (toolCall.toolName === 'saveBooking') {
                    const data = toolCall.args;
                    console.log('AI Tool Call - Data Extracted:', data);

                    lastExtractedData = data;
                    displayResult({ extractedData: data });
                    setState('done');

                    toolCall.respond('Data sent to CRM.');

                    // Stop call after success
                    setTimeout(() => {
                        if (ultravoxSession) {
                            ultravoxSession.leaveCall();
                            ultravoxSession = null;
                        }
                    }, 5000);
                }
            });

            ultravoxSession.on('error', (err) => {
                console.error('Ultravox error:', err);
                setState('error');
            });

        } catch (err) {
            console.error('Call failed:', err);
            setState('error');
            statusEl.textContent = 'Connection Error. Is ULTRAVOX_API_KEY valid?';
        }
    }

    window._voiceStop = () => {
        if (ultravoxSession) {
            ultravoxSession.leaveCall();
            ultravoxSession = null;
        }
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

            // Pre-fill phone from extracted or target
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
