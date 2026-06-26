/* ═══════════════════════════════════════════════════════
   JanVikas AI — script.js
   Production-ready, modular, ES6 application controller
═══════════════════════════════════════════════════════ */

const JanVikasAI = {

  /* ─── State ─────────────────────────────────────────── */
  state: {
    activeNav: 'command-center',
    signalCount: 1247,
    mapFilter: { state: 'all', theme: 'all' },

    /* ── Mock suggestion markers for the Leaflet map ── */
    suggestions: [
      {
        id: 1,
        lat: 25.04,  lng: 78.97,
        city: 'Tikamgarh', state: 'Uttar Pradesh', district: 'Bundelkhand',
        theme: 'Water Infrastructure',
        title: 'Rural Drinking Water Network',
        support: 4821, priority: 9.4,
        severity: 'critical',   // critical | high | moderate | good
        budget: '₹847 Cr', scheme: 'JJM',
        detail: '6 districts · Demand+Deficit+Impact: HIGH',
      },
      {
        id: 2,
        lat: 24.74,  lng: 84.99,
        city: 'Gaya', state: 'Bihar', district: 'Magadh',
        theme: 'Healthcare Access',
        title: 'PHC Expansion Programme',
        support: 3247, priority: 8.9,
        severity: 'critical',
        budget: '₹420 Cr', scheme: 'NHM',
        detail: '12 blocks · Infra Deficit: CRITICAL',
      },
      {
        id: 3,
        lat: 18.81,  lng: 82.71,
        city: 'Koraput', state: 'Odisha', district: 'Koraput',
        theme: 'Road Connectivity',
        title: 'Rural Road Connectivity (PMGSY Ph.2)',
        support: 2819, priority: 8.6,
        severity: 'high',
        budget: '₹310 Cr', scheme: 'PMGSY',
        detail: '89 villages · Plan Alignment: HIGH',
      },
      {
        id: 4,
        lat: 25.74,  lng: 71.39,
        city: 'Barmer', state: 'Rajasthan', district: 'Barmer',
        theme: 'Energy Access',
        title: 'Solar Micro-Grid Electrification',
        support: 1547, priority: 8.2,
        severity: 'high',
        budget: '₹180 Cr', scheme: 'PM-KUSUM',
        detail: '32 panchayats · Strategic: HIGH',
      },
      {
        id: 5,
        lat: 23.07,  lng: 85.28,
        city: 'Khunti', state: 'Jharkhand', district: 'Khunti',
        theme: 'School Capacity',
        title: 'School Capacity & Midday Meal Infra',
        support: 1203, priority: 7.9,
        severity: 'high',
        budget: '₹95 Cr', scheme: 'Samagra Shiksha',
        detail: '5 districts · Enrolment Gap: 34%',
      },
      {
        id: 6,
        lat: 23.78,  lng: 83.07,
        city: 'Sarguja', state: 'Chhattisgarh', district: 'Sarguja',
        theme: 'Irrigation & Farming',
        title: 'Irrigation Canal + Cold Storage Network',
        support: 1924, priority: 7.6,
        severity: 'moderate',
        budget: '₹210 Cr', scheme: 'PMKSY',
        detail: '8 blocks · Farmer Demand: HIGH',
      },
      {
        id: 7,
        lat: 20.11,  lng: 77.30,
        city: 'Washim', state: 'Maharashtra', district: 'Washim',
        theme: 'Water Infrastructure',
        title: 'Village Water Harvesting Network',
        support: 987, priority: 7.5,
        severity: 'moderate',
        budget: '₹140 Cr', scheme: 'JJM',
        detail: '14 villages · Seasonal drought risk',
      },
      {
        id: 8,
        lat: 26.45,  lng: 80.33,
        city: 'Kanpur Dehat', state: 'Uttar Pradesh', district: 'Kanpur',
        theme: 'Digital Connectivity',
        title: 'Rural Broadband Rollout',
        support: 872, priority: 7.2,
        severity: 'moderate',
        budget: '₹88 Cr', scheme: 'BharatNet',
        detail: '22 gram panchayats · Last-mile gap',
      },
      {
        id: 9,
        lat: 8.52,   lng: 76.94,
        city: 'Thiruvananthapuram', state: 'Kerala', district: 'TVM',
        theme: 'Healthcare Access',
        title: 'Community Health Worker Programme',
        support: 620, priority: 5.8,
        severity: 'good',
        budget: '₹42 Cr', scheme: 'NHM',
        detail: 'Well-served region · Maintenance only',
      },
      {
        id: 10,
        lat: 27.18,  lng: 78.01,
        city: 'Agra', state: 'Uttar Pradesh', district: 'Agra',
        theme: 'Road Connectivity',
        title: 'Urban Feeder Road Upgradation',
        support: 745, priority: 6.8,
        severity: 'moderate',
        budget: '₹65 Cr', scheme: 'PMGSY',
        detail: '8 localities · Connectivity gap',
      },
      {
        id: 11,
        lat: 22.57,  lng: 88.36,
        city: 'Kanksa', state: 'West Bengal', district: 'Barddhaman',
        theme: 'Road Connectivity',
        title: 'PMGSY Phase 1 — Outcome Validated',
        support: 1100, priority: 6.2,
        severity: 'good',
        budget: '₹155 Cr', scheme: 'PMGSY',
        detail: 'Ambulance access restored · OUTCOME VALIDATED',
      },
      {
        id: 12,
        lat: 21.14,  lng: 79.08,
        city: 'Nagpur', state: 'Maharashtra', district: 'Nagpur',
        theme: 'Irrigation & Farming',
        title: 'Drip Irrigation Network — Vidarbha',
        support: 1340, priority: 7.1,
        severity: 'high',
        budget: '₹190 Cr', scheme: 'PMKSY',
        detail: '12 talukas · Farmer distress zone',
      },
    ],

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
          { factor: 'Citizen Demand',    weight: '30%', pct: 97, color: 'var(--sky-400)',     val: '9.7' },
          { factor: 'Infra Deficit',     weight: '25%', pct: 96, color: 'var(--crimson-400)', val: '9.6' },
          { factor: 'Population Impact', weight: '20%', pct: 95, color: 'var(--emerald-400)', val: '9.5' },
          { factor: 'Plan Alignment',    weight: '15%', pct: 90, color: 'var(--amber-400)',   val: '9.0' },
          { factor: 'Strategic',         weight: '10%', pct: 88, color: 'var(--violet-400)',  val: '8.8' },
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
          { factor: 'Citizen Demand',    weight: '30%', pct: 88, color: 'var(--sky-400)',     val: '8.8' },
          { factor: 'Infra Deficit',     weight: '25%', pct: 93, color: 'var(--crimson-400)', val: '9.3' },
          { factor: 'Population Impact', weight: '20%', pct: 88, color: 'var(--emerald-400)', val: '8.8' },
          { factor: 'Plan Alignment',    weight: '15%', pct: 85, color: 'var(--amber-400)',   val: '8.5' },
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
          { factor: 'Citizen Demand', weight: '30%', pct: 84, color: 'var(--sky-400)',     val: '8.4' },
          { factor: 'Infra Deficit',  weight: '25%', pct: 80, color: 'var(--crimson-400)', val: '8.0' },
          { factor: 'Plan Alignment', weight: '15%', pct: 95, color: 'var(--amber-400)',   val: '9.5' },
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
      { icon: '💧', name: 'Water Infrastructure', count: 4821, pct: 96, color: 'var(--sky-500)' },
      { icon: '🏥', name: 'Healthcare Access',    count: 3247, pct: 65, color: 'var(--emerald-500)' },
      { icon: '🛣', name: 'Road Connectivity',    count: 2819, pct: 56, color: 'var(--amber-500)' },
      { icon: '🌾', name: 'Irrigation & Farming', count: 1924, pct: 38, color: 'var(--emerald-400)' },
      { icon: '📡', name: 'Digital Connectivity', count: 1547, pct: 31, color: 'var(--indigo-500)' },
      { icon: '📚', name: 'School Capacity',      count: 1203, pct: 24, color: 'var(--amber-400)' },
    ],

    infraGaps: [
      { category: 'Water Supply',    pct: 37, delta: '−63%', color: 'var(--crimson-500)' },
      { category: 'PHC Coverage',    pct: 48, delta: '−52%', color: 'var(--crimson-400)' },
      { category: 'Road Paved',      pct: 61, delta: '−39%', color: 'var(--amber-500)' },
      { category: 'Electrification', pct: 74, delta: '−26%', color: 'var(--amber-400)' },
      { category: 'School Capacity', pct: 82, delta: '−18%', color: 'var(--emerald-500)' },
      { category: 'Digital Conn.',   pct: 29, delta: '−71%', color: 'var(--crimson-500)' },
      { category: 'Public Transport',pct: 44, delta: '−56%', color: 'var(--amber-500)' },
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

  /* ─── Internal refs ──────────────────────────────────── */
  _el: {},
  _map: null,          // Leaflet map instance
  _markers: [],        // active Leaflet marker objects

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  init() {
    this._cacheSelectors();
    this.renderDashboard();
    this.bindEvents();
    this._initMap();
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
      exportPdfBtn:   document.querySelector('#export-pdf-btn'),
      generateBrief:  document.querySelector('#generate-brief-btn'),
      runAnalysisBtn: document.querySelector('#run-analysis-btn'),
      alertActionBtn: document.querySelector('#alert-action-btn'),
      mapEl:          document.querySelector('#jv-map'),
    };
  },

  /* ═══════════════════════════════════════════════════════
     BIND EVENTS
  ═══════════════════════════════════════════════════════ */
  bindEvents() {
    /* ── Sidebar navigation ─────────────────────────────
       Sets active class on the clicked nav item.
       Items with data-opens-copilot also open the modal.
       All navigation is handled here so active state is
       always correct regardless of which action fires.   */
    this._el.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. Update active state on every nav item
        this._el.navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        this.state.activeNav = item.dataset.navId || '';

        // 2. Secondary action — open copilot modal if flagged
        if (item.dataset.opensCopilot === 'true') {
          this.openCopilot();
        }

// 3. Section scroll — map scroll targets to visible panels
        const scrollMap = {
          'command-center':        '.page-header',
          'development-priorities':'.priority-panel',
          'demand-hotspots':       '.heatmap-panel',
          'infrastructure-gaps':   '#infra-gaps',
          'ai-recommendations':    '.ai-panel',
          'governance-copilot':    '.ai-panel',
          'executive-brief':       '.brief-section',
          'dpr-generator':         '.brief-section',
          'budget-proposals':      '.brief-section',
          'citizen-signals':       '.signals-panel',
          'development-themes':    '.fusion-section',
          'district-compare':      '.fusion-section',
        };
const target = scrollMap[this.state.activeNav];
        if (target && item.dataset.opensCopilot !== 'true') {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
        }
      });
    });

    /* ── Topbar search — live filter priority table ───── */
    if (this._el.topbarSearch) {
      this._el.topbarSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        this._filterProjects(q);
        // Also filter map markers by search term
        this._applyMapFilter({ search: q });
      });
    }

    /* ── Pill buttons — toggle within their action group  */
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill-btn');
      if (!pill) return;

      const group = pill.closest('.panel-actions');
      if (group) {
        group.querySelectorAll('.pill-btn').forEach(p => {
          p.classList.remove('active');
          p.classList.add('inactive');
        });
        pill.classList.remove('inactive');
        pill.classList.add('active');
      }

      // Map layer switcher — pills inside the heatmap panel
      const heatmapPanel = pill.closest('.heatmap-panel');
      if (heatmapPanel) {
        const label = pill.textContent.trim();
        this._applyMapFilter({ layer: label });
      }
    });

    /* ── Copilot modal ─────────────────────────────────  */
    if (this._el.copilotClose) {
      this._el.copilotClose.addEventListener('click', () => this._closeCopilot());
    }
    if (this._el.copilotModal) {
      this._el.copilotModal.addEventListener('click', (e) => {
        if (e.target === this._el.copilotModal) this._closeCopilot();
      });
    }
    if (this._el.copilotSend) {
      this._el.copilotSend.addEventListener('click', () => this._sendCopilotMessage());
    }
    if (this._el.copilotInput) {
      this._el.copilotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._sendCopilotMessage();
      });
    }
    if (this._el.copilotChips) {
      this._el.copilotChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.copilot-chip');
        if (!chip || !this._el.copilotInput) return;
        this._el.copilotInput.value = chip.textContent.trim();
        this._el.copilotInput.focus();
      });
    }

    /* ── Toolbar buttons ────────────────────────────────  */
    if (this._el.exportPdfBtn) {
      this._el.exportPdfBtn.addEventListener('click', () => window.print());
    }
    const exportBriefBtn = document.querySelector('#export-brief-pdf');
    if (exportBriefBtn) {
      exportBriefBtn.addEventListener('click', () => window.print());
    }
    if (this._el.generateBrief) {
      this._el.generateBrief.addEventListener('click', () => this.generateExecutiveBrief());
    }
    if (this._el.runAnalysisBtn) {
      this._el.runAnalysisBtn.addEventListener('click', () => this._simulateAnalysis());
    }
    if (this._el.alertActionBtn) {
      this._el.alertActionBtn.addEventListener('click', () => {
        document.querySelector('.priority-panel')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* ── Cluster cards — filter map + priority table ─── */
    document.addEventListener('click', (e) => {
      const cc = e.target.closest('.cluster-card');
      if (!cc) return;
      const name = cc.querySelector('.cluster-name')?.textContent?.trim() || '';
      if (this._el.topbarSearch) this._el.topbarSearch.value = name;
      this._filterProjects(name.toLowerCase());
      this._applyMapFilter({ theme: name });
    });

    /* ── Scope selector ─────────────────────────────────  */
    const scopeSel = document.querySelector('.scope-selector');
    if (scopeSel) {
      const scopes = ['All India · National', 'Uttar Pradesh · State', 'Bihar · State', 'Odisha · State'];
      let scopeIdx = 0;
      scopeSel.addEventListener('click', () => {
        scopeIdx = (scopeIdx + 1) % scopes.length;
        const nameEl = scopeSel.querySelector('.scope-name');
        if (nameEl) nameEl.textContent = scopes[scopeIdx];
        // Filter map markers by selected state
        const stateFilter = scopeIdx === 0 ? 'all' : scopes[scopeIdx].split(' · ')[0];
        this._applyMapFilter({ state: stateFilter });
      });
    }

    /* ── Evidence fusion cards — click toast ────────────  */
    document.addEventListener('click', (e) => {
      const fsc = e.target.closest('.fusion-source-card');
      if (!fsc) return;
      const sourceName = fsc.querySelector('.fsc-name')?.textContent?.trim() || '';
      this._showToast(`Source: ${sourceName} — data ingested and verified ✓`);
    });
  },

  /* ═══════════════════════════════════════════════════════
     RENDER DASHBOARD
  ═══════════════════════════════════════════════════════ */
  renderDashboard() {
    this.updateMetrics();
    this.updatePriorityEngine();
    this._renderInsights();
    this._renderClusters();
    this._renderInfraGaps();
    this._renderHotspotRows();
    this._renderCopilotChips();
  },

  /* ─── Metrics ───────────────────────────────────────── */
  updateMetrics() {
    if (this._el.signalCount) {
      this._el.signalCount.textContent = this.state.signalCount.toLocaleString('en-IN');
    }
    if (this._el.pulseText) {
      this._el.pulseText.textContent =
        `Live · ${this.state.signalCount.toLocaleString('en-IN')} development signals`;
    }
  },

  /* ─── Priority Engine Table ─────────────────────────── */
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
        <div class="sb-track"><div class="sb-fill" style="width:${sb.pct}%;background:${sb.color};"></div></div>
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
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width:${p.score * 10}%;background:${p.scoreGradient};"></div>
            </div>
            <span class="score-val" style="color:${p.scoreColor};">${p.score}</span>
          </div>
        </td>
        <td><span class="tag ${p.popClass}">${p.population}</span></td>
      </tr>`;
  },

  /* ─── AI Insight Cards ──────────────────────────────── */
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

  /* ─── Cluster Cards ─────────────────────────────────── */
  renderCharts() { this._renderClusters(); },

  _renderClusters() {
    const el = this._el.clusterGrid;
    if (!el) return;
    el.innerHTML = this.state.clusters.map(c => `
      <div class="cluster-card">
        <div class="cluster-icon">${c.icon}</div>
        <div class="cluster-name">${c.name}</div>
        <div><span class="cluster-count">${c.count.toLocaleString('en-IN')}</span><span class="cluster-unit">suggestions</span></div>
        <div class="cluster-bar"><div class="cluster-fill" style="width:${c.pct}%;background:${c.color};"></div></div>
      </div>`).join('');
  },

  /* ─── Infra Gaps ────────────────────────────────────── */
  _renderInfraGaps() {
    const el = this._el.infraGaps;
    if (!el) return;
    el.innerHTML = this.state.infraGaps.map(g => `
      <div class="gap-row">
        <div class="gap-category">${g.category}</div>
        <div class="gap-track"><div class="gap-fill" style="width:${g.pct}%;background:${g.color};"></div></div>
        <div class="gap-val">${g.pct}%</div>
        <div class="gap-delta neg">${g.delta}</div>
      </div>`).join('');
  },

  /* ─── Hotspot Table Rows ────────────────────────────── */
  renderHotspots() { this._renderHotspotRows(); },

  _renderHotspotRows() {
    const el = this._el.hotspotRows;
    if (!el) return;
    el.innerHTML = this.state.hotspotList.map(h => {
      const colorRGB = {
        'var(--crimson-500)': '239,68,68',
        'var(--amber-500)':   '245,158,11',
        'var(--amber-400)':   '251,191,36',
        'var(--indigo-500)':  '99,102,241',
        'var(--indigo-400)':  '129,140,248',
      };
      const rgb = colorRGB[h.heatColor] || '99,102,241';
      const blocks = Array.from({ length: 5 }, (_, i) => {
        const active = i < h.heatCount;
        const heightMap = [18, 16, 14, 12, 10];
        const ht = heightMap[i] || 8;
        const bg = active ? h.heatColor : `rgba(${rgb},${i === h.heatCount ? 0.25 : 0.08})`;
        return `<div class="heat-block" style="height:${ht}px;background:${bg};"></div>`;
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

  /* ─── Filter projects ───────────────────────────────── */
  _filterProjects(query) {
    const tbody = this._el.priorityTbody;
    if (!tbody) return;
    if (!query) { this.updatePriorityEngine(); return; }
    const filtered = this.state.projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.loc.toLowerCase().includes(query) ||
      p.tagLabel.toLowerCase().includes(query)
    );
    tbody.innerHTML = filtered.length
      ? filtered.map(p => this._buildProjectRow(p)).join('')
      : `<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-tertiary);font-family:var(--font-mono);font-size:11px;">No projects match "${query}"</td></tr>`;
  },

  /* ─── Copilot chips ─────────────────────────────────── */
  _renderCopilotChips() {
    const el = this._el.copilotChips;
    if (!el) return;
    el.innerHTML = this.state.copilotSuggestions
      .map(s => `<span class="copilot-chip">${s}</span>`)
      .join('');
  },

  /* ═══════════════════════════════════════════════════════
     LEAFLET MAP
  ═══════════════════════════════════════════════════════ */

  /* Severity → hex colour used for both marker fill and popup accent */
  _severityColor(severity) {
    const map = {
      critical: '#EF4444',   // crimson-500
      high:     '#F59E0B',   // amber-500
      moderate: '#6366F1',   // indigo-500
      good:     '#10B981',   // emerald-500
    };
    return map[severity] || '#6366F1';
  },

  /* Build a custom circle-div-icon */
  _makeIcon(severity) {
    const color = this._severityColor(severity);
    const inner = severity === 'critical' || severity === 'high' ? 10 : 8;
    const ring  = inner + 6;
    return L.divIcon({
      className: '',
      iconSize:  [ring * 2, ring * 2],
      iconAnchor:[ring, ring],
      popupAnchor:[0, -(ring + 4)],
      html: `
        <div style="
          width:${ring*2}px;height:${ring*2}px;
          border-radius:50%;
          background:${color}22;
          border:2px solid ${color}55;
          display:flex;align-items:center;justify-content:center;
          animation:jv-pulse 2.6s ease-in-out infinite;
        ">
          <div style="
            width:${inner*2}px;height:${inner*2}px;
            border-radius:50%;
            background:${color};
            box-shadow:0 0 8px ${color};
          "></div>
        </div>`,
    });
  },

  /* Build popup HTML for a suggestion */
  _buildPopupHTML(s) {
    const color    = this._severityColor(s.severity);
    const sevLabel = { critical:'🔴 Critical', high:'🟠 High', moderate:'🔵 Moderate', good:'🟢 Well Served' };
    return `
      <div style="
        font-family:'Inter',sans-serif;
        background:#0F1929;
        border:1px solid ${color}55;
        border-top:3px solid ${color};
        border-radius:10px;
        padding:14px 16px;
        min-width:230px;
        max-width:280px;
        color:#F0F4FF;
        box-shadow:0 8px 24px rgba(0,0,0,0.6);
      ">
        <div style="font-size:9px;font-family:'JetBrains Mono',monospace;color:${color};letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;">
          ${s.theme}
        </div>
        <div style="font-size:13px;font-weight:700;font-family:'Space Grotesk',sans-serif;margin-bottom:4px;line-height:1.3;">
          ${s.title}
        </div>
        <div style="font-size:10px;color:#94A3B8;font-family:'JetBrains Mono',monospace;margin-bottom:10px;">
          📍 ${s.city}, ${s.state}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:7px 10px;">
            <div style="font-size:9px;color:#4B5E7F;font-family:'JetBrains Mono',monospace;margin-bottom:2px;">SUPPORT</div>
            <div style="font-size:16px;font-weight:700;font-family:'Space Grotesk',sans-serif;color:#A5B4FC;">${s.support.toLocaleString('en-IN')}</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:7px 10px;">
            <div style="font-size:9px;color:#4B5E7F;font-family:'JetBrains Mono',monospace;margin-bottom:2px;">PRIORITY</div>
            <div style="font-size:16px;font-weight:700;font-family:'Space Grotesk',sans-serif;color:${color};">${s.priority}</div>
          </div>
        </div>
        <div style="font-size:10px;color:#94A3B8;margin-bottom:6px;">${s.detail}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px;">
          <span style="font-size:9px;background:rgba(99,102,241,0.15);color:#818CF8;padding:2px 7px;border-radius:4px;font-family:'JetBrains Mono',monospace;">${s.scheme}</span>
          <span style="font-size:9px;background:rgba(255,255,255,0.05);color:#94A3B8;padding:2px 7px;border-radius:4px;font-family:'JetBrains Mono',monospace;">${s.budget}</span>
          <span style="font-size:9px;padding:2px 7px;border-radius:4px;font-family:'JetBrains Mono',monospace;background:${color}22;color:${color};">${sevLabel[s.severity]}</span>
        </div>
      </div>`;
  },

  /* Inject the CSS keyframe animation for markers once */
  _injectMapStyles() {
    if (document.getElementById('jv-map-styles')) return;
    const style = document.createElement('style');
    style.id = 'jv-map-styles';
    style.textContent = `
      @keyframes jv-pulse {
        0%,100% { transform:scale(1); opacity:1; }
        50%      { transform:scale(1.15); opacity:0.8; }
      }
      /* Override Leaflet tile brightness to match dark theme */
      .leaflet-tile { filter: brightness(0.45) saturate(0.6) hue-rotate(180deg); }
      /* Popup overrides — remove default white box */
      .leaflet-popup-content-wrapper,
      .leaflet-popup-tip { background:transparent !important; box-shadow:none !important; padding:0 !important; }
      .leaflet-popup-content { margin:0 !important; }
      .leaflet-container { background:#03040A; }
      /* Attribution small */
      .leaflet-control-attribution { font-size:8px !important; opacity:0.4; }
    `;
    document.head.appendChild(style);
  },

  /* Init the Leaflet map */
  _initMap() {
    const el = this._el.mapEl;
    if (!el || typeof L === 'undefined') return;

    this._injectMapStyles();

    // Centre on India
    this._map = L.map(el, {
      center: [22.5, 80.5],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // OpenStreetMap tiles (dark-filtered via CSS)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(this._map);

    // Place all markers
    this._placeMarkers(this.state.suggestions);

  // Fix map size after CSS layout settles — two calls to handle aspect-ratio timing
    setTimeout(() => { this._map.invalidateSize(); }, 300);
    setTimeout(() => { this._map.invalidateSize(); }, 1000);

/* Place (or replace) markers for the given suggestion array */
  _placeMarkers(suggestions) {
    if (!this._map) return;
    // Remove existing markers
    this._markers.forEach(m => m.remove());
    this._markers = [];

    suggestions.forEach(s => {
      const icon   = this._makeIcon(s.severity);
      const marker = L.marker([s.lat, s.lng], { icon })
        .addTo(this._map)
        .bindPopup(this._buildPopupHTML(s), {
          maxWidth: 300,
          className: 'jv-popup',
        });

      // Tooltip on hover
      marker.bindTooltip(
        `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#A5B4FC;">${s.city} · ${s.theme}</span>`,
        { direction: 'top', offset: [0, -8], className: 'jv-tooltip' }
      );

      this._markers.push(marker);
    });
  },

  /* Apply filter to map markers based on active filters.
     Accepts an object with any of: { state, theme, search, layer } */
  _applyMapFilter(updates = {}) {
 _applyMapFilter(updates = {}) {
    if (!this._map) return;
    // Merge updates into persistent filter state
    Object.assign(this.state.mapFilter, updates);
    const { state: stateF, theme, search, layer } = this.state.mapFilter;

    let visible = this.state.suggestions;

    if (stateF && stateF !== 'all') {
      visible = visible.filter(s => s.state.toLowerCase().startsWith(stateF.toLowerCase()));
    }
    if (theme && theme !== 'all') {
      visible = visible.filter(s => s.theme.toLowerCase().includes(theme.toLowerCase()));
    }
    if (search && search.trim() !== '') {
      const q = search.trim();
      visible = visible.filter(s =>
        s.city.toLowerCase().includes(q)  ||
        s.state.toLowerCase().includes(q) ||
        s.theme.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q)
      );
    }
    // Layer filter (Demand / Infra Gap / Funds) — all show same data in mock
    // but filter by severity as a proxy
    if (layer === 'Infra Gap') {
      visible = visible.filter(s => s.severity === 'critical' || s.severity === 'high');
    } else if (layer === 'Funds') {
      visible = visible.filter(s => s.priority >= 8.0);
    }

    this._placeMarkers(visible);

    // Fit bounds if there are visible markers
    if (visible.length > 0 && this._map) {
      const group = L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds().pad(0.2), { maxZoom: 7 });
    }
  },

  /* ═══════════════════════════════════════════════════════
     GOVERNANCE COPILOT
  ═══════════════════════════════════════════════════════ */
  openCopilot() {
    if (this._el.copilotModal) {
      this._el.copilotModal.classList.add('open');
      this._renderCopilotChat();
      setTimeout(() => { this._el.copilotInput?.focus(); }, 50);
    }
  },

  _closeCopilot() {
    this._el.copilotModal?.classList.remove('open');
  },

  _renderCopilotChat() {
    const el = this._el.copilotChat;
    if (!el) return;
    el.innerHTML = this.state.copilotHistory.map(msg => {
      if (msg.isPrompt) {
        return `<div class="chat-msg user"><div class="label">MP Query</div>"${msg.text}"</div>`;
      }
      return `<div class="chat-msg assistant"><div class="label">JanVikas AI</div>${msg.text}</div>`;
    }).join('');
    el.scrollTop = el.scrollHeight;
  },

  _sendCopilotMessage() {
    const input = this._el.copilotInput;
    if (!input || !input.value.trim()) return;
    const userMsg = input.value.trim();
    input.value = '';

    this.state.copilotHistory.push({ role: 'user', text: userMsg, isPrompt: true });
    this.state.copilotHistory.push({
      role: 'assistant',
      text: '<em style="color:var(--text-tertiary);">Analysing development data…</em>',
    });
    this._renderCopilotChat();

    setTimeout(() => {
      this.state.copilotHistory.pop();
      this.state.copilotHistory.push({
        role: 'assistant',
        text: this._generateCopilotResponse(userMsg),
      });
      this._renderCopilotChat();
    }, 1200);
  },

  _generateCopilotResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('jjm') || q.includes('jal jeevan') || q.includes('water')) {
      return `<strong>JJM-Eligible Projects:</strong> The Rural Drinking Water Network (Bundelkhand, UP) is the primary JJM-eligible project — priority score 9.4. Fund window closes in <strong>38 days</strong>. Budget: ₹847 Cr. Immediate action recommended.`;
    }
    if (q.includes('bihar') || q.includes('gaya')) {
      return `<strong>Bihar Infrastructure Analysis:</strong> Gaya district scores 9.1 on the hotspot index. PHC coverage at 48% (national norm: 67%). <strong>PHC Expansion (₹420 Cr)</strong> is the top priority — NHM emergency allocation pathway is available.`;
    }
    if (q.includes('nhm') || q.includes('health') || q.includes('phc')) {
      return `<strong>NHM Allocation Window:</strong> Open for Bihar's Magadh and Gaya divisions. PHC Expansion Programme (₹420 Cr) is pre-approved under NHM norms. Submit DPR within 21 days before Q3 budget lock.`;
    }
    if (q.includes('compar') || q.includes('water vs road') || q.includes('road vs water')) {
      return `<strong>Water vs. Road:</strong> Rural Water Network scores <strong>9.4</strong> (4.2M impact) vs. Road at <strong>8.6</strong> (1.1M). Water addresses life-critical need at 15× signal volume. Recommend Water first; Road Phase 2 in Q4.`;
    }
    if (q.includes('top') || q.includes('budget') || q.includes('q3') || q.includes('quarter')) {
      return `<strong>Top 3 for Q3 Budget:</strong><br>
        1. 💧 Rural Water Network — ₹847 Cr · JJM · 9.4<br>
        2. 🏥 PHC Expansion Bihar — ₹420 Cr · NHM · 8.9<br>
        3. 🛣 Road PMGSY Ph.2 — ₹310 Cr · PMGSY · 8.6<br>
        Combined: ₹1,577 Cr. All fund windows open. Bundle for Finance Committee.`;
    }
    if (q.includes('map') || q.includes('marker') || q.includes('location')) {
      return `<strong>Map Intelligence:</strong> The development map shows <strong>${this.state.suggestions.length} active suggestion clusters</strong> across India. Use the Demand / Infra Gap / Funds pill buttons above the map to switch layers, or click any marker to see theme, support count, priority score and scheme details.`;
    }
    return `<strong>AI Analysis:</strong> Based on current signals, <strong>Rural Drinking Water Network</strong> (Bundelkhand, UP) remains the top recommendation at 9.4/10. Ask about specific districts, schemes, fund windows, or project comparisons for a targeted analysis.`;
  },

  /* ═══════════════════════════════════════════════════════
     EXECUTIVE BRIEF
  ═══════════════════════════════════════════════════════ */
  generateExecutiveBrief() {
    const btn = this._el.generateBrief;
    if (!btn) return;
    btn.textContent = '⏳ Generating Report…';
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '✨ Generate Full Development Planning Report';
      this._showToast('Executive Brief ready — opening print preview');
      setTimeout(() => window.print(), 300);
    }, 1800);
  },

  /* ═══════════════════════════════════════════════════════
     LIVE UPDATES
  ═══════════════════════════════════════════════════════ */
  _startClock() {
    const el = this._el.topbarTime;
    if (!el) return;
    const update = () => {
      const now  = new Date();
      const opts = { day: '2-digit', month: 'short', year: 'numeric' };
      el.textContent = `${now.toLocaleDateString('en-IN', opts)} · Q2 FY26`;
    };
    update();
    setInterval(update, 60000);
  },

  _startLivePulse() {
    setInterval(() => {
      if (Math.random() > 0.5) {
        this.state.signalCount += Math.floor(Math.random() * 3) + 1;
        this.updateMetrics();
      }
    }, 8000);
  },

  _simulateAnalysis() {
    const btn = this._el.runAnalysisBtn;
    if (!btn) return;
    btn.textContent = '⏳ Analysing…';
    btn.disabled = true;
    setTimeout(() => {
      this.state.signalCount += Math.floor(Math.random() * 50) + 10;
      this.updateMetrics();
      btn.innerHTML = '✨ Run AI Analysis';
      btn.disabled  = false;
      this._showToast('AI Analysis complete — priority scores recalculated');
    }, 2000);
  },

  /* ═══════════════════════════════════════════════════════
     TOAST
  ═══════════════════════════════════════════════════════ */
  _showToast(msg) {
    let toast = document.getElementById('jv-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jv-toast';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '24px', right: '24px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--r-md)', padding: '12px 18px',
        fontSize: '12px', color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: '9999', opacity: '0',
        transition: 'opacity 0.3s',
        maxWidth: '340px', lineHeight: '1.5',
        pointerEvents: 'none',
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3500);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  JanVikasAI.init();
});
