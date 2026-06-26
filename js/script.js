/* ═══════════════════════════════════════════════════════
   JanVikas AI — script.js
   Production-ready, modular, ES6 application controller
═══════════════════════════════════════════════════════ */

const JanVikasAI = {

  /* ─── State ─────────────────────────────────────────── */
  state: {
    activeNav: 'command-center',
    signalCount: 1247,
    hotspots: 47,
    suggestions24h: 1247,
    projectsApproved: 23,
    capitalWorks: '₹4.2k',
    aiConfidence: 94,

    projects: [
      {
        rank: 1, rankClass: 'rank-1',
        name: 'Rural Drinking Water Network',
        loc: '🔴 Bundelkhand, UP · 6 districts · Demand+Deficit+Impact: HIGH',
        tag: 'tag-water', tagLabel: 'Water',
        score: 9.4, scoreColor: 'var(--sky-400)',
        scoreGradient: 'linear-gradient(90deg, var(--sky-500), var(--sky-300))',
        population: '4.2M', popClass: 'imp-high',
        scoreBreakdown: [
          { factor: 'Citizen Demand',   weight: '30%', pct: 97, color: 'var(--sky-400)',     val: '9.7' },
          { factor: 'Infra Deficit',    weight: '25%', pct: 96, color: 'var(--crimson-400)', val: '9.6' },
          { factor: 'Population Impact',weight: '20%', pct: 95, color: 'var(--emerald-400)', val: '9.5' },
          { factor: 'Plan Alignment',   weight: '15%', pct: 90, color: 'var(--amber-400)',   val: '9.0' },
          { factor: 'Strategic',        weight: '10%', pct: 88, color: 'var(--violet-400)',  val: '8.8' },
        ],
      },
      {
        rank: 2, rankClass: 'rank-2',
        name: 'Primary Health Centre Expansion',
        loc: '🟠 Gaya, Bihar · 12 blocks · Infra Deficit: CRITICAL',
        tag: 'tag-health', tagLabel: 'Health',
        score: 8.9, scoreColor: 'var(--emerald-400)',
        scoreGradient: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))',
        population: '2.8M', popClass: 'imp-high',
        scoreBreakdown: [
          { factor: 'Citizen Demand',   weight: '30%', pct: 88, color: 'var(--sky-400)',     val: '8.8' },
          { factor: 'Infra Deficit',    weight: '25%', pct: 93, color: 'var(--crimson-400)', val: '9.3' },
          { factor: 'Population Impact',weight: '20%', pct: 88, color: 'var(--emerald-400)', val: '8.8' },
          { factor: 'Plan Alignment',   weight: '15%', pct: 85, color: 'var(--amber-400)',   val: '8.5' },
        ],
      },
      {
        rank: 3, rankClass: 'rank-3',
        name: 'Rural Road Connectivity (PMGSY Ph.2)',
        loc: '🟡 Koraput, Odisha · 89 villages · Plan Alignment: HIGH',
        tag: 'tag-road', tagLabel: 'Roads',
        score: 8.6, scoreColor: 'var(--amber-400)',
        scoreGradient: 'linear-gradient(90deg, var(--amber-500), var(--amber-400))',
        population: '1.1M', popClass: 'imp-med',
        scoreBreakdown: [
          { factor: 'Citizen Demand', weight: '30%', pct: 84, color: 'var(--sky-400)',    val: '8.4' },
          { factor: 'Infra Deficit',  weight: '25%', pct: 80, color: 'var(--crimson-400)',val: '8.0' },
          { factor: 'Plan Alignment', weight: '15%', pct: 95, color: 'var(--amber-400)',  val: '9.5' },
        ],
      },
      {
        rank: 4, rankClass: 'rank-4',
        name: 'Solar Micro-Grid Electrification',
        loc: '⚪ Barmer, Rajasthan · 32 panchayats · Strategic: HIGH',
        tag: 'tag-energy', tagLabel: 'Energy',
        score: 8.2, scoreColor: 'var(--violet-400)',
        scoreGradient: 'linear-gradient(90deg, var(--violet-500), var(--violet-400))',
        population: '780k', popClass: 'imp-med',
        scoreBreakdown: [],
      },
      {
        rank: 5, rankClass: 'rank-5',
        name: 'School Capacity & Midday Meal Infra',
        loc: '⚪ Khunti, Jharkhand · 5 districts · Enrolment Gap: 34%',
        tag: 'tag-edu', tagLabel: 'Education',
        score: 7.9, scoreColor: 'var(--amber-300)',
        scoreGradient: 'linear-gradient(90deg, var(--amber-500), var(--amber-300))',
        population: '520k', popClass: 'imp-med',
        scoreBreakdown: [],
      },
      {
        rank: 6, rankClass: 'rank-6',
        name: 'Irrigation Canal + Cold Storage Network',
        loc: '⚪ Sarguja, MP · 8 blocks · Farmer Demand: HIGH',
        tag: 'tag-agri', tagLabel: 'Irrigation',
        score: 7.6, scoreColor: 'var(--emerald-400)',
        scoreGradient: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-300))',
        population: '360k', popClass: 'imp-low',
        scoreBreakdown: [],
      },
    ],

    insights: [
      {
        type: 'warn', icon: '💧',
        title: 'Project: Rural Drinking Water Network — UP',
        body: 'High demand + severe infrastructure deficit. Bundelkhand signal volume up 340% in 72h. Cross-validation with rainfall and census data confirms acute need. JJM Q3 disbursement window open.',
        meta: 'Population Impact: 4.2M · Budget: ₹847 Cr · Priority: HIGH',
        confidence: 94,
      },
      {
        type: 'crit', icon: '🏥',
        title: 'Project: PHC Expansion Programme — Bihar',
        body: '12 blocks average 1 PHC per 38,000 citizens vs. 1:25,000 national norm. Healthcare access demand is structurally unmet. NHM emergency allocation pathway available for immediate action.',
        meta: 'Population Impact: 2.8M · Budget: ₹420 Cr · Priority: HIGH',
        confidence: 89,
      },
      {
        type: 'pos', icon: '🛣',
        title: 'Project: Road Connectivity Phase 2 — Odisha',
        body: 'Phase 1 PMGSY completion linked to 23% market access gain and 18% school attendance rise. Phase 2 DPR complete. Recommend fast-track approval to expand proven impact model.',
        meta: 'Population Impact: 1.1M · Budget: ₹310 Cr · Priority: MEDIUM-HIGH',
        confidence: 87,
      },
      {
        type: 'info', icon: '⚡',
        title: 'Project: Solar Micro-Grid Corridor — Rajasthan',
        body: '32 unelectrified panchayats cluster within 40km optimal solar corridor. Combined tender reduces per-unit cost 34%. Digital connectivity can be co-deployed, amplifying strategic value.',
        meta: 'Population Impact: 640k · Potential Saving: ₹47 Cr · Priority: MEDIUM',
        confidence: 82,
      },
    ],

    clusters: [
      { icon: '💧', name: 'Water Infrastructure',  count: 4821, pct: 96, color: 'var(--sky-500)' },
      { icon: '🏥', name: 'Healthcare Access',     count: 3247, pct: 65, color: 'var(--emerald-500)' },
      { icon: '🛣', name: 'Road Connectivity',     count: 2819, pct: 56, color: 'var(--amber-500)' },
      { icon: '🌾', name: 'Irrigation & Farming',  count: 1924, pct: 38, color: 'var(--emerald-400)' },
      { icon: '📡', name: 'Digital Connectivity',  count: 1547, pct: 31, color: 'var(--indigo-500)' },
      { icon: '📚', name: 'School Capacity',       count: 1203, pct: 24, color: 'var(--amber-400)' },
    ],

    infraGaps: [
      { category: 'Water Supply',   pct: 37, delta: '−63%', color: 'var(--crimson-500)' },
      { category: 'PHC Coverage',   pct: 48, delta: '−52%', color: 'var(--crimson-400)' },
      { category: 'Road Paved',     pct: 61, delta: '−39%', color: 'var(--amber-500)' },
      { category: 'Electrification',pct: 74, delta: '−26%', color: 'var(--amber-400)' },
      { category: 'School Capacity',pct: 82, delta: '−18%', color: 'var(--emerald-500)' },
      { category: 'Digital Conn.',  pct: 29, delta: '−71%', color: 'var(--crimson-500)' },
      { category: 'Public Transport',pct:44, delta: '−56%', color: 'var(--amber-500)' },
    ],

    hotspotList: [
      { rank: '01', city: 'Tikamgarh', state: 'UP · Bundelkhand', score: 9.7, scoreColor: 'var(--crimson-400)', heatColor: 'var(--crimson-500)', heatCount: 5 },
      { rank: '02', city: 'Gaya',      state: 'Bihar',            score: 9.1, scoreColor: 'var(--crimson-400)', heatColor: 'var(--crimson-500)', heatCount: 4 },
      { rank: '03', city: 'Koraput',   state: 'Odisha',           score: 8.8, scoreColor: 'var(--amber-400)',   heatColor: 'var(--amber-500)',   heatCount: 4 },
      { rank: '04', city: 'Barmer',    state: 'Rajasthan',        score: 8.4, scoreColor: 'var(--amber-400)',   heatColor: 'var(--amber-500)',   heatCount: 3 },
      { rank: '05', city: 'Khunti',    state: 'Jharkhand',        score: 8.1, scoreColor: 'var(--amber-300)',   heatColor: 'var(--amber-400)',   heatCount: 3 },
      { rank: '06', city: 'Sarguja',   state: 'Chhattisgarh',     score: 7.8, scoreColor: 'var(--indigo-400)',  heatColor: 'var(--indigo-500)',  heatCount: 3 },
      { rank: '07', city: 'Washim',    state: 'Maharashtra',      score: 7.5, scoreColor: 'var(--indigo-300)',  heatColor: 'var(--indigo-400)',  heatCount: 3 },
    ],

    copilotHistory: [
      {
        role: 'assistant',
        text: 'Which development project should I recommend to the Finance Committee this week?',
        isPrompt: true,
      },
      {
        role: 'assistant',
        text: 'Prioritise <strong>Rural Drinking Water Network — Bundelkhand</strong>. It scores highest on all five dimensions: citizen demand (847 signals), infrastructure deficit (−63%), population impact (4.2M), JJM fund window closing in <strong>38 days</strong>, and 94% AI confidence. No other project offers this combination of urgency, readiness, and scale. Second-most urgent is the <strong>PHC Expansion in Bihar</strong> — recommend bundling both for a single Finance Committee submission.',
      },
    ],

    copilotSuggestions: [
      'Which projects are JJM-eligible?',
      'Show Bihar infrastructure gaps',
      'Compare water vs road priority',
      'What is the NHM allocation window?',
      'Top 3 projects for Q3 budget',
    ],
  },

  /* ─── Cached DOM selectors ──────────────────────────── */
  _el: {},

  /* ─── Init ──────────────────────────────────────────── */
  init() {
    this._cacheSelectors();
    this.renderDashboard();
    this.renderCharts();
    this.bindEvents();
    this._startClock();
    this._startLivePulse();
  },

  /* ─── Cache selectors ───────────────────────────────── */
  _cacheSelectors() {
    this._el = {
      navItems:       document.querySelectorAll('.nav-item'),
      priorityTbody:  document.querySelector('#priority-tbody'),
      insightList:    document.querySelector('#insight-list'),
      clusterGrid:    document.querySelector('#cluster-grid'),
      infraGaps:      document.querySelector('#infra-gaps'),
      hotspotRows:    document.querySelector('#hotspot-rows'),
      topbarSearch:   document.querySelector('#topbar-search'),
      signalCount:    document.querySelector('#signal-count'),
      pulseText:      document.querySelector('#pulse-text'),
      topbarTime:     document.querySelector('#topbar-time'),
      copilotInput:   document.querySelector('#copilot-input'),
      copilotSend:    document.querySelector('#copilot-send'),
      copilotChat:    document.querySelector('#copilot-chat'),
      copilotChips:   document.querySelector('#copilot-chips'),
      copilotModal:   document.querySelector('#copilot-modal'),
      copilotClose:   document.querySelector('#copilot-modal-close'),
      openCopilotBtn: document.querySelector('#open-copilot-btn'),
      exportPdfBtn:   document.querySelector('#export-pdf-btn'),
      generateBrief:  document.querySelector('#generate-brief-btn'),
      runAnalysisBtn: document.querySelector('#run-analysis-btn'),
      alertActionBtn: document.querySelector('#alert-action-btn'),
      pillBtns:       document.querySelectorAll('.pill-btn'),
    };
  },

  /* ─── Bind Events ───────────────────────────────────── */
  bindEvents() {
    // Sidebar navigation
    this._el.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this._el.navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        this.state.activeNav = item.dataset.navId || item.textContent.trim();
      });
    });

    // Topbar search — live filter priority table
    if (this._el.topbarSearch) {
      this._el.topbarSearch.addEventListener('input', (e) => {
        this._filterProjects(e.target.value.toLowerCase());
      });
    }

    // Pill buttons — toggle active state within their group
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-btn');
      if (!pill) return;
      const siblings = pill.closest('.panel-actions, .brief-header')?.querySelectorAll('.pill-btn');
      if (siblings) {
        siblings.forEach(p => {
          p.classList.remove('active');
          p.classList.add('inactive');
        });
        pill.classList.remove('inactive');
        pill.classList.add('active');
      }
    });

    // Governance Copilot open
    if (this._el.openCopilotBtn) {
      this._el.openCopilotBtn.addEventListener('click', () => this.openCopilot());
    }

    // Copilot modal close
    if (this._el.copilotClose) {
      this._el.copilotClose.addEventListener('click', () => this._closeCopilot());
    }
    if (this._el.copilotModal) {
      this._el.copilotModal.addEventListener('click', (e) => {
        if (e.target === this._el.copilotModal) this._closeCopilot();
      });
    }

    // Copilot send
    if (this._el.copilotSend) {
      this._el.copilotSend.addEventListener('click', () => this._sendCopilotMessage());
    }
    if (this._el.copilotInput) {
      this._el.copilotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._sendCopilotMessage();
      });
    }

    // Copilot chips
    if (this._el.copilotChips) {
      this._el.copilotChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.copilot-chip');
        if (!chip) return;
        if (this._el.copilotInput) {
          this._el.copilotInput.value = chip.textContent.trim();
          this._el.copilotInput.focus();
        }
      });
    }

    // Export PDF
    if (this._el.exportPdfBtn) {
      this._el.exportPdfBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Generate brief
    if (this._el.generateBrief) {
      this._el.generateBrief.addEventListener('click', () => {
        this.generateExecutiveBrief();
      });
    }

    // Run AI Analysis
    if (this._el.runAnalysisBtn) {
      this._el.runAnalysisBtn.addEventListener('click', () => {
        this._simulateAnalysis();
      });
    }

    // Alert action — scroll to priority section
    if (this._el.alertActionBtn) {
      this._el.alertActionBtn.addEventListener('click', () => {
        document.querySelector('.priority-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Insight cards — show detail tooltip on hover (already styled via CSS)
    // Cluster cards click
    document.addEventListener('click', (e) => {
      const cc = e.target.closest('.cluster-card');
      if (!cc) return;
      const name = cc.querySelector('.cluster-name')?.textContent;
      if (this._el.topbarSearch) {
        this._el.topbarSearch.value = name || '';
        this._filterProjects((name || '').toLowerCase());
      }
    });

    // Scope selector cosmetic toggle
    const scopeSel = document.querySelector('.scope-selector');
    if (scopeSel) {
      scopeSel.addEventListener('click', () => {
        const name = scopeSel.querySelector('.scope-name');
        if (name) {
          name.textContent = name.textContent === 'All India · National' ? 'Uttar Pradesh · State' : 'All India · National';
        }
      });
    }

    // Evidence fusion source cards — hover effect is CSS; click shows a quick toast
    document.addEventListener('click', (e) => {
      const fsc = e.target.closest('.fusion-source-card');
      if (fsc) {
        const sourceName = fsc.querySelector('.fsc-name')?.textContent;
        this._showToast(`Source: ${sourceName} — data ingested and verified ✓`);
      }
    });
  },

  /* ─── Render Dashboard ──────────────────────────────── */
  renderDashboard() {
    this.updateMetrics();
    this.updatePriorityEngine();
    this._renderInsights();
    this._renderClusters();
    this._renderInfraGaps();
    this._renderHotspotRows();
    this._renderCopilotChips();
  },

  /* ─── Update Metrics (KPI cards are static HTML, clock is dynamic) */
  updateMetrics() {
    if (this._el.signalCount) {
      this._el.signalCount.textContent = this.state.signalCount.toLocaleString();
    }
    if (this._el.pulseText) {
      this._el.pulseText.textContent = `Live · ${this.state.signalCount.toLocaleString()} development signals`;
    }
  },

  /* ─── Render Priority Engine Table ─────────────────── */
  updatePriorityEngine() {
    const tbody = this._el.priorityTbody;
    if (!tbody) return;
    tbody.innerHTML = this.state.projects.map(p => this._buildProjectRow(p)).join('');
  },

  _buildProjectRow(p) {
    const breakdown = p.scoreBreakdown.map(sb => `
      <div class="sb-row">
        <span class="sb-factor">${sb.factor}</span>
        <span class="sb-weight">${sb.weight}</span>
        <div class="sb-track"><div class="sb-fill" style="width:${sb.pct}%; background:${sb.color};"></div></div>
        <span class="sb-val" style="color:${sb.color};">${sb.val}</span>
      </div>`).join('');

    return `
      <tr>
        <td><div class="rank-badge ${p.rankClass}">${p.rank}</div></td>
        <td>
          <div class="project-name">${p.name}</div>
          <div class="project-loc">${p.loc}</div>
          ${breakdown ? `<div class="score-breakdown">${breakdown}</div>` : ''}
        </td>
        <td><span class="tag ${p.tag}">${p.tagLabel}</span></td>
        <td>
          <div class="score-bar-wrap">
            <div class="score-bar-bg"><div class="score-bar-fill" style="width:${p.score * 10}%; background:${p.scoreGradient};"></div></div>
            <span class="score-val" style="color:${p.scoreColor};">${p.score}</span>
          </div>
        </td>
        <td><span class="tag ${p.popClass}">${p.population}</span></td>
      </tr>`;
  },

  /* ─── Render AI Insight Cards ───────────────────────── */
  _renderInsights() {
    const el = this._el.insightList;
    if (!el) return;
    el.innerHTML = this.state.insights.map(ins => `
      <div class="insight-card ${ins.type}">
        <div class="insight-top">
          <div class="insight-icon">${ins.icon}</div>
          <div class="insight-title">${ins.title}</div>
        </div>
        <div class="insight-body">${ins.body}</div>
        <div class="insight-meta">${ins.meta}</div>
        <div class="confidence-bar-wrap">
          <span class="conf-label">AI Confidence</span>
          <div class="conf-track"><div class="conf-fill" style="width:${ins.confidence}%"></div></div>
          <span class="conf-val">${ins.confidence}%</span>
        </div>
      </div>`).join('');
  },

  /* ─── Render Charts (Cluster cards) ─────────────────── */
  renderCharts() {
    this._renderClusters();
  },

  _renderClusters() {
    const el = this._el.clusterGrid;
    if (!el) return;
    el.innerHTML = this.state.clusters.map(c => `
      <div class="cluster-card">
        <div class="cluster-icon">${c.icon}</div>
        <div class="cluster-name">${c.name}</div>
        <div><span class="cluster-count">${c.count.toLocaleString()}</span><span class="cluster-unit">suggestions</span></div>
        <div class="cluster-bar"><div class="cluster-fill" style="width:${c.pct}%; background:${c.color};"></div></div>
      </div>`).join('');
  },

  /* ─── Render Infra Gaps ─────────────────────────────── */
  _renderInfraGaps() {
    const el = this._el.infraGaps;
    if (!el) return;
    el.innerHTML = this.state.infraGaps.map(g => `
      <div class="gap-row">
        <div class="gap-category">${g.category}</div>
        <div class="gap-track"><div class="gap-fill" style="width:${g.pct}%; background:${g.color};"></div></div>
        <div class="gap-val">${g.pct}%</div>
        <div class="gap-delta neg">${g.delta}</div>
      </div>`).join('');
  },

  /* ─── Render Hotspot Table ──────────────────────────── */
  renderHotspots() {
    this._renderHotspotRows();
  },

  _renderHotspotRows() {
    const el = this._el.hotspotRows;
    if (!el) return;
    el.innerHTML = this.state.hotspotList.map(h => {
      const blocks = Array.from({ length: 5 }, (_, i) => {
        const isActive = i < h.heatCount;
        const opacity = isActive ? 1 : (i === h.heatCount ? 0.3 : 0.1);
        const heightMap = [18, 16, 14, 12, 10];
        const ht = heightMap[i] || 8;
        const bg = isActive ? h.heatColor : `rgba(${h.heatColor === 'var(--crimson-500)' ? '239,68,68' : h.heatColor === 'var(--amber-500)' ? '245,158,11' : '99,102,241'}, ${opacity})`;
        return `<div class="heat-block" style="height:${ht}px; background:${bg};"></div>`;
      }).join('');
      return `
        <div class="hs-row">
          <div class="hs-rank">${h.rank}</div>
          <div class="hs-location">
            <div class="hs-city">${h.city}</div>
            <div class="hs-state">${h.state}</div>
          </div>
          <div class="hs-heat">${blocks}</div>
          <div class="hs-score" style="color:${h.scoreColor};">${h.score}</div>
        </div>`;
    }).join('');
  },

  /* ─── Filter Projects ───────────────────────────────── */
  _filterProjects(query) {
    const tbody = this._el.priorityTbody;
    if (!tbody) return;
    if (!query) {
      this.updatePriorityEngine();
      return;
    }
    const filtered = this.state.projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.loc.toLowerCase().includes(query) ||
      p.tagLabel.toLowerCase().includes(query)
    );
    tbody.innerHTML = filtered.length
      ? filtered.map(p => this._buildProjectRow(p)).join('')
      : `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-tertiary); font-family:var(--font-mono); font-size:11px;">No projects match "${query}"</td></tr>`;
  },

  /* ─── Render Copilot Suggestion Chips ───────────────── */
  _renderCopilotChips() {
    const el = this._el.copilotChips;
    if (!el) return;
    el.innerHTML = this.state.copilotSuggestions.map(s =>
      `<span class="copilot-chip">${s}</span>`
    ).join('');
  },

  /* ─── Governance Copilot ────────────────────────────── */
  openCopilot() {
    if (this._el.copilotModal) {
      this._el.copilotModal.classList.add('open');
      this._renderCopilotChat();
      if (this._el.copilotInput) this._el.copilotInput.focus();
    }
  },

  _closeCopilot() {
    if (this._el.copilotModal) {
      this._el.copilotModal.classList.remove('open');
    }
  },

  _renderCopilotChat() {
    const el = this._el.copilotChat;
    if (!el) return;
    el.innerHTML = this.state.copilotHistory.map(msg => {
      if (msg.isPrompt) {
        return `<div class="chat-msg user">
          <div class="label">MP Query</div>
          "${msg.text}"
        </div>`;
      }
      return `<div class="chat-msg assistant">
        <div class="label">JanVikas AI</div>
        ${msg.text}
      </div>`;
    }).join('');
    el.scrollTop = el.scrollHeight;
  },

  _sendCopilotMessage() {
    const input = this._el.copilotInput;
    if (!input || !input.value.trim()) return;
    const userMsg = input.value.trim();
    input.value = '';

    this.state.copilotHistory.push({ role: 'user', text: userMsg, isPrompt: true });
    this._renderCopilotChat();

    // Simulate AI response
    const loadingMsg = { role: 'assistant', text: '<em style="color:var(--text-tertiary);">Analysing development data…</em>' };
    this.state.copilotHistory.push(loadingMsg);
    this._renderCopilotChat();

    setTimeout(() => {
      const response = this._generateCopilotResponse(userMsg);
      this.state.copilotHistory.pop();
      this.state.copilotHistory.push({ role: 'assistant', text: response });
      this._renderCopilotChat();
    }, 1200);
  },

  _generateCopilotResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('jjm') || q.includes('jal jeevan') || q.includes('water')) {
      return `<strong>JJM-Eligible Projects:</strong> The Rural Drinking Water Network (Bundelkhand, UP) is the primary JJM-eligible project with a priority score of 9.4. The fund disbursement window closes in <strong>38 days</strong>. Budget required: ₹847 Cr. Immediate action recommended.`;
    }
    if (q.includes('bihar') || q.includes('gaya')) {
      return `<strong>Bihar Infrastructure Analysis:</strong> Gaya district scores 9.1 on the hotspot index. PHC coverage is at 48% (national norm: 67%). Road connectivity is 61% paved. <strong>PHC Expansion (₹420 Cr)</strong> is the top priority for Bihar — NHM emergency allocation pathway is available.`;
    }
    if (q.includes('nhm') || q.includes('health') || q.includes('phc')) {
      return `<strong>NHM Allocation Window:</strong> The National Health Mission emergency allocation window is currently open for Bihar's Magadh and Gaya divisions. The PHC Expansion Programme (₹420 Cr) is pre-approved under NHM norms. Recommend submitting DPR within 21 days before Q3 budget lock.`;
    }
    if (q.includes('compar') || q.includes('water vs road') || q.includes('road vs water')) {
      return `<strong>Water vs. Road Priority Comparison:</strong> Rural Water Network scores <strong>9.4</strong> (4.2M population impact) vs. Road Connectivity at <strong>8.6</strong> (1.1M impact). Water addresses life-critical need at 15× signal volume. Road Phase 2 DPR is complete — schedule for Q4. Recommend Water Network first.`;
    }
    if (q.includes('top') || q.includes('budget') || q.includes('q3') || q.includes('quarter')) {
      return `<strong>Top 3 Projects for Q3 Budget (FY2026-27):</strong><br>
        1. 💧 Rural Water Network — ₹847 Cr · JJM · Priority 9.4<br>
        2. 🏥 PHC Expansion Bihar — ₹420 Cr · NHM · Priority 8.9<br>
        3. 🛣 Road PMGSY Ph.2 — ₹310 Cr · PMGSY · Priority 8.6<br>
        Combined budget: ₹1,577 Cr. All three have open fund windows. Recommend bundled Finance Committee submission.`;
    }
    return `<strong>AI Analysis:</strong> Based on current development signals and infrastructure data, the <strong>Rural Drinking Water Network</strong> (Bundelkhand, UP) remains the highest-priority recommendation at score 9.4/10. For specific queries about districts, schemes, or project comparisons, please ask directly and I will provide a targeted analysis.`;
  },

  /* ─── Executive Brief Generation ───────────────────── */
  generateExecutiveBrief() {
    const btn = this._el.generateBrief;
    if (!btn) return;

    btn.textContent = '⏳ Generating Report…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✅ Report Generated — Check Console / Print';
      btn.disabled = false;

      // Trigger print dialog with the page
      setTimeout(() => {
        window.print();
        btn.innerHTML = '✨ Generate Full Development Planning Report';
      }, 500);
    }, 1800);
  },

  /* ─── Clock ─────────────────────────────────────────── */
  _startClock() {
    const el = this._el.topbarTime;
    if (!el) return;
    const update = () => {
      const now = new Date();
      const opts = { day: '2-digit', month: 'short', year: 'numeric' };
      const dateStr = now.toLocaleDateString('en-IN', opts);
      el.textContent = `${dateStr} · Q2 FY26`;
    };
    update();
    setInterval(update, 60000);
  },

  /* ─── Live pulse counter ────────────────────────────── */
  _startLivePulse() {
    setInterval(() => {
      const delta = Math.floor(Math.random() * 3);
      if (Math.random() > 0.5) {
        this.state.signalCount += delta;
        this.updateMetrics();
      }
    }, 8000);
  },

  /* ─── Simulate AI Analysis ──────────────────────────── */
  _simulateAnalysis() {
    const btn = this._el.runAnalysisBtn;
    if (!btn) return;
    btn.textContent = '⏳ Analysing…';
    btn.disabled = true;

    setTimeout(() => {
      // Bump signal count to simulate new data
      this.state.signalCount += Math.floor(Math.random() * 50) + 10;
      this.updateMetrics();

      btn.innerHTML = '✨ Run AI Analysis';
      btn.disabled = false;

      this._showToast('AI Analysis complete — priority scores recalculated');
    }, 2000);
  },

  /* ─── Toast notification ────────────────────────────── */
  _showToast(msg) {
    let toast = document.querySelector('#jv-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jv-toast';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '24px', right: '24px',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)',
        borderRadius: 'var(--r-md)', padding: '12px 18px',
        fontSize: '12px', color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: '500', opacity: '0',
        transition: 'opacity 0.3s',
        maxWidth: '320px', lineHeight: '1.5',
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  JanVikasAI.init();
});
