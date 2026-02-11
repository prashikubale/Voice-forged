import './style.css'

// --- State ---
const state = {
  activeView: 'volume', // 'volume', 'sentiment', 'topics'

  // Static Simulation Data (Professional curves)
  data: {
    volume: Array.from({ length: 48 }, (_, i) => {
      // Create a dual-peak daily curve
      const t = i / 48 * 24;
      const trend = 100 + 50 * Math.sin((t - 10) / 3) + 30 * Math.cos((t - 16) / 2);
      return trend + Math.random() * 20;
    }),
    sentiment: Array.from({ length: 48 }, () => 70 + Math.random() * 20),
    topics: [
      { label: 'Refunds', value: 450, color: 'text-amber-500', bar: 'bg-amber-500' },
      { label: 'Login Issues', value: 320, color: 'text-blue-500', bar: 'bg-blue-500' },
      { label: 'Billing', value: 280, color: 'text-zinc-400', bar: 'bg-zinc-500' },
      { label: 'Product Info', value: 150, color: 'text-emerald-500', bar: 'bg-emerald-500' },
      { label: 'Shipping', value: 90, color: 'text-purple-500', bar: 'bg-purple-500' },
    ]
  }
};

// --- DOM Elements ---
const els = {
  buttons: document.querySelectorAll('[data-view]'),
  chartContainer: document.getElementById('main-chart'),
  chartTitle: document.getElementById('main-chart-title'),
  chartDesc: document.getElementById('main-chart-desc')
};

// --- SVG Helpers ---
const createLinePath = (data, height, width) => {
  const max = Math.max(...data) * 1.2;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - (val / max * height);
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
};

const createAreaPath = (data, height, width) => {
  const line = createLinePath(data, height, width);
  return `${line} L ${width},${height} L 0,${height} Z`;
};

// --- Renderers ---
const renderChart = () => {
  if (!els.chartContainer) return;

  els.chartContainer.innerHTML = ''; // Clear SVG

  // Get Dimensions
  const width = els.chartContainer.clientWidth || 800;
  const height = els.chartContainer.clientHeight || 400;

  // VOLUME VIEW (Smooth Area Chart)
  if (state.activeView === 'volume') {
    const pathData = state.data.volume;

    // Titles
    els.chartTitle.textContent = "Call Volume Trends";
    els.chartTitle.className = "text-lg font-bold text-white";
    els.chartDesc.textContent = "Inbound calls over the last 24 hours";

    // SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("overflow-visible");

    // Gradient Defs
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
            <linearGradient id="volGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
            </linearGradient>
        `;
    svg.appendChild(defs);

    // Fill Path
    const fillPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    fillPath.setAttribute("d", createAreaPath(pathData, height, width));
    fillPath.setAttribute("fill", "url(#volGradient)");
    svg.appendChild(fillPath);

    // Stroke Path (The Line)
    const strokePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    strokePath.setAttribute("d", createLinePath(pathData, height, width));
    strokePath.setAttribute("fill", "none");
    strokePath.setAttribute("stroke", "#818cf8"); // Indigo-400
    strokePath.setAttribute("stroke-width", "3");
    strokePath.setAttribute("stroke-linecap", "round");
    strokePath.setAttribute("stroke-linejoin", "round");
    // Animate Dash
    const len = strokePath.getTotalLength ? strokePath.getTotalLength() : 2000; // rough fallback
    strokePath.style.strokeDasharray = len;
    strokePath.style.strokeDashoffset = len;
    strokePath.style.animation = "draw 1.5s ease-out forwards";
    svg.appendChild(strokePath);

    // Add Keyframe Style dynamically
    const style = document.createElement('style');
    style.textContent = `
            @keyframes draw { to { stroke-dashoffset: 0; } }
        `;
    svg.appendChild(style);

    els.chartContainer.appendChild(svg);

    // Highlight Active Card
    updateActiveCard('volume');
  }

  // SENTIMENT VIEW (Step Line or Bar)
  else if (state.activeView === 'sentiment') {
    // Titles
    els.chartTitle.textContent = "Sentiment Analysis";
    els.chartTitle.className = "text-lg font-bold text-white";
    els.chartDesc.textContent = "Customer mood score (0-100) trendline";

    const pathData = state.data.sentiment;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");

    // Threshold Line (70%)
    const lineY = height - (70 / 100 * height);
    const thresh = document.createElementNS("http://www.w3.org/2000/svg", "line");
    thresh.setAttribute("x1", 0);
    thresh.setAttribute("x2", width);
    thresh.setAttribute("y1", lineY);
    thresh.setAttribute("y2", lineY);
    thresh.setAttribute("stroke", "#10b981"); // Emerald
    thresh.setAttribute("stroke-dasharray", "4 4");
    thresh.setAttribute("opacity", "0.5");
    svg.appendChild(thresh);

    // Main Line
    const strokePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    strokePath.setAttribute("d", createLinePath(pathData, height, width));
    strokePath.setAttribute("fill", "none");
    strokePath.setAttribute("stroke", "#10b981");
    strokePath.setAttribute("stroke-width", "3");
    svg.appendChild(strokePath);

    els.chartContainer.appendChild(svg);
    updateActiveCard('sentiment');
  }

  // TOPICS VIEW (Horizontal Bars)
  else if (state.activeView === 'topics') {
    els.chartTitle.textContent = "Issue Distribution";
    els.chartDesc.textContent = "Top 5 recurring topics by volume";

    const container = document.createElement('div');
    container.className = "flex flex-col justify-center h-full gap-4 md:gap-6 px-4 md:px-12";

    const max = Math.max(...state.data.topics.map(t => t.value));

    state.data.topics.forEach((t, i) => {
      const w = (t.value / max) * 100;
      const html = `
                <div class="w-full">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-sm font-bold text-zinc-300">${t.label}</span>
                        <span class="text-sm font-mono text-zinc-500">${t.value} Calls</span>
                    </div>
                    <div class="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div class="h-full ${t.bar} rounded-full transition-all duration-1000 ease-out" style="width: 0%" id="bar-${i}"></div>
                    </div>
                </div>
             `;
      container.innerHTML += html;
    });

    els.chartContainer.appendChild(container);

    // Animate widths after append
    requestAnimationFrame(() => {
      state.data.topics.forEach((t, i) => {
        const el = document.getElementById(`bar-${i}`);
        if (el) el.style.width = ((t.value / max) * 100) + '%';
      });
    });

    updateActiveCard('topics');
  }

};

const updateActiveCard = (view) => {
  els.buttons.forEach(btn => {
    if (btn.dataset.view === view) {
      btn.classList.add('bg-zinc-900', 'border-indigo-500');
      btn.classList.remove('border-white/5', 'bg-zinc-900/40', 'hover:border-white/20');
    } else {
      btn.classList.remove('bg-zinc-900', 'border-indigo-500');
      btn.classList.add('border-white/5', 'bg-zinc-900/40', 'hover:border-white/20');
    }
  });
};


// --- Simulation ---
let tick = 0;

const simulate = () => {
  tick++;

  // Slow Shift for Volume Graph
  if (state.activeView === 'volume') {
    state.data.volume.shift();
    // Generate plausible next point
    const t = (tick + 48) / 48 * 24;
    const trend = 100 + 50 * Math.sin((t) / 3) + 30 * Math.cos((t) / 2);
    const val = Math.max(20, trend + (Math.random() - 0.5) * 30);
    state.data.volume.push(val);
    renderChart();
  }

  // Sentiment Jitter
  if (Math.random() > 0.7) {
    state.data.sentiment.shift();
    state.data.sentiment.push(70 + Math.random() * 20);
    if (state.activeView === 'sentiment') renderChart();
  }
};


// --- Listeners ---
els.buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const view = e.currentTarget.dataset.view;
    if (view) {
      state.activeView = view;
      renderChart();
    }
  });
});

// --- Init ---
renderChart();
// Much slower update rate (every 3 seconds) for professional feel
setInterval(simulate, 3000);
