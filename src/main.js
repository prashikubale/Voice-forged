import './style.css'

// --- State ---
const state = {
  calls: [
    { id: '1024', agent: 'Nova', status: 'Speaking', duration: 84, intent: 'Booking' },
    { id: '1025', agent: 'Atlas', status: 'Listening', duration: 12, intent: 'Support' },
    { id: '1026', agent: 'Sarah', status: 'Processing', duration: 245, intent: 'Refund' }
  ],
  stats: {
    active: 3,
    queue: 1,
    aiStatus: 'Speaking',
    escalations: 2,
    totalCalls: 1248,
    avgDurationSec: 185,
    quality: 'Good',
    peakTime: '10 AM - 1 PM'
  },
  focusedCallId: '1024',
  transcript: [
    { speaker: 'AI', text: 'Hello, welcome to Voice Forge. How can I assist you today?' },
    { speaker: 'User', text: 'I need to check my appointment status.' },
    { speaker: 'AI', text: 'I can help with that. Could you provide your booking reference?' }
  ],
  intelligence: {
    mostAsked: 'Reschedule Appointment',
    recentQuestion: 'Can I get a refund for my last order?',
    sources: [
      { label: 'Website WebRTC', value: 45, color: 'bg-emerald-500' },
      { label: 'Phone Network', value: 30, color: 'bg-blue-500' },
      { label: 'Mobile App', value: 20, color: 'bg-indigo-500' },
      { label: 'Unknown', value: 5, color: 'bg-zinc-600' }
    ],
    outcomes: [
      { label: 'Resolved by AI', value: 78, color: 'bg-emerald-400' },
      { label: 'Escalated to Human', value: 15, color: 'bg-rose-400' },
      { label: 'Caller Dropped', value: 7, color: 'bg-zinc-500' }
    ],
    geo: [
      { city: 'New York, USA', count: 324 },
      { city: 'London, UK', count: 215 },
      { city: 'San Francisco, USA', count: 189 },
      { city: 'Berlin, DE', count: 86 },
    ]
  }
};

// --- DOM Elements ---
const els = {
  stats: {
    active: document.getElementById('stat-active-calls'),
    queue: document.getElementById('stat-queue'),
    aiStatus: document.getElementById('stat-ai-status'),
    escalations: document.getElementById('stat-escalations'),
    total: document.getElementById('stat-total-calls'),
    duration: document.getElementById('stat-avg-duration'),
    mostAsked: document.getElementById('stat-most-asked'),
    recentQuestion: document.getElementById('stat-recent-question'),
    peakTime: document.getElementById('stat-peak-time'),
    quality: document.getElementById('stat-quality-score'),
  },
  containers: {
    callsTable: document.getElementById('calls-table-body'),
    callsGrid: document.getElementById('calls-grid-mobile'),
    transcriptContainer: document.getElementById('transcript-container'),
    transcriptTarget: document.getElementById('transcript-target'),
    sources: document.getElementById('analytics-sources'),
    outcomes: document.getElementById('analytics-outcomes'),
    geo: document.getElementById('analytics-geo'),
  }
};

// --- Helpers ---
const formatTime = (sec) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Listening': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'Speaking': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Processing': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'Escalated': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  }
};

const getStatusDot = (status) => {
  switch (status) {
    case 'Listening': return 'bg-blue-400';
    case 'Speaking': return 'bg-emerald-400';
    case 'Processing': return 'bg-amber-400';
    case 'Escalated': return 'bg-rose-500';
    default: return 'bg-zinc-500';
  }
}

// --- Renderers ---
function renderStats() {
  // KPI Row
  if (els.stats.active) els.stats.active.textContent = state.stats.active;
  if (els.stats.queue) els.stats.queue.textContent = state.stats.queue;
  if (els.stats.aiStatus) els.stats.aiStatus.textContent = state.stats.aiStatus;
  if (els.stats.escalations) els.stats.escalations.textContent = state.stats.escalations;
  if (els.stats.total) els.stats.total.textContent = state.stats.totalCalls.toLocaleString();
  if (els.stats.duration) els.stats.duration.textContent = formatTime(state.stats.avgDurationSec);

  // Intelligence Cards
  if (els.stats.mostAsked) els.stats.mostAsked.textContent = `"${state.intelligence.mostAsked}"`;
  if (els.stats.recentQuestion) els.stats.recentQuestion.textContent = `"${state.intelligence.recentQuestion}"`;
  if (els.stats.peakTime) els.stats.peakTime.textContent = state.stats.peakTime;
  if (els.stats.quality) {
    els.stats.quality.textContent = state.stats.quality;
    els.stats.quality.className = `text-xl font-bold mt-1 ${state.stats.quality === 'Good' ? 'text-emerald-400' : state.stats.quality === 'Average' ? 'text-amber-400' : 'text-rose-400'}`;
  }
}

function renderAnalytics() {
  // Sources
  if (els.containers.sources) {
    els.containers.sources.innerHTML = state.intelligence.sources.map(s => `
            <div class="space-y-1">
                <div class="flex justify-between text-xs text-zinc-400">
                    <span>${s.label}</span>
                    <span>${s.value}%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full ${s.color} rounded-full" style="width: ${s.value}%"></div>
                </div>
            </div>
        `).join('');
  }

  // Outcomes
  if (els.containers.outcomes) {
    els.containers.outcomes.innerHTML = state.intelligence.outcomes.map(o => `
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full ${o.color}"></span>
                <span class="flex-1 text-xs text-zinc-300">${o.label}</span>
                <span class="text-xs font-mono text-zinc-500">${o.value}%</span>
            </div>
        `).join('');
  }

  // Geo
  if (els.containers.geo) {
    els.containers.geo.innerHTML = state.intelligence.geo.map((g, i) => `
            <div class="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                <div class="flex items-center gap-2">
                    <span class="text-zinc-500 font-mono">0${i + 1}</span>
                    <span class="text-zinc-300">${g.city}</span>
                </div>
                <span class="text-zinc-400 font-medium">${g.count}</span>
            </div>
        `).join('');
  }
}

function renderCalls() {
  if (!els.containers.callsTable || !els.containers.callsGrid) return;

  // Desktop Table
  els.containers.callsTable.innerHTML = state.calls.map(call => `
        <tr class="group hover:bg-white/5 transition-colors cursor-pointer ${call.id === state.focusedCallId ? 'bg-white/5' : ''}" onclick="window.focusCall('${call.id}')">
            <td class="px-5 py-4">
               <div class="flex items-center gap-2">
                   <div class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold">${call.agent[0]}</div>
                   <span class="font-medium text-zinc-200">${call.agent}</span>
               </div>
            </td>
            <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(call.status)}">
                    <span class="w-1 h-1 rounded-full ${getStatusDot(call.status)} ${call.status === 'Processing' ? 'animate-pulse' : ''}"></span>
                    ${call.status}
                </span>
            </td>
            <td class="px-5 py-4 text-right font-mono text-zinc-400 tabular-nums text-xs">${formatTime(call.duration)}</td>
            <td class="px-5 py-4 hidden sm:table-cell text-zinc-400 text-xs">
                ${call.intent}
            </td>
        </tr>
    `).join('');

  // Mobile Cards
  els.containers.callsGrid.innerHTML = state.calls.map(call => `
        <div class="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform ${call.id === state.focusedCallId ? 'ring-1 ring-emerald-500/50' : ''}" onclick="window.focusCall('${call.id}')">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                     <span class="text-xs font-mono text-zinc-500">#${call.id}</span>
                     <p class="font-medium text-zinc-100">${call.agent}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(call.status)}">
                    ${call.status}
                </span>
            </div>
            <div class="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                <span class="text-zinc-400 text-xs uppercase tracking-wide">${call.intent}</span>
                <span class="font-mono text-zinc-300">${formatTime(call.duration)}</span>
            </div>
        </div>
    `).join('');
}

function renderTranscript() {
  if (!els.containers.transcriptTarget || !els.containers.transcriptContainer) return;

  els.containers.transcriptTarget.textContent = `CALL #${state.focusedCallId} • LIVE`;

  const html = state.transcript.map((msg, idx) => {
    const isLast = idx === state.transcript.length - 1;
    const isAI = msg.speaker === 'AI';

    return `
        <div class="flex gap-4 ${isLast ? 'animate-[slideUp_0.3s_ease-out]' : ''} ${isAI ? '' : 'flex-row-reverse'} group">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${isAI ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}">
                ${isAI ? 'AI' : 'U'}
            </div>
            <div class="flex flex-col gap-1 max-w-[85%] ${isAI ? 'items-start' : 'items-end'}">
                <span class="text-[10px] uppercase tracking-wider font-bold opacity-50 ${isAI ? 'text-emerald-500' : 'text-blue-500'} mb-0.5">${msg.speaker}</span>
                <p class="text-[15px] leading-relaxed px-3 py-2 rounded-2xl ${isAI ? 'bg-zinc-800/50 text-zinc-100 rounded-tl-none border border-white/5' : 'bg-blue-500/10 text-blue-50 rounded-tr-none border border-blue-500/10'} shadow-sm">
                    ${msg.text}
                </p>
            </div>
        </div>
    `}).join('');

  if (els.containers.transcriptContainer.innerHTML !== html) {
    els.containers.transcriptContainer.innerHTML = html + '<div class="h-1"></div>';
    els.containers.transcriptContainer.scrollTop = els.containers.transcriptContainer.scrollHeight;
  }
}

// --- Simulation Logic ---
window.focusCall = (id) => {
  if (state.focusedCallId === id) return;
  state.focusedCallId = id;
  const agent = state.calls.find(c => c.id === id)?.agent || 'Unknown';
  state.transcript = [
    { speaker: 'AI', text: `Connected to ${agent}'s stream. Retrieving context...` }
  ];
  renderCalls();
  renderTranscript();
}

function simulate() {
  // 1. Tick Durations
  state.calls.forEach(c => c.duration++);

  // 2. Randomly change status
  if (Math.random() > 0.7) {
    const c = state.calls[Math.floor(Math.random() * state.calls.length)];
    const statuses = ['Listening', 'Speaking', 'Processing'];
    c.status = statuses[Math.floor(Math.random() * statuses.length)];

    if (c.id === state.focusedCallId) {
      state.stats.aiStatus = c.status;
    }
  }

  // 3. Update Global Stats
  if (Math.random() > 0.8) {
    state.stats.totalCalls++;
    state.stats.avgDurationSec += (Math.random() > 0.5 ? 1 : -1);
  }

  // 4. Update 'Most Asked' occasionally
  if (Math.random() > 0.95) {
    const qs = ['Refund Policy', 'Account Access', 'Payment Issue', 'Tech Support', 'Plan Upgrade'];
    state.intelligence.mostAsked = qs[Math.floor(Math.random() * qs.length)];
  }

  renderStats();
  renderCalls();
}

function simulateTranscript() {
  const focusedCall = state.calls.find(c => c.id === state.focusedCallId);
  if (focusedCall?.status === 'Processing') return;

  const talker = Math.random() > 0.5 ? 'AI' : 'User';
  const phrases = {
    'AI': [
      "I understand. Let me look that up for you.",
      "Could you confirm the last 4 digits?",
      "I've processed that request successfully.",
      "Is there anything else?",
      "Connection looks stable now.",
      "I can certainly help you with your account.",
      "Please hold while I sync the data."
    ],
    'User': [
      "Yes, exactly.",
      "I'm not sure if that went through.",
      "Can we try that again?",
      "I'm calling about the premium plan.",
      "How long will this take?",
      "No, that's all for now.",
      "I'd like to update my billing address."
    ]
  };

  const text = phrases[talker][Math.floor(Math.random() * phrases[talker].length)];
  state.transcript.push({ speaker: talker, text });

  // Update Recent Question if User speaks
  if (talker === 'User') {
    state.intelligence.recentQuestion = text;
    renderStats(); // Trigger update
  }

  if (state.transcript.length > 8) state.transcript.shift();
  renderTranscript();
}

// --- Init ---
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);

// Start Loops
setInterval(simulate, 1000);
setInterval(simulateTranscript, 2500);

// Initial Render
renderStats();
renderAnalytics();
renderCalls();
renderTranscript();
