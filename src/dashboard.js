// ============================================================
// Voice Forge — Full SPA Dashboard Engine
// 7 Pages · Rich Mock Data · Enterprise Grade
// ============================================================

let activePage = 'overview';
let activeChart = 'volume';
const PAGE = document.getElementById('pageContent');

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const D = {
    kpis: [
        { id: 'volume', label: 'Total Calls', value: '12,847', trend: '+18.3%', up: true, desc: 'vs previous period', iconClass: 'emerald', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>', spark: Array.from({ length: 24 }, (_, i) => 40 + 50 * Math.sin(i / 3.5) + Math.random() * 20), sparkColor: '#10b981' },
        { id: 'sentiment', label: 'Avg Sentiment', value: '9.2', unit: '/10', trend: '+4.7%', up: true, desc: 'customer satisfaction', iconClass: 'cyan', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>', spark: Array.from({ length: 24 }, () => 60 + Math.random() * 35), sparkColor: '#06b6d4' },
        { id: 'resolution', label: 'Resolution Rate', value: '96.4', unit: '%', trend: '+2.1%', up: true, desc: 'first-contact resolution', iconClass: 'emerald', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>', spark: Array.from({ length: 24 }, () => 70 + Math.random() * 28), sparkColor: '#10b981' },
        { id: 'avgtime', label: 'Avg Handle Time', value: '2:18', trend: '-12.4%', up: false, desc: 'mins · ↓ is better', iconClass: 'amber', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>', spark: Array.from({ length: 24 }, () => 20 + Math.random() * 55), sparkColor: '#f59e0b' },
    ],
    volume: Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * 24; return Math.max(15, 80 + 65 * Math.sin((t - 10) / 3.2) + 40 * Math.cos((t - 16) / 2.1) + (Math.random() - 0.5) * 30); }),
    volumePrev: Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * 24; return Math.max(10, 65 + 50 * Math.sin((t - 9) / 3) + 30 * Math.cos((t - 15) / 2.5) + (Math.random() - 0.5) * 25); }),
    sentiment: Array.from({ length: 48 }, () => 68 + Math.random() * 28),
    topics: [
        { label: 'Refund Requests', value: 1240, pct: '28%', color: '#f59e0b' }, { label: 'Login & Auth Issues', value: 890, pct: '20%', color: '#06b6d4' },
        { label: 'Billing Inquiries', value: 720, pct: '16%', color: '#a1a1aa' }, { label: 'Product Questions', value: 580, pct: '13%', color: '#10b981' },
        { label: 'Shipping & Delivery', value: 410, pct: '9%', color: '#38bdf8' }, { label: 'Account Changes', value: 340, pct: '8%', color: '#8b5cf6' },
        { label: 'Technical Support', value: 280, pct: '6%', color: '#f472b6' },
    ],
    metrics: [
        { label: 'Escalation Rate', value: '3.2%', bar: 3.2, color: '#10b981', sub: '↓ 0.8% from last week' },
        { label: 'Avg Words / Call', value: '847', bar: 84.7, color: '#06b6d4', sub: 'Optimal conversation length' },
        { label: 'Intent Accuracy', value: '97.8%', bar: 97.8, color: '#10b981', sub: 'NLU classification rate' },
        { label: 'Containment Rate', value: '89.3%', bar: 89.3, color: '#34d399', sub: 'Calls resolved by AI' },
        { label: 'Transfer Rate', value: '6.7%', bar: 6.7, color: '#f59e0b', sub: 'Escalated to human' },
        { label: 'Avg Wait Time', value: '0.4s', bar: 4, color: '#10b981', sub: 'Queue latency' },
    ],
    agents: [
        { name: 'Agent Nova', avatar: 'N', bg: '#10b981', status: 'on', calls: 1842, csat: 98, score: 99, role: 'Senior · Voice', current: 'Refund call with Sarah C.', avgTime: '2:12', lang: 'EN, ES' },
        { name: 'Agent Horizon', avatar: 'H', bg: '#06b6d4', status: 'on', calls: 1654, csat: 97, score: 96, role: 'Senior · Voice', current: 'Billing inquiry', avgTime: '2:34', lang: 'EN, FR' },
        { name: 'Agent Pulse', avatar: 'P', bg: '#f59e0b', status: 'busy', calls: 1520, csat: 95, score: 94, role: 'Mid · Voice', current: 'Account recovery', avgTime: '2:48', lang: 'EN' },
        { name: 'Agent Vertex', avatar: 'V', bg: '#38bdf8', status: 'on', calls: 1380, csat: 93, score: 91, role: 'Mid · Voice', current: null, avgTime: '3:02', lang: 'EN, DE' },
        { name: 'Agent Echo', avatar: 'E', bg: '#a1a1aa', status: 'on', calls: 1210, csat: 92, score: 89, role: 'Junior · Voice', current: null, avgTime: '3:15', lang: 'EN' },
        { name: 'Agent Drift', avatar: 'D', bg: '#8b5cf6', status: 'off', calls: 985, csat: 90, score: 86, role: 'Junior · Voice', current: null, avgTime: '3:40', lang: 'EN, JA' },
        { name: 'Agent Flux', avatar: 'F', bg: '#f472b6', status: 'on', calls: 870, csat: 88, score: 83, role: 'Junior · Chat', current: null, avgTime: '4:05', lang: 'EN' },
        { name: 'Agent Prism', avatar: 'PR', bg: '#22d3ee', status: 'on', calls: 760, csat: 91, score: 88, role: 'Mid · Voice', current: 'Shipping inquiry', avgTime: '2:55', lang: 'EN, PT' },
        { name: 'Agent Zenith', avatar: 'Z', bg: '#34d399', status: 'busy', calls: 690, csat: 89, score: 85, role: 'Senior · Chat', current: 'Plan upgrade', avgTime: '3:20', lang: 'EN, KO' },
        { name: 'Agent Orbit', avatar: 'O', bg: '#fb923c', status: 'on', calls: 620, csat: 87, score: 82, role: 'Junior · Voice', current: null, avgTime: '3:50', lang: 'EN' },
        { name: 'Agent Wave', avatar: 'W', bg: '#818cf8', status: 'off', calls: 550, csat: 85, score: 80, role: 'Junior · Chat', current: null, avgTime: '4:10', lang: 'EN' },
        { name: 'Agent Spark', avatar: 'S', bg: '#fbbf24', status: 'on', calls: 480, csat: 86, score: 81, role: 'Mid · Voice', current: null, avgTime: '3:35', lang: 'EN, HI' },
    ],
    calls: [
        { name: 'Sarah Chen', topic: 'Refund — Order #84291 · Visa ****4821', dur: '4:12', time: '32s ago', type: 'in', score: 9.4, agent: 'Agent Nova', sentiment: 94 },
        { name: 'Marcus Webb', topic: 'Account unlock · 2FA failure', dur: '2:38', time: '1m ago', type: 'in', score: 8.7, agent: 'Agent Horizon', sentiment: 87 },
        { name: 'Emily Rodriguez', topic: 'Plan upgrade · Enterprise → Scale', dur: '5:44', time: '3m ago', type: 'out', score: 9.8, agent: 'Agent Pulse', sentiment: 98 },
        { name: 'James Okoro', topic: 'API rate limit inquiry · Tier 2', dur: '1:55', time: '4m ago', type: 'in', score: 7.2, agent: 'Agent Vertex', sentiment: 72 },
        { name: 'Ava Petrov', topic: 'Shipping delay — Tracking #9X2K4', dur: '3:20', time: '6m ago', type: 'in', score: 8.9, agent: 'Agent Echo', sentiment: 89 },
        { name: 'David Kim', topic: 'Feature request · Webhook callbacks', dur: '6:15', time: '8m ago', type: 'out', score: 9.1, agent: 'Agent Nova', sentiment: 91 },
        { name: 'Lisa Nakamura', topic: 'Invoice discrepancy — Q4 billing', dur: '4:48', time: '11m ago', type: 'in', score: 8.3, agent: 'Agent Prism', sentiment: 83 },
        { name: 'Tom Andersen', topic: 'Missed callback · follow-up needed', dur: '0:00', time: '14m ago', type: 'miss', score: null, agent: '—', sentiment: 0 },
        { name: 'Priya Sharma', topic: 'Onboarding walkthrough · New team', dur: '8:22', time: '18m ago', type: 'out', score: 9.6, agent: 'Agent Zenith', sentiment: 96 },
        { name: 'Carlos Mendez', topic: 'Password reset · SSO config error', dur: '1:42', time: '22m ago', type: 'in', score: 8.0, agent: 'Agent Spark', sentiment: 80 },
        { name: 'Rachel Torres', topic: 'Contract renewal — Annual plan', dur: '7:05', time: '28m ago', type: 'out', score: 9.3, agent: 'Agent Horizon', sentiment: 93 },
        { name: 'Kevin Liu', topic: 'Data export request · GDPR compliance', dur: '3:55', time: '35m ago', type: 'in', score: 8.5, agent: 'Agent Flux', sentiment: 85 },
    ],
    conversations: [
        { caller: 'Sarah Chen', time: '32s ago', preview: 'Agent: I\'d be happy to help with your refund. Let me pull up order #84291... I can see the charge of $149.99. I\'ll process that refund right away.', tags: ['Refund', 'Positive'], intent: 'refund_request', sentiment: 'Positive', dur: '4:12', words: 847, agent: 'Nova' },
        { caller: 'Marcus Webb', time: '1m ago', preview: 'Caller: I\'ve been locked out of my account for 2 hours. The 2FA code keeps saying invalid. Agent: I understand the frustration. Let me verify your identity...', tags: ['Auth', 'Neutral'], intent: 'account_unlock', sentiment: 'Neutral', dur: '2:38', words: 523, agent: 'Horizon' },
        { caller: 'Emily Rodriguez', time: '3m ago', preview: 'Agent: Great news! I can upgrade your plan from Enterprise to Scale right now. You\'ll get access to unlimited agents and priority support...', tags: ['Upgrade', 'Very Positive'], intent: 'plan_change', sentiment: 'Very Positive', dur: '5:44', words: 1102, agent: 'Pulse' },
        { caller: 'James Okoro', time: '4m ago', preview: 'Caller: We\'re hitting the 1000 req/min limit on our API. Is there a way to increase this? Agent: For Tier 2, I can submit an increase request...', tags: ['API', 'Neutral'], intent: 'rate_limit', sentiment: 'Neutral', dur: '1:55', words: 412, agent: 'Vertex' },
        { caller: 'Ava Petrov', time: '6m ago', preview: 'Caller: My package was supposed to arrive yesterday. Tracking shows it\'s stuck in transit. Agent: Let me check tracking #9X2K4 for you...', tags: ['Shipping', 'Slightly Negative'], intent: 'order_status', sentiment: 'Slightly Negative', dur: '3:20', words: 678, agent: 'Echo' },
        { caller: 'David Kim', time: '8m ago', preview: 'Caller: We need webhook support for real-time event notifications. Is this on the roadmap? Agent: Yes! We\'re launching webhooks in v4.3...', tags: ['Feature Request', 'Positive'], intent: 'feature_inquiry', sentiment: 'Positive', dur: '6:15', words: 1340, agent: 'Nova' },
        { caller: 'Lisa Nakamura', time: '11m ago', preview: 'Caller: There\'s a discrepancy in our Q4 invoice. We were charged for 15 seats but only have 12. Agent: I\'ll review the billing records...', tags: ['Billing', 'Neutral'], intent: 'billing_dispute', sentiment: 'Neutral', dur: '4:48', words: 920, agent: 'Prism' },
        { caller: 'Priya Sharma', time: '18m ago', preview: 'Agent: Welcome to Voice Forge! Let me walk your team through the dashboard setup. First, we\'ll configure your agent profiles...', tags: ['Onboarding', 'Very Positive'], intent: 'onboarding', sentiment: 'Very Positive', dur: '8:22', words: 1890, agent: 'Zenith' },
    ],
    workflows: [
        { name: 'Refund Processing', desc: 'Validates refund eligibility, checks order status, processes payment reversal, and sends confirmation email.', trigger: 'Intent: Refund', steps: ['Verify Order', 'Check Policy', 'Process Refund', 'Send Email'], runs: '3,240', success: 94, avgTime: '45s', color: '#10b981', lastRun: '2m ago' },
        { name: 'Account Recovery', desc: 'Multi-factor identity verification, credential reset, and security audit logging for compromised accounts.', trigger: 'Intent: Account Lock', steps: ['ID Verify', 'Reset Creds', 'Security Log', 'Notify User'], runs: '1,890', success: 98, avgTime: '62s', color: '#06b6d4', lastRun: '5m ago' },
        { name: 'Order Status Check', desc: 'Real-time shipment tracking via carrier APIs. Returns current location, ETA, and delivery confirmation.', trigger: 'Intent: Where Is My Order', steps: ['Lookup Order', 'Query Carrier', 'Format Response'], runs: '5,120', success: 99, avgTime: '12s', color: '#34d399', lastRun: '18s ago' },
        { name: 'Plan Upgrade Flow', desc: 'Handles subscription tier migrations, prorated billing calculations, and feature provisioning.', trigger: 'Intent: Upgrade', steps: ['Current Plan', 'Calculate Cost', 'Provision', 'Confirm'], runs: '680', success: 91, avgTime: '90s', color: '#f59e0b', lastRun: '12m ago' },
        { name: 'Complaint Escalation', desc: 'AI-powered triage system that evaluates severity, assigns priority, and routes to the best available human agent.', trigger: 'Sentiment < 40%', steps: ['Analyze Mood', 'Assign Priority', 'Select Agent', 'Transfer'], runs: '420', success: 87, avgTime: '28s', color: '#f87171', lastRun: '8m ago' },
        { name: 'CSAT Survey Collection', desc: 'Post-call satisfaction survey via SMS/email. Collects NPS score and free-text feedback for analysis.', trigger: 'Call Ended', steps: ['Wait 5min', 'Send Survey', 'Collect Score', 'Store Data'], runs: '8,950', success: 96, avgTime: 'N/A', color: '#38bdf8', lastRun: '1m ago' },
    ],
    health: [
        { label: 'API Latency', value: '23ms', sub: 'p99 · US-East', ok: true }, { label: 'STT Accuracy', value: '99.2%', sub: 'Speech-to-Text', ok: true },
        { label: 'TTS Quality', value: '4.8/5', sub: 'MOS Score', ok: true }, { label: 'Uptime', value: '99.99%', sub: 'Last 90 days', ok: true },
        { label: 'Active Sessions', value: '2,847', sub: 'Concurrent calls', ok: true }, { label: 'Queue Depth', value: '12', sub: 'Waiting callers', ok: true },
        { label: 'Model Version', value: 'v4.2.1', sub: 'LLM Engine', ok: true }, { label: 'Memory Usage', value: '67%', sub: 'Cluster avg', ok: false },
    ],
    reports: [
        { title: 'Weekly Performance', period: 'Feb 3 — Feb 9, 2026', metrics: [{ l: 'Total Calls', v: '89,420', c: '+14.2%', up: true }, { l: 'Avg CSAT', v: '9.1/10', c: '+3.8%', up: true }, { l: 'Resolution Rate', v: '95.8%', c: '+1.2%', up: true }, { l: 'Avg Handle Time', v: '2:24', c: '-8.5%', up: false }] },
        { title: 'Monthly Summary', period: 'January 2026', metrics: [{ l: 'Total Calls', v: '384,210', c: '+22.7%', up: true }, { l: 'Containment', v: '91.2%', c: '+4.1%', up: true }, { l: 'Escalations', v: '3.1%', c: '-0.9%', up: false }, { l: 'Cost Savings', v: '$142K', c: '+31%', up: true }] },
        { title: 'Agent Efficiency', period: 'Last 30 Days', metrics: [{ l: 'Active Agents', v: '12', c: '+2', up: true }, { l: 'Avg Score', v: '89.4', c: '+5.2%', up: true }, { l: 'Calls/Agent', v: '1,280', c: '+12%', up: true }, { l: 'Idle Time', v: '4.2%', c: '-2.1%', up: false }] },
        { title: 'Revenue Impact', period: 'Q4 2025 vs Q3', metrics: [{ l: 'Retained Revenue', v: '$2.4M', c: '+18%', up: true }, { l: 'Upsell Rate', v: '12.8%', c: '+3.5%', up: true }, { l: 'Churn Prevented', v: '847', c: '+42%', up: true }, { l: 'ROI', v: '340%', c: '+85%', up: true }] },
    ],
};

// ═══════════════════════════════════════════════════════════
// SVG UTILS
// ═══════════════════════════════════════════════════════════
function svgP(data, h, w) { const mx = Math.max(...data) * 1.12; const s = w / (data.length - 1); return data.map((v, i) => { const x = (i * s).toFixed(1), y = (h - (v / mx) * h).toFixed(1); return (i === 0 ? 'M ' : 'L ') + x + ',' + y; }).join(' '); }
function svgA(data, h, w) { return svgP(data, h, w) + ` L ${w},${h} L 0,${h} Z`; }
function sparkSVG(el, data, color) { if (!el) return; el.innerHTML = ''; const w = 120, h = 44; const a = document.createElementNS('http://www.w3.org/2000/svg', 'path'); a.setAttribute('d', svgA(data, h, w)); a.setAttribute('fill', color); a.setAttribute('opacity', '0.12'); el.appendChild(a); const l = document.createElementNS('http://www.w3.org/2000/svg', 'path'); l.setAttribute('d', svgP(data, h, w)); l.setAttribute('fill', 'none'); l.setAttribute('stroke', color); l.setAttribute('stroke-width', '1.5'); l.setAttribute('stroke-linecap', 'round'); el.appendChild(l); }

// ═══════════════════════════════════════════════════════════
// PAGE RENDERERS
// ═══════════════════════════════════════════════════════════

// ---------- OVERVIEW ----------
function pageOverview() {
    let h = `<div class="kpi-row" id="kpiRow"></div>`;
    h += `<div class="chart-panel fu fu5"><div class="ch-head"><div><div class="ch-title" id="chTitle">Call Volume Trends</div><div class="ch-desc" id="chDesc">Hourly inbound & outbound calls</div></div><div class="ch-tabs"><button class="ch-tab active" data-chart="volume">Volume</button><button class="ch-tab" data-chart="sentiment">Sentiment</button><button class="ch-tab" data-chart="topics">Topics</button></div></div><div class="ch-legend" id="chLegend"></div><div class="ch-area" id="chArea"></div><div class="ch-xaxis" id="chXAxis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>Now</span></div></div>`;
    h += `<div class="section-head fu fu6"><h2>Conversation Intelligence</h2><span class="sh-sub">AI-powered insights</span></div><div class="metrics-row" id="metricsRow"></div>`;
    h += `<div class="split"><div class="tbl-panel fu fu7"><div class="section-head" style="margin-bottom:12px"><h3 style="margin:0;font-size:14px">Agent Leaderboard</h3><a class="sh-link" href="#" data-page="agents">View All →</a></div><table><thead><tr><th>#</th><th>Agent</th><th>Status</th><th>Calls</th><th>CSAT</th><th>Score</th></tr></thead><tbody id="agentBody"></tbody></table></div>`;
    h += `<div class="tbl-panel fu fu8"><div class="section-head" style="margin-bottom:8px"><h3 style="margin:0;font-size:14px">Recent Calls</h3><a class="sh-link" href="#" data-page="calls">View All →</a></div><div id="callBody"></div></div></div>`;
    h += `<div class="section-head fu"><h2>Active Workflows</h2><a class="sh-link" href="#" data-page="workflows">Manage →</a></div><div class="wf-grid" id="wfGrid"></div>`;
    h += `<div class="section-head fu"><h2>System Health</h2><span class="sh-sub">All systems operational</span></div><div class="health-grid" id="healthGrid"></div>`;
    PAGE.innerHTML = h;
    renderKPIs(); renderChart(); renderMetrics(); renderAgentsTable(D.agents.slice(0, 7)); renderCallsCompact(D.calls.slice(0, 6)); renderWorkflowsCompact(); renderHealth();
    PAGE.querySelectorAll('.ch-tab').forEach(b => b.addEventListener('click', () => { PAGE.querySelectorAll('.ch-tab').forEach(x => x.classList.remove('active')); b.classList.add('active'); activeChart = b.dataset.chart; renderChart(); }));
    PAGE.querySelectorAll('[data-page]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); navigateTo(a.dataset.page); }));
}

// ---------- AGENTS ----------
function pageAgents() {
    let h = `<div class="pg-head fu"><div class="pg-title">Voice Agents</div><div class="pg-sub">12 agents configured · 8 online · 2 in call · 2 offline</div></div>`;
    h += `<div class="filter-bar fu"><button class="filter-pill active" data-f="all">All<span class="filter-count">12</span></button><button class="filter-pill" data-f="on">Online<span class="filter-count">8</span></button><button class="filter-pill" data-f="busy">In Call<span class="filter-count">2</span></button><button class="filter-pill" data-f="off">Offline<span class="filter-count">2</span></button></div>`;
    h += `<div class="agent-grid" id="agentGrid"></div>`;
    PAGE.innerHTML = h;
    renderAgentCards(D.agents);
    PAGE.querySelectorAll('.filter-pill').forEach(b => b.addEventListener('click', () => { PAGE.querySelectorAll('.filter-pill').forEach(x => x.classList.remove('active')); b.classList.add('active'); const f = b.dataset.f; renderAgentCards(f === 'all' ? D.agents : D.agents.filter(a => a.status === f)); }));
}

// ---------- CALL LOGS ----------
function pageCalls() {
    let h = `<div class="pg-head fu"><div class="pg-title">Call Logs</div><div class="pg-sub">Complete history of all voice interactions</div></div>`;
    h += `<div class="filter-bar fu"><button class="filter-pill active" data-f="all">All<span class="filter-count">${D.calls.length}</span></button><button class="filter-pill" data-f="in">Inbound<span class="filter-count">${D.calls.filter(c => c.type === 'in').length}</span></button><button class="filter-pill" data-f="out">Outbound<span class="filter-count">${D.calls.filter(c => c.type === 'out').length}</span></button><button class="filter-pill" data-f="miss">Missed<span class="filter-count">${D.calls.filter(c => c.type === 'miss').length}</span></button></div>`;
    h += `<div class="tbl-panel fu"><div class="full-tbl"><table><thead><tr><th>Type</th><th>Caller</th><th>Topic</th><th>Agent</th><th>Duration</th><th>Sentiment</th><th>Score</th><th>Time</th></tr></thead><tbody id="callTblBody"></tbody></table></div></div>`;
    PAGE.innerHTML = h;
    renderCallsTable(D.calls);
    PAGE.querySelectorAll('.filter-pill').forEach(b => b.addEventListener('click', () => { PAGE.querySelectorAll('.filter-pill').forEach(x => x.classList.remove('active')); b.classList.add('active'); const f = b.dataset.f; renderCallsTable(f === 'all' ? D.calls : D.calls.filter(c => c.type === f)); }));
}

// ---------- CONVERSATIONS ----------
function pageConversations() {
    let h = `<div class="pg-head fu"><div class="pg-title">Conversations</div><div class="pg-sub">AI-analyzed transcripts with intent classification & sentiment</div></div>`;
    h += `<div class="filter-bar fu"><button class="filter-pill active">All Topics</button><button class="filter-pill">Refunds</button><button class="filter-pill">Auth</button><button class="filter-pill">Billing</button><button class="filter-pill">Shipping</button><button class="filter-pill">Feature Req</button></div>`;
    h += `<div class="convo-list" id="convoList"></div>`;
    PAGE.innerHTML = h;
    renderConversations();
}

// ---------- REPORTS ----------
function pageReports() {
    let h = `<div class="pg-head fu"><div class="pg-title">Reports</div><div class="pg-sub">Performance summaries and trend analysis</div><div class="pg-actions"><button class="btn btn-primary">↓ Export PDF</button><button class="btn btn-secondary">Schedule Report</button></div></div>`;
    h += `<div class="report-grid" id="reportGrid"></div>`;
    PAGE.innerHTML = h;
    renderReports();
}

// ---------- WORKFLOWS ----------
function pageWorkflows() {
    let h = `<div class="pg-head fu"><div class="pg-title">Workflows</div><div class="pg-sub">Automated conversation flows & business logic</div><div class="pg-actions"><button class="btn btn-primary">+ New Workflow</button><button class="btn btn-secondary">Import Template</button></div></div>`;
    h += `<div class="filter-bar fu"><button class="filter-pill active">All</button><button class="filter-pill">Active</button><button class="filter-pill">High Success</button><button class="filter-pill">Needs Attention</button></div>`;
    h += `<div class="wf-grid" id="wfDetailGrid"></div>`;
    PAGE.innerHTML = h;
    renderWorkflowsDetail();
}

// ---------- SETTINGS ----------
function pageSettings() {
    let h = `<div class="pg-head fu"><div class="pg-title">Settings</div><div class="pg-sub">Manage your workspace, API keys, and integrations</div></div>`;
    h += `<div class="settings-grid">`;
    // General
    h += `<div class="settings-section fu"><div class="ss-title">General</div><div class="ss-desc">Workspace preferences and display options</div>`;
    h += settingRow('Organization Name', 'Your company name displayed in reports', 'Voice Forge Inc.', 'input');
    h += settingRow('Timezone', 'All timestamps use this timezone', 'UTC-5 (Eastern)', null);
    h += settingRow('Dark Mode', 'Use dark theme across dashboard', '', true);
    h += settingRow('Compact View', 'Reduce spacing for data density', '', false);
    h += `</div>`;
    // API
    h += `<div class="settings-section fu"><div class="ss-title">API Configuration</div><div class="ss-desc">Manage your API keys and access tokens</div>`;
    h += `<div class="setting-row"><div class="sr-info"><div class="sr-label">API Key</div><div class="sr-desc">Use this key to authenticate API requests</div><input class="input-field input-field-mono" value="vf_live_sk_a8f2c9d1e4b7..." readonly /></div></div>`;
    h += `<div class="setting-row"><div class="sr-info"><div class="sr-label">Webhook URL</div><div class="sr-desc">Receive real-time event notifications</div><input class="input-field" value="https://api.yourapp.com/webhooks/voiceforge" /></div></div>`;
    h += settingRow('Rate Limiting', 'Current tier: 5,000 req/min', 'Tier 2 · Enterprise', null);
    h += `<div style="margin-top:12px"><button class="btn btn-primary">Regenerate Key</button> <button class="btn btn-secondary" style="margin-left:8px">View Docs</button></div></div>`;
    // Notifications
    h += `<div class="settings-section fu"><div class="ss-title">Notifications</div><div class="ss-desc">Control when and how you receive alerts</div>`;
    h += settingRow('Email Alerts', 'Daily summary + critical alerts', '', true);
    h += settingRow('Slack Integration', 'Post alerts to your Slack channel', '', true);
    h += settingRow('SMS Alerts', 'For P0 incidents only', '', false);
    h += settingRow('Weekly Digest', 'Performance summary every Monday', '', true);
    h += `</div>`;
    // Integrations
    h += `<div class="settings-section fu"><div class="ss-title">Integrations</div><div class="ss-desc">Connected services and third-party tools</div>`;
    h += integration('SF', '#00A1E0', 'Salesforce', 'Connected · Syncing contacts');
    h += integration('HB', '#ff7a59', 'HubSpot', 'Connected · CRM data flow');
    h += integration('SL', '#4A154B', 'Slack', 'Connected · #voice-alerts');
    h += integration('ZD', '#03363D', 'Zendesk', 'Not connected');
    h += integration('TW', '#F22F46', 'Twilio', 'Connected · SIP trunk active');
    h += `<div style="margin-top:12px"><button class="btn btn-secondary">+ Add Integration</button></div></div>`;
    h += `</div>`;
    // Danger
    h += `<div class="settings-section fu" style="border-color:rgba(239,68,68,0.1);grid-column:1/-1;"><div class="ss-title" style="color:#ef4444">Danger Zone</div><div class="ss-desc">Irreversible actions — proceed with caution</div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-danger">Reset All Analytics</button><button class="btn btn-danger">Delete All Agents</button><button class="btn btn-danger">Close Account</button></div></div>`;
    PAGE.innerHTML = h;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT RENDERERS
// ═══════════════════════════════════════════════════════════
function renderKPIs() { const row = document.getElementById('kpiRow'); if (!row) return; row.innerHTML = ''; D.kpis.forEach((k, i) => { const c = document.createElement('div'); c.className = `kpi fu fu${i + 1}`; c.innerHTML = `<div class="kpi-top"><div class="kpi-lbl">${k.label}</div><div class="kpi-icon ${k.iconClass}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${k.icon}</svg></div></div><div class="kpi-val">${k.value}${k.unit ? `<span class="unit">${k.unit}</span>` : ''}</div><div class="kpi-foot"><span class="kpi-trend ${k.up ? 'up' : 'down'}"><svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="${k.up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}"/></svg>${k.trend}</span><span class="kpi-desc">${k.desc}</span></div><svg class="kpi-spark" id="spark-${k.id}" viewBox="0 0 120 44" preserveAspectRatio="none"></svg>`; row.appendChild(c); }); D.kpis.forEach(k => sparkSVG(document.getElementById(`spark-${k.id}`), k.spark, k.sparkColor)); }

function renderChart() {
    const c = document.getElementById('chArea'), t = document.getElementById('chTitle'), d = document.getElementById('chDesc'), x = document.getElementById('chXAxis'), lg = document.getElementById('chLegend'); if (!c) return; c.innerHTML = ''; const w = c.clientWidth || 800, h = c.clientHeight || 260;
    if (activeChart === 'volume') {
        t.textContent = 'Call Volume Trends'; d.textContent = 'Hourly inbound & outbound calls over the last 24 hours'; x.style.display = 'flex'; lg.innerHTML = '<div class="ch-legend-item"><div class="ch-legend-dot" style="background:#10b981"></div>Current</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:#27272a"></div>Previous</div>'; const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'none'); svg.style.overflow = 'visible'; for (let i = 1; i <= 4; i++) { const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); ln.setAttribute('x1', 0); ln.setAttribute('x2', w); ln.setAttribute('y1', (h / 5) * i); ln.setAttribute('y2', (h / 5) * i); ln.setAttribute('stroke', '#1a1a1d'); svg.appendChild(ln); } const pa = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pa.setAttribute('d', svgA(D.volumePrev, h, w)); pa.setAttribute('fill', '#fff'); pa.setAttribute('opacity', '0.015'); svg.appendChild(pa); const pl = document.createElementNS('http://www.w3.org/2000/svg', 'path'); pl.setAttribute('d', svgP(D.volumePrev, h, w)); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#27272a'); pl.setAttribute('stroke-width', '1.5'); pl.setAttribute('stroke-dasharray', '4 3'); svg.appendChild(pl); const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); defs.innerHTML = `<linearGradient id="vg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></linearGradient>`; svg.appendChild(defs); const ar = document.createElementNS('http://www.w3.org/2000/svg', 'path'); ar.setAttribute('d', svgA(D.volume, h, w)); ar.setAttribute('fill', 'url(#vg)'); svg.appendChild(ar); const li = document.createElementNS('http://www.w3.org/2000/svg', 'path'); li.setAttribute('d', svgP(D.volume, h, w)); li.setAttribute('fill', 'none'); li.setAttribute('stroke', '#34d399'); li.setAttribute('stroke-width', '2.5'); li.setAttribute('stroke-linecap', 'round'); li.style.strokeDasharray = '2600'; li.style.strokeDashoffset = '2600'; li.style.animation = 'draw 1.3s ease-out forwards'; svg.appendChild(li); const mx = Math.max(...D.volume) * 1.12; const ly = h - (D.volume[D.volume.length - 1] / mx) * h; const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('cx', w); dot.setAttribute('cy', ly); dot.setAttribute('r', '4'); dot.setAttribute('fill', '#34d399'); dot.style.filter = 'drop-shadow(0 0 6px #10b981)'; svg.appendChild(dot); c.appendChild(svg);
    } else if (activeChart === 'sentiment') {
        t.textContent = 'Sentiment Analysis'; d.textContent = 'Customer mood score trendline (0–100)'; x.style.display = 'flex'; lg.innerHTML = '<div class="ch-legend-item"><div class="ch-legend-dot" style="background:#22d3ee"></div>Mood Score</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:none;border:1px dashed #10b981"></div>Threshold</div>'; const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'none'); for (let i = 1; i <= 4; i++) { const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); ln.setAttribute('x1', 0); ln.setAttribute('x2', w); ln.setAttribute('y1', (h / 5) * i); ln.setAttribute('y2', (h / 5) * i); ln.setAttribute('stroke', '#1a1a1d'); svg.appendChild(ln); } const ty = h - (70 / 100) * h; const th = document.createElementNS('http://www.w3.org/2000/svg', 'line'); th.setAttribute('x1', 0); th.setAttribute('x2', w); th.setAttribute('y1', ty); th.setAttribute('y2', ty); th.setAttribute('stroke', '#10b981'); th.setAttribute('stroke-dasharray', '6 4'); th.setAttribute('opacity', '0.35'); svg.appendChild(th); const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); defs.innerHTML = '<linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#06b6d4" stop-opacity="0.15"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/></linearGradient>'; svg.appendChild(defs); const ar = document.createElementNS('http://www.w3.org/2000/svg', 'path'); ar.setAttribute('d', svgA(D.sentiment, h, w)); ar.setAttribute('fill', 'url(#sg)'); svg.appendChild(ar); const li = document.createElementNS('http://www.w3.org/2000/svg', 'path'); li.setAttribute('d', svgP(D.sentiment, h, w)); li.setAttribute('fill', 'none'); li.setAttribute('stroke', '#22d3ee'); li.setAttribute('stroke-width', '2.5'); li.style.strokeDasharray = '2600'; li.style.strokeDashoffset = '2600'; li.style.animation = 'draw 1.3s ease-out forwards'; svg.appendChild(li); c.appendChild(svg);
    } else if (activeChart === 'topics') { t.textContent = 'Issue Distribution'; d.textContent = 'Top recurring call topics by volume'; x.style.display = 'none'; lg.innerHTML = ''; const div = document.createElement('div'); div.style.cssText = 'display:flex;flex-direction:column;justify-content:center;height:100%;gap:12px;padding:0 4px;'; const mx = Math.max(...D.topics.map(t => t.value)); D.topics.forEach((t, i) => { const r = document.createElement('div'); r.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><div style="display:flex;align-items:center;gap:8px"><div style="width:8px;height:8px;border-radius:3px;background:${t.color};flex-shrink:0"></div><span style="font-size:12.5px;font-weight:600;color:#d4d4d8">${t.label}</span></div><div style="display:flex;align-items:center;gap:10px"><span style="font-size:11px;font-weight:600;color:#52525b;font-variant-numeric:tabular-nums">${t.value.toLocaleString()}</span><span style="font-size:10px;font-weight:700;color:#3f3f46">${t.pct}</span></div></div><div style="height:6px;background:#141416;border-radius:3px;overflow:hidden"><div id="tb-${i}" style="height:100%;width:0%;border-radius:3px;background:${t.color};transition:width 0.9s cubic-bezier(0.4,0,0.2,1)"></div></div>`; div.appendChild(r); }); c.appendChild(div); requestAnimationFrame(() => { D.topics.forEach((t, i) => { const el = document.getElementById(`tb-${i}`); if (el) el.style.width = ((t.value / mx) * 100) + '%'; }); }); }
}

function renderMetrics() { const r = document.getElementById('metricsRow'); if (!r) return; r.innerHTML = ''; D.metrics.forEach(m => { const c = document.createElement('div'); c.className = 'metric-card fu'; c.innerHTML = `<div class="mc-head"><span class="mc-label">${m.label}</span></div><div class="mc-val">${m.value}</div><div style="font-size:10.5px;color:#27272a">${m.sub}</div><div class="mc-bar-track"><div class="mc-bar" style="width:0%;background:${m.color}"></div></div>`; r.appendChild(c); requestAnimationFrame(() => { const b = c.querySelector('.mc-bar'); if (b) b.style.width = m.bar + '%'; }); }); }

function renderAgentsTable(agents) { const tb = document.getElementById('agentBody'); if (!tb) return; tb.innerHTML = ''; agents.forEach((a, i) => { const rk = i + 1; const rc = rk === 1 ? 'rank-1' : rk === 2 ? 'rank-2' : rk === 3 ? 'rank-3' : 'rank-n'; const sc = a.status === 'on' ? 'on' : a.status === 'busy' ? 'busy' : 'off'; const sl = a.status === 'on' ? 'Online' : a.status === 'busy' ? 'In Call' : 'Offline'; const bc = a.score >= 95 ? '#10b981' : a.score >= 85 ? '#06b6d4' : a.score >= 75 ? '#f59e0b' : '#ef4444'; const tr = document.createElement('tr'); tr.innerHTML = `<td><span class="rank-badge ${rc}">${rk}</span></td><td><div class="td-name"><div class="td-avatar" style="background:${a.bg}">${a.avatar}</div>${a.name}</div></td><td><span class="pill ${sc}"><span class="pill-dot"></span>${sl}</span></td><td style="font-variant-numeric:tabular-nums;font-weight:600;color:#a1a1aa">${a.calls.toLocaleString()}</td><td style="font-weight:700;color:#d4d4d8">${a.csat}%</td><td><div style="display:flex;align-items:center;gap:8px"><div class="bar-track"><div class="bar-fill" style="width:${a.score}%;background:${bc}"></div></div><span style="font-size:11.5px;font-weight:700;color:#d4d4d8">${a.score}</span></div></td>`; tb.appendChild(tr); }); }

function renderCallsCompact(calls) { const el = document.getElementById('callBody'); if (!el) return; el.innerHTML = ''; const icons = { in: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>', out: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3h5m0 0v5m0-5l-6 6M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>', miss: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' }; calls.forEach(c => { const r = document.createElement('div'); r.className = 'call-row'; const sc = c.score !== null ? `<span class="cr-score ${c.score >= 8 ? 'good' : 'mid'}">${c.score}</span>` : '<span class="cr-score" style="background:rgba(239,68,68,0.1);color:#ef4444">Missed</span>'; r.innerHTML = `<div class="cr-icon ${c.type === 'in' ? 'in' : c.type === 'out' ? 'out' : 'miss'}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[c.type]}</svg></div><div class="cr-info"><div class="cr-name">${c.name}</div><div class="cr-topic">${c.topic}</div></div><div class="cr-meta"><div class="cr-dur">${c.dur}${sc}</div><div class="cr-time">${c.time}</div></div>`; el.appendChild(r); }); }

function renderWorkflowsCompact() { const g = document.getElementById('wfGrid'); if (!g) return; g.innerHTML = ''; D.workflows.forEach(w => { const c = document.createElement('div'); c.className = 'wf-card fu'; c.innerHTML = `<div class="wf-name">${w.name}</div><div class="wf-desc">${w.desc.substring(0, 60)}...</div><div class="wf-stats"><div class="wf-stat"><strong>${w.runs}</strong> runs</div><div class="wf-stat"><strong>${w.success}%</strong> success</div></div><div class="wf-bar-track"><div class="wf-bar" style="width:0%;background:${w.color}"></div></div>`; g.appendChild(c); requestAnimationFrame(() => { const b = c.querySelector('.wf-bar'); if (b) b.style.width = w.success + '%'; }); }); }

function renderHealth() { const g = document.getElementById('healthGrid'); if (!g) return; g.innerHTML = ''; D.health.forEach(h => { const i = document.createElement('div'); i.className = 'health-item fu'; i.innerHTML = `<div class="hi-head"><span class="hi-label">${h.label}</span><div class="hi-status ${h.ok ? 'ok' : 'warn'}"></div></div><div class="hi-val">${h.value}</div><div class="hi-sub">${h.sub}</div>`; g.appendChild(i); }); }

// --- Agent Cards ---
function renderAgentCards(agents) { const g = document.getElementById('agentGrid'); if (!g) return; g.innerHTML = ''; agents.forEach(a => { const sc = a.status === 'on' ? 'on' : a.status === 'busy' ? 'busy' : 'off'; const card = document.createElement('div'); card.className = 'agent-card fu'; let curr = ''; if (a.current) curr = `<div class="ac-current">Currently on: <strong>${a.current}</strong></div>`; card.innerHTML = `<div class="ac-top"><div class="ac-avatar" style="background:${a.bg}">${a.avatar}<div class="ac-status-dot ${sc}"></div></div><div><div class="ac-name">${a.name}</div><div class="ac-role">${a.role} · ${a.lang}</div></div></div><div class="ac-stats"><div><div class="ac-stat-label">Calls</div><div class="ac-stat-val">${a.calls.toLocaleString()}</div></div><div><div class="ac-stat-label">CSAT</div><div class="ac-stat-val">${a.csat}%</div></div><div><div class="ac-stat-label">Avg Time</div><div class="ac-stat-val">${a.avgTime}</div></div></div>${curr}`; g.appendChild(card); }); }

// --- Full Call Table ---
function renderCallsTable(calls) { const tb = document.getElementById('callTblBody'); if (!tb) return; tb.innerHTML = ''; calls.forEach(c => { const typeIcon = c.type === 'in' ? '↙ In' : c.type === 'out' ? '↗ Out' : '✕ Miss'; const typeColor = c.type === 'in' ? '#34d399' : c.type === 'out' ? '#22d3ee' : '#ef4444'; const sentColor = c.sentiment >= 90 ? '#10b981' : c.sentiment >= 70 ? '#06b6d4' : c.sentiment >= 50 ? '#f59e0b' : '#ef4444'; const tr = document.createElement('tr'); tr.innerHTML = `<td><span style="color:${typeColor};font-weight:700;font-size:11px">${typeIcon}</span></td><td style="font-weight:600;color:#d4d4d8">${c.name}</td><td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;color:#71717a">${c.topic}</td><td style="color:#a1a1aa">${c.agent}</td><td style="font-variant-numeric:tabular-nums;font-weight:600;color:#d4d4d8">${c.dur}</td><td>${c.sentiment ? `<span class="sentiment-bar"><span class="sentiment-fill" style="width:${c.sentiment}%;background:${sentColor}"></span></span><span style="font-size:11px;font-weight:600;color:#a1a1aa">${c.sentiment}%</span>` : '—'}</td><td>${c.score !== null ? `<span style="font-weight:700;color:${c.score >= 8 ? '#34d399' : '#fbbf24'}">${c.score}</span>` : '<span style="color:#ef4444">—</span>'}</td><td style="color:#3f3f46">${c.time}</td>`; tb.appendChild(tr); }); }

// --- Conversations ---
function renderConversations() { const el = document.getElementById('convoList'); if (!el) return; el.innerHTML = ''; D.conversations.forEach(c => { const item = document.createElement('div'); item.className = 'convo-item fu'; item.innerHTML = `<div class="ci-top"><div class="ci-caller">${c.caller} <span style="font-weight:400;color:#3f3f46">· ${c.agent}</span></div><div class="ci-time">${c.time}</div></div><div class="ci-preview">${c.preview}</div><div class="ci-tags">${c.tags.map(t => `<span class="ci-tag${t.includes('Positive') ? ' sentiment' : ''}">${t}</span>`).join('')}<span class="ci-tag intent">${c.intent}</span></div><div class="ci-meta"><div class="ci-meta-item">⏱ ${c.dur}</div><div class="ci-meta-item">💬 ${c.words} words</div><div class="ci-meta-item">😊 ${c.sentiment}</div></div>`; el.appendChild(item); }); }

// --- Reports ---
function renderReports() { const g = document.getElementById('reportGrid'); if (!g) return; g.innerHTML = ''; D.reports.forEach(r => { const card = document.createElement('div'); card.className = 'report-card fu'; let metricsHTML = r.metrics.map(m => `<div class="rc-metric"><div class="rc-metric-label">${m.l}</div><div class="rc-metric-val">${m.v}</div><div class="rc-metric-change" style="color:${m.up ? '#34d399' : '#f87171'}">${m.c}</div></div>`).join(''); card.innerHTML = `<div class="rc-head"><div class="rc-title">${r.title}</div><div class="rc-period">${r.period}</div></div><div class="rc-metrics">${metricsHTML}</div>`; g.appendChild(card); }); }

// --- Detailed Workflows ---
function renderWorkflowsDetail() { const g = document.getElementById('wfDetailGrid'); if (!g) return; g.innerHTML = ''; D.workflows.forEach(w => { const card = document.createElement('div'); card.className = 'wfd-card fu'; const stepsHTML = w.steps.map((s, i) => `<span class="wfd-step">${s}</span>${i < w.steps.length - 1 ? '<span class="wfd-arrow">→</span>' : ''}`).join(''); card.innerHTML = `<div class="wfd-head"><div class="wfd-name">${w.name}</div><div class="wfd-trigger">${w.trigger}</div></div><div class="wfd-desc">${w.desc}</div><div class="wfd-steps">${stepsHTML}</div><div class="wfd-stats"><div><div class="wfd-stat-label">Total Runs</div><div class="wfd-stat-val">${w.runs}</div></div><div><div class="wfd-stat-label">Success</div><div class="wfd-stat-val" style="color:${w.success >= 95 ? '#34d399' : w.success >= 85 ? '#06b6d4' : '#f59e0b'}">${w.success}%</div></div><div><div class="wfd-stat-label">Avg Time</div><div class="wfd-stat-val">${w.avgTime}</div></div><div><div class="wfd-stat-label">Last Run</div><div class="wfd-stat-val">${w.lastRun}</div></div></div>`; g.appendChild(card); }); }

// --- Settings Helpers ---
function settingRow(label, desc, val, toggle) { if (toggle === true || toggle === false) return `<div class="setting-row"><div class="sr-info"><div class="sr-label">${label}</div><div class="sr-desc">${desc}</div></div><div class="toggle ${toggle ? 'on' : ''}"></div></div>`; if (val) return `<div class="setting-row"><div class="sr-info"><div class="sr-label">${label}</div><div class="sr-desc">${desc}</div></div><span style="font-size:12px;font-weight:600;color:#a1a1aa">${val}</span></div>`; return `<div class="setting-row"><div class="sr-info"><div class="sr-label">${label}</div><div class="sr-desc">${desc}</div></div></div>`; }
function integration(initials, bg, name, status) { return `<div class="integration-card"><div class="ic-icon" style="background:${bg}">${initials}</div><div class="ic-info"><div class="ic-name">${name}</div><div class="ic-status">${status}</div></div><div class="toggle ${status.startsWith('Connected') ? 'on' : ''}"></div></div>`; }

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
const pages = { overview: pageOverview, agents: pageAgents, calls: pageCalls, conversations: pageConversations, reports: pageReports, workflows: pageWorkflows, settings: pageSettings };
function navigateTo(page) {
    activePage = page; activeChart = 'volume';
    document.querySelectorAll('.sb-item').forEach(i => { i.classList.toggle('active', i.dataset.page === page); });
    PAGE.scrollTop = 0;
    if (pages[page]) pages[page]();
    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('open');
}

// Sidebar click handlers
document.querySelectorAll('.sb-item[data-page]').forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); navigateTo(item.dataset.page); });
});

// Toggle clicks for settings
document.addEventListener('click', e => { if (e.target.classList.contains('toggle')) e.target.classList.toggle('on'); });

// Time filter buttons
document.querySelectorAll('.tb-fbtn').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.tb-fbtn').forEach(x => x.classList.remove('active')); b.classList.add('active'); }); });

// Mobile sidebar
const sidebar = document.getElementById('sidebar'), overlay = document.getElementById('overlay'), menuBtn = document.getElementById('menuBtn');
if (menuBtn) menuBtn.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

// Resize
let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (activePage === 'overview') renderChart(); }, 200); });

// Simulation
let tick = 0;
setInterval(() => { tick++; D.volume.shift(); const t = (tick + 48) / 48 * 24; D.volume.push(Math.max(15, 80 + 65 * Math.sin(t / 3.2) + 40 * Math.cos(t / 2.1) + (Math.random() - 0.5) * 30)); if (Math.random() > 0.5) { D.sentiment.shift(); D.sentiment.push(68 + Math.random() * 28); } if (activePage === 'overview') renderChart(); }, 4000);

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
navigateTo('overview');
