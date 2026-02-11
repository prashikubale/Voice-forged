// ============================================================
// Voice Forge — Dashboard Intelligence Engine
// Enterprise-grade analytics with rich mock data
// ============================================================

// ═══════════════════════════════════════════════════════════
// DATA LAYER — Rich, realistic mock data
// ═══════════════════════════════════════════════════════════

const D = {
    // KPI Cards
    kpis: [
        {
            id: 'volume', label: 'Total Calls', value: '12,847', trend: '+18.3%', up: true,
            desc: 'vs previous period', iconClass: 'emerald',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
            spark: Array.from({ length: 24 }, (_, i) => 40 + 50 * Math.sin(i / 3.5) + Math.random() * 20), sparkColor: '#10b981'
        },
        {
            id: 'sentiment', label: 'Avg Sentiment', value: '9.2', unit: '/10', trend: '+4.7%', up: true,
            desc: 'customer satisfaction', iconClass: 'cyan',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            spark: Array.from({ length: 24 }, () => 60 + Math.random() * 35), sparkColor: '#06b6d4'
        },
        {
            id: 'resolution', label: 'Resolution Rate', value: '96.4', unit: '%', trend: '+2.1%', up: true,
            desc: 'first-contact resolution', iconClass: 'emerald',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            spark: Array.from({ length: 24 }, () => 70 + Math.random() * 28), sparkColor: '#10b981'
        },
        {
            id: 'avgtime', label: 'Avg Handle Time', value: '2:18', trend: '-12.4%', up: false,
            desc: 'mins · ↓ is better', iconClass: 'amber',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            spark: Array.from({ length: 24 }, () => 20 + Math.random() * 55), sparkColor: '#f59e0b'
        },
    ],

    // Volume chart
    volume: Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * 24;
        return Math.max(15, 80 + 65 * Math.sin((t - 10) / 3.2) + 40 * Math.cos((t - 16) / 2.1) + (Math.random() - 0.5) * 30);
    }),
    volumePrev: Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * 24;
        return Math.max(10, 65 + 50 * Math.sin((t - 9) / 3) + 30 * Math.cos((t - 15) / 2.5) + (Math.random() - 0.5) * 25);
    }),

    // Sentiment chart
    sentiment: Array.from({ length: 48 }, () => 68 + Math.random() * 28),

    // Topics
    topics: [
        { label: 'Refund Requests', value: 1240, pct: '28%', color: '#f59e0b' },
        { label: 'Login & Auth Issues', value: 890, pct: '20%', color: '#06b6d4' },
        { label: 'Billing Inquiries', value: 720, pct: '16%', color: '#a1a1aa' },
        { label: 'Product Questions', value: 580, pct: '13%', color: '#10b981' },
        { label: 'Shipping & Delivery', value: 410, pct: '9%', color: '#38bdf8' },
        { label: 'Account Changes', value: 340, pct: '8%', color: '#8b5cf6' },
        { label: 'Technical Support', value: 280, pct: '6%', color: '#f472b6' },
    ],

    // Secondary metrics
    metrics: [
        { label: 'Escalation Rate', value: '3.2%', bar: 3.2, max: 100, color: '#10b981', good: true, sub: '↓ 0.8% from last week' },
        { label: 'Avg Words / Call', value: '847', bar: 84.7, max: 100, color: '#06b6d4', good: true, sub: 'Optimal conversation length' },
        { label: 'Intent Accuracy', value: '97.8%', bar: 97.8, max: 100, color: '#10b981', good: true, sub: 'NLU classification rate' },
        { label: 'Containment Rate', value: '89.3%', bar: 89.3, max: 100, color: '#34d399', good: true, sub: 'Calls resolved by AI' },
        { label: 'Transfer Rate', value: '6.7%', bar: 6.7, max: 100, color: '#f59e0b', good: false, sub: 'Escalated to human' },
        { label: 'Avg Wait Time', value: '0.4s', bar: 4, max: 100, color: '#10b981', good: true, sub: 'Queue latency' },
    ],

    // Agent leaderboard
    agents: [
        { name: 'Agent Nova', avatar: 'N', bg: '#10b981', status: 'on', calls: 1842, csat: 98, score: 99 },
        { name: 'Agent Horizon', avatar: 'H', bg: '#06b6d4', status: 'on', calls: 1654, csat: 97, score: 96 },
        { name: 'Agent Pulse', avatar: 'P', bg: '#f59e0b', status: 'busy', calls: 1520, csat: 95, score: 94 },
        { name: 'Agent Vertex', avatar: 'V', bg: '#38bdf8', status: 'on', calls: 1380, csat: 93, score: 91 },
        { name: 'Agent Echo', avatar: 'E', bg: '#a1a1aa', status: 'on', calls: 1210, csat: 92, score: 89 },
        { name: 'Agent Drift', avatar: 'D', bg: '#8b5cf6', status: 'off', calls: 985, csat: 90, score: 86 },
        { name: 'Agent Flux', avatar: 'F', bg: '#f472b6', status: 'on', calls: 870, csat: 88, score: 83 },
    ],

    // Recent calls
    calls: [
        { name: 'Sarah Chen', topic: 'Refund — Order #84291 · Visa ****4821', dur: '4:12', time: '32s ago', type: 'in', score: 9.4, scoreClass: 'good' },
        { name: 'Marcus Webb', topic: 'Account unlock · 2FA failure', dur: '2:38', time: '1m ago', type: 'in', score: 8.7, scoreClass: 'good' },
        { name: 'Emily Rodriguez', topic: 'Plan upgrade · Enterprise → Scale', dur: '5:44', time: '3m ago', type: 'out', score: 9.8, scoreClass: 'good' },
        { name: 'James Okoro', topic: 'API rate limit inquiry · Tier 2', dur: '1:55', time: '4m ago', type: 'in', score: 7.2, scoreClass: 'mid' },
        { name: 'Ava Petrov', topic: 'Shipping delay — Tracking #9X2K4', dur: '3:20', time: '6m ago', type: 'in', score: 8.9, scoreClass: 'good' },
        { name: 'David Kim', topic: 'Feature request · Webhook callbacks', dur: '6:15', time: '8m ago', type: 'out', score: 9.1, scoreClass: 'good' },
        { name: 'Lisa Nakamura', topic: 'Invoice discrepancy — Q4 billing', dur: '4:48', time: '11m ago', type: 'in', score: 8.3, scoreClass: 'good' },
        { name: 'Tom Andersen', topic: 'Missed callback · follow-up', dur: '0:00', time: '14m ago', type: 'miss', score: null, scoreClass: '' },
    ],

    // Workflows
    workflows: [
        { name: 'Refund Processing', desc: 'Automated refund validation & approval', runs: '3,240', success: 94, color: '#10b981' },
        { name: 'Account Recovery', desc: 'Identity verification & credential reset', runs: '1,890', success: 98, color: '#06b6d4' },
        { name: 'Order Status Check', desc: 'Real-time shipment tracking lookups', runs: '5,120', success: 99, color: '#34d399' },
        { name: 'Plan Upgrades', desc: 'Subscription tier migration flow', runs: '680', success: 91, color: '#f59e0b' },
        { name: 'Complaint Escalation', desc: 'AI triage → human agent routing', runs: '420', success: 87, color: '#f87171' },
        { name: 'Survey Collection', desc: 'Post-call CSAT & NPS feedback', runs: '8,950', success: 96, color: '#38bdf8' },
    ],

    // System health
    health: [
        { label: 'API Latency', value: '23ms', sub: 'p99 · US-East', ok: true },
        { label: 'STT Accuracy', value: '99.2%', sub: 'Speech-to-Text', ok: true },
        { label: 'TTS Quality', value: '4.8/5', sub: 'MOS Score', ok: true },
        { label: 'Uptime', value: '99.99%', sub: 'Last 90 days', ok: true },
        { label: 'Active Sessions', value: '2,847', sub: 'Concurrent calls', ok: true },
        { label: 'Queue Depth', value: '12', sub: 'Waiting callers', ok: true },
        { label: 'Model Version', value: 'v4.2.1', sub: 'LLM Engine', ok: true },
        { label: 'Memory Usage', value: '67%', sub: 'Cluster avg', ok: false },
    ],
};

let activeChart = 'volume';

// ═══════════════════════════════════════════════════════════
// SVG CHART UTILS
// ═══════════════════════════════════════════════════════════

function svgPath(data, h, w) {
    const mx = Math.max(...data) * 1.12;
    const step = w / (data.length - 1);
    return data.map((v, i) => {
        const x = (i * step).toFixed(1);
        const y = (h - (v / mx) * h).toFixed(1);
        return (i === 0 ? 'M ' : ' L ') + x + ',' + y;
    }).join('');
}

function svgArea(data, h, w) {
    return svgPath(data, h, w) + ` L ${w},${h} L 0,${h} Z`;
}

function sparkSVG(el, data, color) {
    if (!el) return;
    el.innerHTML = '';
    const w = 120, h = 44;
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', svgArea(data, h, w));
    area.setAttribute('fill', color);
    area.setAttribute('opacity', '0.12');
    el.appendChild(area);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', svgPath(data, h, w));
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    el.appendChild(line);
}

// ═══════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════

// KPI Cards
function renderKPIs() {
    const row = document.getElementById('kpiRow');
    if (!row) return;
    row.innerHTML = '';
    D.kpis.forEach((k, i) => {
        const card = document.createElement('div');
        card.className = `kpi fu fu${i + 1}`;
        card.innerHTML = `
      <div class="kpi-top">
        <div class="kpi-lbl">${k.label}</div>
        <div class="kpi-icon ${k.iconClass}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${k.icon}</svg></div>
      </div>
      <div class="kpi-val">${k.value}${k.unit ? `<span class="unit">${k.unit}</span>` : ''}</div>
      <div class="kpi-foot">
        <span class="kpi-trend ${k.up ? 'up' : 'down'}">
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="${k.up ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}"/></svg>
          ${k.trend}
        </span>
        <span class="kpi-desc">${k.desc}</span>
      </div>
      <svg class="kpi-spark" id="spark-${k.id}" viewBox="0 0 120 44" preserveAspectRatio="none"></svg>
    `;
        row.appendChild(card);
    });
    // Render sparklines after DOM insertion
    D.kpis.forEach(k => sparkSVG(document.getElementById(`spark-${k.id}`), k.spark, k.sparkColor));
}

// Main Chart
function renderChart() {
    const c = document.getElementById('chArea');
    const title = document.getElementById('chTitle');
    const desc = document.getElementById('chDesc');
    const xaxis = document.getElementById('chXAxis');
    const legend = document.getElementById('chLegend');
    if (!c) return;
    c.innerHTML = '';
    const w = c.clientWidth || 800;
    const h = c.clientHeight || 260;

    if (activeChart === 'volume') {
        title.textContent = 'Call Volume Trends';
        desc.textContent = 'Hourly inbound & outbound calls over the last 24 hours';
        xaxis.style.display = 'flex';
        legend.style.display = 'flex';
        legend.innerHTML = '<div class="ch-legend-item"><div class="ch-legend-dot" style="background:#10b981;"></div>Current Period</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:#27272a;"></div>Previous Period</div>';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.style.overflow = 'visible';

        // Grid lines
        for (let i = 1; i <= 4; i++) {
            const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            ln.setAttribute('x1', 0); ln.setAttribute('x2', w);
            ln.setAttribute('y1', (h / 5) * i); ln.setAttribute('y2', (h / 5) * i);
            ln.setAttribute('stroke', '#1a1a1d'); ln.setAttribute('stroke-width', '1');
            svg.appendChild(ln);
        }

        // Previous period (ghost)
        const prevArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        prevArea.setAttribute('d', svgArea(D.volumePrev, h, w));
        prevArea.setAttribute('fill', '#ffffff'); prevArea.setAttribute('opacity', '0.015');
        svg.appendChild(prevArea);
        const prevLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        prevLine.setAttribute('d', svgPath(D.volumePrev, h, w));
        prevLine.setAttribute('fill', 'none'); prevLine.setAttribute('stroke', '#27272a');
        prevLine.setAttribute('stroke-width', '1.5'); prevLine.setAttribute('stroke-dasharray', '4 3');
        svg.appendChild(prevLine);

        // Current gradient
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `<linearGradient id="vg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></linearGradient>`;
        svg.appendChild(defs);

        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        area.setAttribute('d', svgArea(D.volume, h, w));
        area.setAttribute('fill', 'url(#vg)');
        svg.appendChild(area);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', svgPath(D.volume, h, w));
        line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#34d399');
        line.setAttribute('stroke-width', '2.5'); line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('stroke-linejoin', 'round');
        line.style.strokeDasharray = '2600'; line.style.strokeDashoffset = '2600';
        line.style.animation = 'draw 1.3s ease-out forwards';
        svg.appendChild(line);

        // Glow dot
        const mx = Math.max(...D.volume) * 1.12;
        const lastY = h - (D.volume[D.volume.length - 1] / mx) * h;
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', w); dot.setAttribute('cy', lastY); dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#34d399'); dot.style.filter = 'drop-shadow(0 0 6px #10b981)';
        svg.appendChild(dot);
        // Outer pulse
        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulse.setAttribute('cx', w); pulse.setAttribute('cy', lastY); pulse.setAttribute('r', '8');
        pulse.setAttribute('fill', 'none'); pulse.setAttribute('stroke', '#10b981');
        pulse.setAttribute('stroke-width', '1.5'); pulse.setAttribute('opacity', '0.3');
        pulse.style.animation = 'pulse-dot 2s infinite';
        svg.appendChild(pulse);

        c.appendChild(svg);

    } else if (activeChart === 'sentiment') {
        title.textContent = 'Sentiment Analysis';
        desc.textContent = 'Real-time customer mood score trendline (0–100)';
        xaxis.style.display = 'flex';
        legend.style.display = 'flex';
        legend.innerHTML = '<div class="ch-legend-item"><div class="ch-legend-dot" style="background:#22d3ee;"></div>Mood Score</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:#10b981;border:1px dashed #10b981;background:none;"></div>Threshold (70)</div>';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'none');

        for (let i = 1; i <= 4; i++) {
            const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            ln.setAttribute('x1', 0); ln.setAttribute('x2', w);
            ln.setAttribute('y1', (h / 5) * i); ln.setAttribute('y2', (h / 5) * i);
            ln.setAttribute('stroke', '#1a1a1d');
            svg.appendChild(ln);
        }

        // Threshold
        const ty = h - (70 / 100) * h;
        const thresh = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        thresh.setAttribute('x1', 0); thresh.setAttribute('x2', w);
        thresh.setAttribute('y1', ty); thresh.setAttribute('y2', ty);
        thresh.setAttribute('stroke', '#10b981'); thresh.setAttribute('stroke-dasharray', '6 4');
        thresh.setAttribute('opacity', '0.35');
        svg.appendChild(thresh);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `<linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#06b6d4" stop-opacity="0.15"/><stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/></linearGradient>`;
        svg.appendChild(defs);

        const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        area.setAttribute('d', svgArea(D.sentiment, h, w));
        area.setAttribute('fill', 'url(#sg)');
        svg.appendChild(area);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', svgPath(D.sentiment, h, w));
        line.setAttribute('fill', 'none'); line.setAttribute('stroke', '#22d3ee');
        line.setAttribute('stroke-width', '2.5'); line.setAttribute('stroke-linecap', 'round');
        line.style.strokeDasharray = '2600'; line.style.strokeDashoffset = '2600';
        line.style.animation = 'draw 1.3s ease-out forwards';
        svg.appendChild(line);

        c.appendChild(svg);

    } else if (activeChart === 'topics') {
        title.textContent = 'Issue Distribution';
        desc.textContent = 'Top recurring call topics by volume — last 24 hours';
        xaxis.style.display = 'none';
        legend.style.display = 'none';

        const div = document.createElement('div');
        div.style.cssText = 'display:flex;flex-direction:column;justify-content:center;height:100%;gap:12px;padding:0 4px;';
        const mx = Math.max(...D.topics.map(t => t.value));
        D.topics.forEach((t, i) => {
            const row = document.createElement('div');
            row.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:8px;height:8px;border-radius:3px;background:${t.color};flex-shrink:0;"></div>
            <span style="font-size:12.5px;font-weight:600;color:#d4d4d8;">${t.label}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:11px;font-weight:600;color:#52525b;font-variant-numeric:tabular-nums;">${t.value.toLocaleString()} calls</span>
            <span style="font-size:10px;font-weight:700;color:#3f3f46;">${t.pct}</span>
          </div>
        </div>
        <div style="height:6px;background:#141416;border-radius:3px;overflow:hidden;">
          <div id="tb-${i}" style="height:100%;width:0%;border-radius:3px;background:${t.color};transition:width 0.9s cubic-bezier(0.4,0,0.2,1);"></div>
        </div>
      `;
            div.appendChild(row);
        });
        c.appendChild(div);
        requestAnimationFrame(() => {
            D.topics.forEach((t, i) => {
                const el = document.getElementById(`tb-${i}`);
                if (el) el.style.width = ((t.value / mx) * 100) + '%';
            });
        });
    }
}

// Secondary Metrics
function renderMetrics() {
    const row = document.getElementById('metricsRow');
    if (!row) return;
    row.innerHTML = '';
    D.metrics.forEach(m => {
        const card = document.createElement('div');
        card.className = 'metric-card fu';
        card.innerHTML = `
      <div class="mc-head">
        <span class="mc-label">${m.label}</span>
        <svg width="14" height="14" fill="none" stroke="${m.good ? '#10b981' : '#f59e0b'}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="${m.good ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}"/></svg>
      </div>
      <div class="mc-val">${m.value}</div>
      <div style="font-size:10.5px;color:#27272a;">${m.sub}</div>
      <div class="mc-bar-track"><div class="mc-bar" style="width:0%;background:${m.color};"></div></div>
    `;
        row.appendChild(card);
        // Animate bar
        requestAnimationFrame(() => {
            const bar = card.querySelector('.mc-bar');
            if (bar) bar.style.width = m.bar + '%';
        });
    });
}

// Agent Leaderboard
function renderAgents() {
    const tbody = document.getElementById('agentBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    D.agents.forEach((a, i) => {
        const rank = i + 1;
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n';
        const statusClass = a.status === 'on' ? 'on' : a.status === 'busy' ? 'busy' : 'off';
        const statusLabel = a.status === 'on' ? 'Online' : a.status === 'busy' ? 'In Call' : 'Offline';
        const barColor = a.score >= 95 ? '#10b981' : a.score >= 85 ? '#06b6d4' : a.score >= 75 ? '#f59e0b' : '#ef4444';
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td><span class="rank-badge ${rankClass}">${rank}</span></td>
      <td><div class="td-name"><div class="td-avatar" style="background:${a.bg};">${a.avatar}</div>${a.name}</div></td>
      <td><span class="pill ${statusClass}"><span class="pill-dot"></span>${statusLabel}</span></td>
      <td style="font-variant-numeric:tabular-nums;font-weight:600;color:#a1a1aa;">${a.calls.toLocaleString()}</td>
      <td style="font-weight:700;color:#d4d4d8;">${a.csat}%</td>
      <td><div style="display:flex;align-items:center;gap:8px;"><div class="bar-track"><div class="bar-fill" style="width:${a.score}%;background:${barColor};"></div></div><span style="font-size:11.5px;font-weight:700;color:#d4d4d8;">${a.score}</span></div></td>
    `;
        tbody.appendChild(tr);
    });
}

// Call Log
function renderCalls() {
    const el = document.getElementById('callBody');
    if (!el) return;
    el.innerHTML = '';
    const icons = {
        in: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
        out: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 3h5m0 0v5m0-5l-6 6M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
        miss: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l-8 8m0-8l8 8M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
    };
    D.calls.forEach(c => {
        const row = document.createElement('div');
        row.className = 'call-row';
        const scoreHTML = c.score !== null ? `<span class="cr-score ${c.scoreClass}">${c.score}</span>` : '<span class="cr-score" style="background:rgba(239,68,68,0.1);color:#ef4444;">Missed</span>';
        row.innerHTML = `
      <div class="cr-icon ${c.type === 'in' ? 'in' : c.type === 'out' ? 'out' : 'miss'}"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[c.type]}</svg></div>
      <div class="cr-info"><div class="cr-name">${c.name}</div><div class="cr-topic">${c.topic}</div></div>
      <div class="cr-meta"><div class="cr-dur">${c.dur}${scoreHTML}</div><div class="cr-time">${c.time}</div></div>
    `;
        el.appendChild(row);
    });
}

// Workflows
function renderWorkflows() {
    const grid = document.getElementById('wfGrid');
    if (!grid) return;
    grid.innerHTML = '';
    D.workflows.forEach(wf => {
        const card = document.createElement('div');
        card.className = 'wf-card fu';
        card.innerHTML = `
      <div class="wf-name">${wf.name}</div>
      <div class="wf-desc">${wf.desc}</div>
      <div class="wf-stats">
        <div class="wf-stat"><strong>${wf.runs}</strong> runs</div>
        <div class="wf-stat"><strong>${wf.success}%</strong> success</div>
      </div>
      <div class="wf-bar-track"><div class="wf-bar" style="width:0%;background:${wf.color};"></div></div>
    `;
        grid.appendChild(card);
        requestAnimationFrame(() => {
            const bar = card.querySelector('.wf-bar');
            if (bar) bar.style.width = wf.success + '%';
        });
    });
}

// System Health
function renderHealth() {
    const grid = document.getElementById('healthGrid');
    if (!grid) return;
    grid.innerHTML = '';
    D.health.forEach(h => {
        const item = document.createElement('div');
        item.className = 'health-item fu';
        item.innerHTML = `
      <div class="hi-head"><span class="hi-label">${h.label}</span><div class="hi-status ${h.ok ? 'ok' : 'warn'}"></div></div>
      <div class="hi-val">${h.value}</div>
      <div class="hi-sub">${h.sub}</div>
    `;
        grid.appendChild(item);
    });
}

// ═══════════════════════════════════════════════════════════
// EVENT HANDLERS
// ═══════════════════════════════════════════════════════════

// Chart tabs
document.querySelectorAll('.ch-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.ch-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeChart = btn.dataset.chart;
        renderChart();
    });
});

// Time filters
document.querySelectorAll('.tb-fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tb-fbtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Mobile sidebar
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) menuBtn.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('open'); });
if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); });

// Resize handler
let rTimer;
window.addEventListener('resize', () => { clearTimeout(rTimer); rTimer = setTimeout(renderChart, 200); });

// ═══════════════════════════════════════════════════════════
// SIMULATION (Slow, professional feel)
// ═══════════════════════════════════════════════════════════
let tick = 0;
function simulate() {
    tick++;
    D.volume.shift();
    const t = (tick + 48) / 48 * 24;
    D.volume.push(Math.max(15, 80 + 65 * Math.sin(t / 3.2) + 40 * Math.cos(t / 2.1) + (Math.random() - 0.5) * 30));
    if (Math.random() > 0.5) { D.sentiment.shift(); D.sentiment.push(68 + Math.random() * 28); }
    renderChart();
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
renderKPIs();
renderChart();
renderMetrics();
renderAgents();
renderCalls();
renderWorkflows();
renderHealth();
setInterval(simulate, 4000);
