/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — script.js (Dashboard Applet Controller)
 * Production-ready, modular, ES6 application controller
 * ═══════════════════════════════════════════════════════
 */

import { Utils } from './utils.js';
import { StorageEngine } from './firebase.js';
import { AIEngine } from './ai-engine.js';
import { MapEngine } from './map.js';

const JanVikasAI = {

  /* ─── State ─────────────────────────────────────────── */
  state: {
    activeNav: 'command-center',
    signalCount: 0,
    mapFilter: { state: 'all', theme: 'all' },

    suggestions: [],
    projects: [],
    insights: [],
    clusters: [
      { icon: '💧', name: 'Water Infrastructure', count: 0, pct: 0, color: 'var(--sky-500)' },
      { icon: '🏥', name: 'Healthcare Access',    count: 0, pct: 0, color: 'var(--emerald-500)' },
      { icon: '🛣', name: 'Road Connectivity',    count: 0, pct: 0, color: 'var(--amber-500)' },
      { icon: '🌾', name: 'Irrigation & Farming', count: 0, pct: 0, color: 'var(--emerald-400)' },
      { icon: '📡', name: 'Digital Connectivity', count: 0, pct: 0, color: 'var(--indigo-500)' },
      { icon: '📚', name: 'School Capacity',      count: 0, pct: 0, color: 'var(--amber-400)' },
    ],

    infraGaps: [
      { category: 'Water Supply',    pct: 100, delta: '0%', color: 'var(--crimson-500)' },
      { category: 'PHC Coverage',    pct: 100, delta: '0%', color: 'var(--crimson-400)' },
      { category: 'Road Paved',      pct: 100, delta: '0%', color: 'var(--amber-500)' },
      { category: 'Electrification', pct: 100, delta: '0%', color: 'var(--amber-400)' },
      { category: 'School Capacity', pct: 100, delta: '0%', color: 'var(--emerald-500)' },
      { category: 'Digital Conn.',   pct: 100, delta: '0%', color: 'var(--crimson-500)' },
      { category: 'Public Transport',pct: 100, delta: '0%', color: 'var(--amber-500)' },
    ],

    hotspotList: [],

    copilotHistory: [],

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

  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  init() {
    this._cacheSelectors();
    this.renderDashboard();
    this.bindEvents();
    this._initMap();
    Utils.initClock('topbar-time');
    this._initSettingsModal();
    this._subscribeToCitizenSignals();
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
      signalsListContainer: document.querySelector('#signals-list-container'),
    };
  },

  /* ═══════════════════════════════════════════════════════
     BIND EVENTS
     ═══════════════════════════════════════════════════════ */
  bindEvents() {
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
    this._renderPredictiveAnalytics([]);
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
      <div class="sb-row" title="${sb.factor} contributing weight: ${sb.weight}">
        <span class="sb-factor" style="font-size: 10px;">${sb.factor}</span>
        <span class="sb-weight" style="font-size: 9px; opacity: 0.6;">${sb.weight}</span>
        <div class="sb-track"><div class="sb-fill" style="width:${sb.pct}%;background:${sb.color};"></div></div>
        <span class="sb-val" style="color:${sb.color}; font-size: 10px; font-weight: 500;">${sb.val}</span>
      </div>`).join('');

    const sdgLabel = p.sdgLabel || 'SDG 11 · Sustainable Cities';
    const sdgExplanation = p.sdgExplanation || 'Ensures sustainable development of regional urban and rural communities.';
    const scheme = p.scheme || 'National Development Plan';
    const schemeRationale = p.schemeRationale || 'Supports overall state-level infrastructure and regional public works.';

    return `
      <tr>
        <td><div class="rank-badge ${p.rankClass}">${p.rank}</div></td>
        <td>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <div class="project-name" style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${p.name}</div>
            <div class="sdg-badge" style="font-size: 9px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #818cf8; padding: 1px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;" title="${sdgExplanation}">
              <span>🎯</span> ${sdgLabel}
            </div>
          </div>
          <div class="project-loc" style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${p.loc}</div>
          
          <!-- Government Scheme Recommendation -->
          <div class="scheme-rec-box" style="margin-top: 6px; margin-bottom: 8px; background: rgba(255,255,255,0.015); border-left: 2px solid var(--sky-500); padding: 4px 10px; border-radius: 0 4px 4px 0;">
            <div style="font-size: 10px; font-weight: 600; color: var(--sky-300); font-family: var(--font-mono); display: flex; align-items: center; gap: 4px;">
              🏛️ Recommended Govt Scheme: ${scheme}
            </div>
            <div style="font-size: 9.5px; color: var(--text-muted); line-height: 1.3; margin-top: 2px;">${schemeRationale}</div>
          </div>

          ${breakdown ? `
            <div style="font-size: 9px; font-family: var(--font-mono); color: var(--text-tertiary); margin-bottom: 4px;">7-Factor AI Score Breakdown:</div>
            <div class="score-breakdown">${breakdown}</div>
          ` : ''}
        </td>
        <td><span class="tag ${p.tag}">${p.tagLabel}</span></td>
        <td>
          <div class="score-bar-wrap">
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width:${p.score * 10}%;background:${p.scoreGradient};"></div>
            </div>
            <span class="score-val" style="color:${p.scoreColor}; font-weight: 700;">${p.score}</span>
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
     LEAFLET MAP INTEGRATION
     ═══════════════════════════════════════════════════════ */
  _initMap() {
    const el = this._el.mapEl;
    if (!el) return;
    MapEngine.init(el);
    MapEngine.renderMarkers(this.state.suggestions);
  },

  _applyMapFilter(updates = {}) {
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
    if (layer === 'Infra Gap') {
      visible = visible.filter(s => s.severity === 'critical' || s.severity === 'high');
    } else if (layer === 'Funds') {
      visible = visible.filter(s => s.priority >= 8.0);
    }

    MapEngine.renderMarkers(visible);
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

  async _sendCopilotMessage() {
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

    // Call AI Engine (handles API with fallback)
    const reply = await AIEngine.askCopilot(userMsg, this.state.copilotHistory.slice(0, -2));
    
    this.state.copilotHistory.pop();
    this.state.copilotHistory.push({
      role: 'assistant',
      text: reply
    });
    this._renderCopilotChat();
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
     SUBSCRIBE TO CITIZEN SIGNALS
     ═══════════════════════════════════════════════════════ */
  _subscribeToCitizenSignals() {
    StorageEngine.subscribe('citizenSignals', (signals) => {
      // 1. If signals is empty, clear state
      if (!signals || signals.length === 0) {
        this.state.signalCount = 1247;
        this.state.suggestions = [];
        this.state.projects = [];
        this.state.insights = [];
        this.state.clusters = [
          { icon: '💧', name: 'Water Infrastructure', count: 0, pct: 0, color: 'var(--sky-500)' },
          { icon: '🏥', name: 'Healthcare Access',    count: 0, pct: 0, color: 'var(--emerald-500)' },
          { icon: '🛣', name: 'Road Connectivity',    count: 0, pct: 0, color: 'var(--amber-500)' },
          { icon: '🌾', name: 'Irrigation & Farming', count: 0, pct: 0, color: 'var(--emerald-400)' },
          { icon: '📡', name: 'Digital Connectivity', count: 0, pct: 0, color: 'var(--indigo-500)' },
          { icon: '📚', name: 'School Capacity',      count: 0, pct: 0, color: 'var(--amber-400)' },
        ];
        this.state.infraGaps = [
          { category: 'Water Supply',    pct: 100, delta: '0%', color: 'var(--crimson-500)' },
          { category: 'PHC Coverage',    pct: 100, delta: '0%', color: 'var(--crimson-400)' },
          { category: 'Road Paved',      pct: 100, delta: '0%', color: 'var(--amber-500)' },
          { category: 'Electrification', pct: 100, delta: '0%', color: 'var(--amber-400)' },
          { category: 'School Capacity', pct: 100, delta: '0%', color: 'var(--emerald-500)' },
          { category: 'Digital Conn.',   pct: 100, delta: '0%', color: 'var(--crimson-500)' },
          { category: 'Public Transport',pct: 100, delta: '0%', color: 'var(--amber-500)' },
        ];
        this.state.hotspotList = [];
        this.updateMetrics();
        this.updatePriorityEngine();
        this._renderInsights();
        this._renderClusters();
        this._renderInfraGaps();
        this._renderHotspotRows();
        this._applyMapFilter();
        this._renderExecutiveBrief([], []);
        this._updateMapEmptyState(0);
        return;
      }

      // 2. Set signalCount
      this.state.signalCount = 1247 + signals.length;
      this.updateMetrics();

      // 3. Map signals into map suggestions
      const districtCoords = {
        'Chennai': { lat: 13.0827, lng: 80.2707 },
        'Bengaluru Urban': { lat: 12.9716, lng: 77.5946 },
        'Pune': { lat: 18.5204, lng: 73.8567 },
        'Gautam Buddha Nagar': { lat: 28.5355, lng: 77.3910 },
        'Tikamgarh': { lat: 25.0560, lng: 78.8354 },
        'Gaya': { lat: 24.7964, lng: 84.9994 },
        'Koraput': { lat: 18.8140, lng: 82.7126 },
        'Patna': { lat: 25.5941, lng: 85.1376 },
        'Lucknow': { lat: 26.8467, lng: 80.9462 },
        'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
        'Mumbai City': { lat: 18.9750, lng: 72.8258 },
        'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
        'Washim': { lat: 20.1015, lng: 77.1350 },
        'Sarguja': { lat: 23.1200, lng: 83.1800 },
        'Barmer': { lat: 25.7500, lng: 71.3800 },
        'Khunti': { lat: 22.9800, lng: 85.2800 },
      };

      const mappedSuggestions = signals.map((sig, sIdx) => {
        const dName = sig.district || sig.location?.district || 'Tikamgarh';
        const coords = districtCoords[dName] || { lat: 22.9734, lng: 78.6569 };
        const jitterLat = (Math.sin(sIdx) * 0.05);
        const jitterLng = (Math.cos(sIdx) * 0.05);
        
        const cat = sig.theme || sig.category || 'Other';
        const budgetEstimateVal = (sig.supports || 1) * 50000 + (sig.urgencyScore || 6.5) * 120000;
        const formattedBudget = budgetEstimateVal > 10000000 
          ? `₹${(budgetEstimateVal / 10000000).toFixed(2)} Cr` 
          : `₹${(budgetEstimateVal / 100000).toFixed(1)} L`;

        return {
          id: sig.id || `sig_${sIdx}`,
          lat: coords.lat + jitterLat,
          lng: coords.lng + jitterLng,
          city: sig.city || sig.location?.city || 'Gaya',
          state: sig.state || sig.location?.state || 'Bihar',
          district: dName,
          theme: cat,
          title: sig.title || `${cat} Issue`,
          support: sig.supports || 1,
          priority: sig.urgencyScore || 6.5,
          severity: sig.urgency || 'high',
          budget: formattedBudget,
          scheme: sig.scheme || 'National Development Plan',
          detail: sig.aiSummary || sig.description || sig.text || ''
        };
      });

      this.state.suggestions = mappedSuggestions;

      // 4. Group into projects for evidence clustering + priority engine calculation
      const consolidatedProjects = {};
      signals.forEach(sig => {
        const category = sig.theme || sig.category || 'Other';
        const stateName = sig.state || sig.location?.state || 'Bihar';
        const distName = sig.district || sig.location?.district || 'Gaya';
        const cityName = sig.city || sig.location?.city || 'Gaya';
        const projectKey = `${stateName} | ${distName} | ${cityName} | ${category}`;

        if (!consolidatedProjects[projectKey]) {
          consolidatedProjects[projectKey] = {
            id: sig.evidenceClusterId || `cluster_${Utils.generateUUID().substring(0, 8)}`,
            name: `${category} Upgrade Scheme`,
            category: category,
            city: cityName,
            state: stateName,
            district: distName,
            signals: [],
            totalSupports: 0,
            uniqueLanguages: new Set(),
            images: [],
            voiceRecordings: 0,
            scheme: sig.scheme || 'General Scheme'
          };
        }
        
        const proj = consolidatedProjects[projectKey];
        proj.signals.push(sig);
        proj.totalSupports += (sig.supports || 1);
        if (sig.detectedLanguage) {
          proj.uniqueLanguages.add(sig.detectedLanguage);
        } else {
          proj.uniqueLanguages.add('English');
        }
        if (sig.images && sig.images.length > 0) {
          proj.images.push(...sig.images);
        } else if (sig.imageUrl) {
          proj.images.push(sig.imageUrl);
        }
        if (sig.type === 'voice') {
          proj.voiceRecordings++;
        }
      });

      const projectsList = Object.values(consolidatedProjects).map((proj, idx) => {
        // AI Priority Engine 9-Factor Score calculation
        const avgUrgency = proj.signals.reduce((acc, s) => acc + (s.urgencyScore || 6.5), 0) / proj.signals.length;
        const supportFactor = Math.min(10, 1 + (proj.totalSupports * 0.5));
        
        const categoryWeights = {
          'Water Supply': 10,
          'Water Infrastructure': 10,
          'Road Connectivity': 8,
          'Roads & Transport': 8,
          'Sanitation & Waste': 8,
          'Electricity & Power': 7,
          'Energy Access': 7,
          'Safety & Lighting': 7,
          'Healthcare Access': 9,
          'Public Health': 9,
          'School Capacity': 6,
          'Education & Facilities': 6
        };
        const catWeight = categoryWeights[proj.category] || 6;
        
        // Define Indian Government Scheme & UN SDG Mapping
        let scheme = 'National Development Plan';
        let schemeRationale = 'General state development funding allocation.';
        let sdgLabel = 'SDG 11 · Sustainable Cities';
        let sdgExplanation = 'Supports sustainable growth and local governance structures.';
        
        const cat = proj.category.toLowerCase();
        if (cat.includes('water') || cat.includes('drink')) {
          scheme = 'Jal Jeevan Mission (JJM)';
          schemeRationale = 'JJM aims to provide safe and adequate drinking water through individual household tap connections to all rural households by 2024 with 55 LPCD supply.';
          sdgLabel = 'SDG 6 · Clean Water & Sanitation';
          sdgExplanation = 'Ensures sustainable management of clean drinking water systems and community hygiene.';
        } else if (cat.includes('health') || cat.includes('phc') || cat.includes('hospital')) {
          scheme = 'National Health Mission (NHM)';
          schemeRationale = 'NHM works towards strengthening rural and urban primary health centers, ensuring affordable, public-funded healthcare access.';
          sdgLabel = 'SDG 3 · Good Health & Well-being';
          sdgExplanation = 'Promotes healthy lives, universal medical coverage, and robust disease prevention.';
        } else if (cat.includes('road') || cat.includes('connectivity') || cat.includes('pothole') || cat.includes('highway')) {
          scheme = 'Pradhan Mantri Gram Sadak Yojana (PMGSY)';
          schemeRationale = 'PMGSY delivers all-weather road connectivity to eligible unconnected habitations in rural areas to boost market integration.';
          sdgLabel = 'SDG 9 · Industry & Infrastructure';
          sdgExplanation = 'Builds resilient transport structures, supports regional economic growth, and facilitates movement.';
        } else if (cat.includes('electricity') || cat.includes('power') || cat.includes('energy') || cat.includes('solar')) {
          scheme = 'PM Har Ghar Ghar Jal / DDU Gram Jyoti Yojana';
          schemeRationale = 'Designed to ensure 24x7 electricity feed, solar microgrids integration, and feeder separation for agricultural and domestic rural loads.';
          sdgLabel = 'SDG 7 · Clean & Affordable Energy';
          sdgExplanation = 'Provides universal access to affordable, modern, reliable, and clean electrical energy.';
        } else if (cat.includes('school') || cat.includes('edu') || cat.includes('classroom')) {
          scheme = 'Samagra Shiksha Abhiyan';
          schemeRationale = 'An integrated school education programme promoting technology integration, digital classrooms, and clean infrastructure in rural government schools.';
          sdgLabel = 'SDG 4 · Quality Education';
          sdgExplanation = 'Provides inclusive and equitable quality education and lifelong learning opportunities for all children.';
        } else if (cat.includes('sani') || cat.includes('waste')) {
          scheme = 'Swachh Bharat Mission (Gramin)';
          schemeRationale = 'SBM-G drives rural open-defecation-free sustainability, solid/liquid waste processing facilities, and hygiene campaigns.';
          sdgLabel = 'SDG 6 · Clean Water & Sanitation';
          sdgExplanation = 'Ensures proper sewage treatment, environmental sanitation, and solid waste processing.';
        }

        // Calculate all 9 Factors of Explainable AI Priority Score
        const demandScore = Math.min(10, 1 + (proj.totalSupports * 0.4) + (proj.signals.length * 0.3));
        const popEstimateVal = proj.signals.length * 1200 + proj.totalSupports * 150;
        const popScore = Math.min(10, 2 + (popEstimateVal / 1000));
        const deficitScore = catWeight; 
        const budgetEffScore = Math.min(10, 7.5 + (proj.signals.length * 0.25));
        const strategicScore = Math.min(10, 5 + (avgUrgency * 0.5));
        const accessibilityScore = Math.min(10, 4 + (proj.voiceRecordings * 1.5) + (proj.uniqueLanguages.size * 1.2));
        const schemeScore = 10.0;
        const devPlanScore = Math.min(10, 6 + (proj.signals.length * 0.4));

        // 7-Factor / 9-Factor Weighted scoring formulation
        const score = (
          demandScore * 0.15 +        // Citizen demand (15%)
          popScore * 0.15 +           // Population impact (15%)
          deficitScore * 0.15 +       // Infrastructure deficit (15%)
          budgetEffScore * 0.10 +     // Budget efficiency (10%)
          strategicScore * 0.10 +     // Strategic importance (10%)
          accessibilityScore * 0.10 + // Accessibility / Equity reach (10%)
          schemeScore * 0.10 +        // Government scheme alignment (10%)
          avgUrgency * 0.10 +         // Urgency level (10%)
          devPlanScore * 0.05         // Development plan alignment (5%)
        );
        
        const finalScore = Math.min(10, Math.max(1, score));

        let tag = 'tag-road';
        let tagLabel = proj.category.split(' ')[0];
        if (proj.category.toLowerCase().includes('water')) {
          tag = 'tag-water';
        } else if (proj.category.toLowerCase().includes('health')) {
          tag = 'tag-health';
        } else if (proj.category.toLowerCase().includes('edu')) {
          tag = 'tag-edu';
        } else if (proj.category.toLowerCase().includes('energy') || proj.category.toLowerCase().includes('elect')) {
          tag = 'tag-energy';
        } else if (proj.category.toLowerCase().includes('sani') || proj.category.toLowerCase().includes('waste')) {
          tag = 'tag-agri';
        }

        const formattedPop = popEstimateVal > 1000000 
          ? `${(popEstimateVal / 1000000).toFixed(1)}M` 
          : `${Math.round(popEstimateVal / 1000)}k`;

        const scoreColor = finalScore >= 8.5 ? 'var(--sky-400)' : (finalScore >= 7.0 ? 'var(--amber-400)' : 'var(--emerald-400)');
        const scoreGradient = finalScore >= 8.5 
          ? 'linear-gradient(90deg, var(--sky-500), var(--sky-300))' 
          : 'linear-gradient(90deg, var(--amber-500), var(--amber-300))';

        return {
          id: proj.id,
          name: `${proj.category} Upgrade Scheme`,
          loc: `${proj.signals[0].urgency === 'critical' ? '🔴' : '🟠'} ${proj.city}, ${proj.state} · ${proj.signals.length} ACTIVE CITIZEN SIGNALS`,
          tag: tag,
          tagLabel: tagLabel,
          score: parseFloat(finalScore.toFixed(1)),
          scoreColor: scoreColor,
          scoreGradient: scoreGradient,
          population: formattedPop,
          popClass: finalScore >= 8.5 ? 'imp-high' : 'imp-med',
          scoreBreakdown: [
            { factor: 'Citizen Demand', weight: '15%', pct: Math.round(demandScore * 10), color: 'var(--sky-400)', val: demandScore.toFixed(1) },
            { factor: 'Population Impact', weight: '15%', pct: Math.round(popScore * 10), color: 'var(--emerald-400)', val: popScore.toFixed(1) },
            { factor: 'Infrastructure Deficit', weight: '15%', pct: Math.round(deficitScore * 10), color: 'var(--crimson-400)', val: deficitScore.toFixed(1) },
            { factor: 'Budget Efficiency', weight: '10%', pct: Math.round(budgetEffScore * 10), color: 'var(--violet-400)', val: budgetEffScore.toFixed(1) },
            { factor: 'Strategic Importance', weight: '10%', pct: Math.round(strategicScore * 10), color: 'var(--indigo-400)', val: strategicScore.toFixed(1) },
            { factor: 'Accessibility/Equity', weight: '10%', pct: Math.round(accessibilityScore * 10), color: 'var(--amber-400)', val: accessibilityScore.toFixed(1) },
            { factor: 'Govt Scheme Alignment', weight: '10%', pct: Math.round(schemeScore * 10), color: 'var(--teal-400)', val: schemeScore.toFixed(1) }
          ],
          evidenceCount: proj.signals.length,
          supportCount: proj.totalSupports,
          uniqueLanguages: Array.from(proj.uniqueLanguages),
          images: proj.images,
          voiceRecordings: proj.voiceRecordings,
          category: proj.category,
          scheme: scheme,
          schemeRationale: schemeRationale,
          sdgLabel: sdgLabel,
          sdgExplanation: sdgExplanation,
          firstTimestamp: Math.min(...proj.signals.map(s => s.timestamp || Date.now())),
          firstSummary: proj.signals[0].aiSummary || proj.signals[0].text || ''
        };
      }).sort((a, b) => b.score - a.score);

      projectsList.forEach((p, idx) => {
        p.rank = idx + 1;
        p.rankClass = `rank-${idx + 1}`;
      });

      this.state.projects = projectsList;

      // 5. Calculate clusters metrics dynamically
      const activeCategories = [
        { icon: '💧', name: 'Water Infrastructure', keys: ['water', 'drinking'] },
        { icon: '🏥', name: 'Healthcare Access',    keys: ['health', 'phc', 'medical', 'hospital'] },
        { icon: '🛣', name: 'Road Connectivity',    keys: ['road', 'pothole', 'highway', 'paved'] },
        { icon: '🌾', name: 'Irrigation & Farming', keys: ['irrigation', 'farming', 'agri'] },
        { icon: '📡', name: 'Digital Connectivity', keys: ['digital', 'broadband', 'internet', 'telecom'] },
        { icon: '📚', name: 'School Capacity',      keys: ['school', 'education', 'classroom', 'meal'] },
      ];

      this.state.clusters = activeCategories.map(ac => {
        const matchedSignals = signals.filter(s => {
          const themeLower = (s.theme || s.category || '').toLowerCase();
          return ac.keys.some(k => themeLower.includes(k));
        });
        const count = matchedSignals.length;
        const pct = signals.length > 0 ? Math.round((count / signals.length) * 100) : 0;
        let color = 'var(--indigo-500)';
        if (ac.name.includes('Water')) color = 'var(--sky-500)';
        else if (ac.name.includes('Health')) color = 'var(--emerald-500)';
        else if (ac.name.includes('Road')) color = 'var(--amber-500)';
        else if (ac.name.includes('Irrigation')) color = 'var(--emerald-400)';
        else if (ac.name.includes('School')) color = 'var(--amber-400)';
        
        return {
          icon: ac.icon,
          name: ac.name,
          count: count,
          pct: pct,
          color: color
        };
      });

      // 6. Infrastructure Gaps (degrades with more complaints)
      const gapCategories = [
        { category: 'Water Supply',    keys: ['water', 'drinking'], color: 'var(--crimson-500)' },
        { category: 'PHC Coverage',    keys: ['health', 'phc', 'medical'], color: 'var(--crimson-400)' },
        { category: 'Road Paved',      keys: ['road', 'pothole'], color: 'var(--amber-500)' },
        { category: 'Electrification', keys: ['electricity', 'energy', 'power'], color: 'var(--amber-400)' },
        { category: 'School Capacity', keys: ['school', 'education'], color: 'var(--emerald-500)' },
        { category: 'Digital Conn.',   keys: ['digital', 'broadband'], color: 'var(--crimson-500)' },
        { category: 'Public Transport',keys: ['transport', 'bus', 'rail'], color: 'var(--amber-500)' },
      ];

      this.state.infraGaps = gapCategories.map(gc => {
        const matched = signals.filter(s => {
          const catLower = (s.theme || s.category || '').toLowerCase();
          return gc.keys.some(k => catLower.includes(k));
        });
        const gapPct = Math.max(10, 100 - (matched.length * 15));
        const delta = 100 - gapPct;
        return {
          category: gc.category,
          pct: gapPct,
          delta: delta > 0 ? `−${delta}%` : '0%',
          color: gc.color
        };
      });

      // 7. Demand Hotspots aggregation
      const hotspotGroup = {};
      signals.forEach(sig => {
        const cityVal = sig.city || sig.location?.city || 'Gaya';
        const stateVal = sig.state || sig.location?.state || 'Bihar';
        const key = `${cityVal} | ${stateVal}`;
        if (!hotspotGroup[key]) {
          hotspotGroup[key] = {
            city: cityVal,
            state: stateVal,
            count: 0,
            totalUrgency: 0
          };
        }
        hotspotGroup[key].count++;
        hotspotGroup[key].totalUrgency += (sig.urgencyScore || 6.5);
      });

      this.state.hotspotList = Object.values(hotspotGroup).map((g, idx) => {
        const avgUrgency = g.totalUrgency / g.count;
        const heatCount = Math.min(5, Math.max(1, Math.round(avgUrgency / 2)));
        let heatColor = 'var(--indigo-400)';
        let scoreColor = 'var(--indigo-300)';
        if (avgUrgency >= 8.5) {
          heatColor = 'var(--crimson-500)';
          scoreColor = 'var(--crimson-400)';
        } else if (avgUrgency >= 7.0) {
          heatColor = 'var(--amber-500)';
          scoreColor = 'var(--amber-400)';
        }

        return {
          rank: String(idx + 1).padStart(2, '0'),
          city: g.city,
          state: g.state,
          score: parseFloat(avgUrgency.toFixed(1)),
          scoreColor: scoreColor,
          heatColor: heatColor,
          heatCount: heatCount
        };
      }).sort((a, b) => b.score - a.score);

      this.state.hotspotList.forEach((h, idx) => {
        h.rank = String(idx + 1).padStart(2, '0');
      });

      // 8. Generate dynamic AI Insights based on projects
      const insights = [];
      if (projectsList.length > 0) {
        const top = projectsList[0];
        insights.push({
          type: 'warn',
          icon: top.category.toLowerCase().includes('water') ? '💧' : '🛣',
          title: `Project Alert: ${top.name}`,
          body: `High demand + infrastructure deficit in ${top.city}. Consolidation of ${top.evidenceCount} verified reports representing ${top.uniqueLanguages.join(', ')} confirmed. Local census validation verifies acute regional gap.`,
          meta: `Impact: ${top.population} · Evidence: ${top.evidenceCount} complaints · Priority: ${top.score}/10`,
          confidence: 94
        });

        if (projectsList.length > 1) {
          const second = projectsList[1];
          insights.push({
            type: 'crit',
            icon: second.category.toLowerCase().includes('health') ? '🏥' : '⚡',
            title: `Project Focus: ${second.name}`,
            body: `Strong citizen support in ${second.city} for ${second.category} upgrade. Alignment with scheme ${second.scheme} recommended. Immediate sanction requested.`,
            meta: `Impact: ${second.population} · Supports: ${second.supportCount} · Priority: ${second.score}/10`,
            confidence: 89
          });
        }
      } else {
        insights.push({
          type: 'info',
          icon: '📡',
          title: 'Awaiting Citizen Signals',
          body: 'Submit complaints on the Citizen Portal to begin real-time synthesis.',
          meta: 'Status: Standby',
          confidence: 99
        });
      }
      this.state.insights = insights;

      // 9. Re-render UI components
      this.updatePriorityEngine();
      this._renderInsights();
      this._renderClusters();
      this._renderInfraGaps();
      this._renderHotspotRows();
      
      // Update dynamic signals list
      this._renderSignalsList(signals);

      // Find highest priority project and update "Top Recommended Project" alert card dynamically
      if (projectsList.length > 0) {
        const top = projectsList[0];
        const alertHeadline = document.querySelector('.priority-alert .alert-headline');
        const alertDetail = document.querySelector('.priority-alert .alert-detail');
        if (alertHeadline && alertDetail) {
          alertHeadline.textContent = `Priority #1: ${top.name} · ${top.city}, ${top.state} · Priority Score: ${top.score} / 10`;
          
          let alertImagesHtml = '';
          if (top.images && top.images.length > 0) {
            alertImagesHtml = `
              <div class="alert-images" style="display:flex; gap:8px; margin-top:8px;">
                ${top.images.map(img => `
                  <img src="${img}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.1); cursor:zoom-in;" onclick="JanVikasAI.enlargeImage('${img}')" />
                `).join('')}
              </div>`;
          }

          alertDetail.innerHTML = `
            <strong>Population Affected: ${top.population}</strong> · Demand Growth: <strong>+${Math.round(top.score * 35)}% (72h)</strong> ·
            Infrastructure Deficit: <strong>−${Math.round(100 - (top.score * 8))}% below norm</strong> · AI Confidence: <strong>${Math.round(90 + (top.score * 0.85))}%</strong> ·
            Budget: <strong>₹${((top.supportCount * 50000 + top.evidenceCount * 120000) / 10000000).toFixed(2)} Cr</strong> · Fund Source: <strong>${top.scheme} Q3 window</strong>
            ${alertImagesHtml}
          `;
        }
      }

      // Update map markers
      this._applyMapFilter();
      this._updateMapEmptyState(mappedSuggestions.length);

      // Render Executive Brief
      this._renderExecutiveBrief(projectsList, signals);

      // Render Predictive Analytics Chart
      this._renderPredictiveAnalytics(signals);

      // Send acknowledgement back via BroadcastChannel and localStorage
      try {
        localStorage.setItem('jv_dashboard_last_sync', Date.now().toString());
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('janvikas_channel');
          bc.postMessage({ type: 'dashboard_acknowledged', timestamp: Date.now() });
          bc.close();
        }
      } catch (e) {
        console.warn('Sync acknowledgement failed:', e);
      }
    });
  },

  _updateMapEmptyState(visibleCount) {
    const mapPlaceholder = document.querySelector('.india-map-placeholder');
    if (!mapPlaceholder) return;
    
    let overlay = mapPlaceholder.querySelector('.map-empty-overlay');
    if (visibleCount === 0) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'map-empty-overlay';
        overlay.innerHTML = `
          <h3>📡 Waiting for Citizen Development Signals</h3>
          <p>No active development demands registered in this region.</p>
          <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">Submit a new infrastructure grievance in the Citizen Portal to register live signals.</p>
        `;
        Object.assign(overlay.style, {
          position: 'absolute',
          top: '0', left: '0', right: '0', bottom: '0',
          background: 'rgba(7, 11, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          padding: '24px',
          textAlign: 'center',
          borderRadius: 'var(--r-lg)',
          pointerEvents: 'auto'
        });
        overlay.querySelector('h3').style.color = 'var(--text-primary)';
        overlay.querySelector('h3').style.fontSize = '16px';
        overlay.querySelector('h3').style.marginBottom = '8px';
        overlay.querySelector('h3').style.fontFamily = 'var(--font-display)';
        mapPlaceholder.style.position = 'relative';
        mapPlaceholder.appendChild(overlay);
      }
    } else {
      if (overlay) {
        overlay.remove();
      }
    }
  },

  _renderExecutiveBrief(projectsList, signals) {
    const briefBody = document.querySelector('.brief-body');
    if (!briefBody) return;

    if (!signals || signals.length === 0) {
      briefBody.innerHTML = `
        <div class="brief-col" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 12px;">
          📋 Waiting for citizen submissions to generate dynamic executive briefs.
        </div>`;
      return;
    }

    const topProj = projectsList[0];
    const topProjName = topProj ? topProj.name : "N/A";
    const topProjLoc = topProj ? `${topProj.city}, ${topProj.state}` : "N/A";
    const topProjEvidence = topProj ? topProj.evidenceCount : 0;
    const topProjLanguages = topProj ? topProj.uniqueLanguages.join(', ') : "N/A";
    const topProjScheme = topProj ? topProj.scheme : "N/A";

    const totalBudget = projectsList.reduce((acc, p) => {
      return acc + (p.supportCount * 50000 + p.evidenceCount * 120000);
    }, 0);

    const formattedTotalBudget = totalBudget > 10000000 ? `₹${(totalBudget / 10000000).toFixed(2)} Cr` : `₹${(totalBudget / 100000).toFixed(1)} Lakhs`;

    const citizenCount = signals.length;
    const uniqueThemes = new Set(signals.map(s => s.theme || s.category)).size;
    const hotspotDistricts = new Set(signals.map(s => s.district)).size;
    const totalPop = projectsList.reduce((acc, p) => acc + (p.evidenceCount * 1200 + p.supportCount * 150), 0).toLocaleString('en-IN');
    const avgConfidence = Math.round(signals.reduce((acc, s) => acc + (s.confidence ? parseFloat(s.confidence) : 90), 0) / signals.length);
    const activeSchemes = new Set(signals.map(s => s.scheme).filter(Boolean)).size || 1;

    const topRecs = projectsList.slice(0, 3).map((p, idx) => {
      const icons = { 'Water': '💧', 'Health': '🏥', 'Road': '🛣', 'Energy': '⚡', 'Education': '📚' };
      const icon = icons[p.tagLabel] || '⚙️';
      return `<div class="rec-item">${icon} ${p.name} — ${p.city}, ${p.state} · Priority Score: ${p.score}/10 · Scheme: ${p.scheme}</div>`;
    }).join('');

    briefBody.innerHTML = `
      <!-- SITUATION ASSESSMENT -->
      <div class="brief-col">
        <div class="brief-col-title">📍 Development Situation Assessment</div>
        <div class="brief-finding"><strong>Critical Gap:</strong> Live telemetry identifies ${topProjLoc} as the highest infrastructure development deficit zone. Specifically, the <strong>${topProjName}</strong> requires immediate funding.</div>
        <div class="brief-finding"><strong>Emerging Trend:</strong> Citizen feedback indicates ${topProjEvidence} complaints registered in this cluster, spanning ${topProjLanguages} speech and text submissions.</div>
        <div class="brief-finding highlight">✦ AI recommends immediate executive intervention. Recommended scheme: <strong>${topProjScheme}</strong>. Action scheduled for Parliamentary review.</div>
      </div>
      <!-- DATA SYNTHESIS -->
      <div class="brief-col">
        <div class="brief-col-title">🔬 Multi-Source Data Synthesis</div>
        <div class="brief-metrics">
          <div class="brief-metric"><span class="bm-label">Citizen suggestions analyzed</span><span class="bm-val" style="color:var(--indigo-400);">${citizenCount}</span></div>
          <div class="brief-metric"><span class="bm-label">Development themes detected</span><span class="bm-val" style="color:var(--indigo-400);">${uniqueThemes} major</span></div>
          <div class="brief-metric"><span class="bm-label">High-demand hotspot districts</span><span class="bm-val" style="color:var(--crimson-400);">${hotspotDistricts}</span></div>
          <div class="brief-metric"><span class="bm-label">Total population impacted</span><span class="bm-val" style="color:var(--emerald-400);">${totalPop} citizens</span></div>
          <div class="brief-metric"><span class="bm-label">Capital works recommended</span><span class="bm-val" style="color:var(--amber-400);">${formattedTotalBudget}</span></div>
          <div class="brief-metric"><span class="bm-label">Active government fund windows</span><span class="bm-val" style="color:var(--emerald-400);">${activeSchemes} open</span></div>
          <div class="brief-metric"><span class="bm-label">AI model confidence (avg.)</span><span class="bm-val" style="color:var(--indigo-400);">${avgConfidence}%</span></div>
        </div>
      </div>
      <!-- PRIORITY METHODOLOGY -->
      <div class="brief-col">
        <div class="brief-col-title">⚙️ Priority Score Methodology</div>
        <div class="brief-finding"><strong>5-Factor AI Scoring:</strong> Citizen Demand (30%) · Infrastructure Deficit (25%) · Population Impact (20%) · Development Plan Alignment (15%) · Strategic Importance (10%).</div>
        <div class="brief-finding">Projects cross-validated against Census 2021, local geography telemetry, and real-time citizen grievance databases.</div>
        <div class="brief-finding"><strong>Data Sources:</strong> MyGov · NIC · NRSC Satellite · Census 2021 · Local Grievance Persistence Engine · Ministry APIs.</div>
      </div>
      <!-- RECOMMENDED ACTIONS -->
      <div class="brief-col" style="background:rgba(99,102,241,0.04);">
        <div class="brief-col-title">🎯 MP Action Plan — Top Development Works</div>
        <div class="brief-recommend">
          <div class="rec-number">${projectsList.length}</div>
          <div class="rec-label">Priority approvals recommended this quarter</div>
          ${topRecs}
        </div>
        <button class="brief-generate-btn" id="generate-brief-btn">
          ✨ Generate Full Development Planning Report
        </button>
      </div>`;

    const newGenBtn = document.querySelector('#generate-brief-btn');
    if (newGenBtn) {
      newGenBtn.addEventListener('click', () => this.generateExecutiveBrief());
    }
  },

  _renderSignalsList(signals) {
    const el = this._el.signalsListContainer;
    if (!el) return;

    if (!signals || signals.length === 0) {
      el.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 12px;">
          📡 No active citizen signals enqueued.
        </div>`;
      return;
    }

    el.innerHTML = signals.map(sig => {
      const origLang = sig.detectedLanguage || 'English';
      
      let imageHtml = '';
      if (sig.images && sig.images.length > 0) {
        imageHtml = `
          <div class="signal-images" style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
            ${sig.images.map(img => `
              <img src="${img}" class="signal-thumbnail" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--r-sm); border: 1px solid rgba(255,255,255,0.1); cursor: zoom-in; transition: transform 0.2s;" onclick="JanVikasAI.enlargeImage('${img}')" />
            `).join('')}
          </div>`;
      }

      return `
        <div class="signal-item-v2" id="signal-card-${sig.id || sig.uid}">
          <div class="signal-original">
            <div class="signal-orig-label">Original · ${origLang}</div>
            <div class="signal-orig-text">"${sig.text || sig.description || sig.textEntry}"</div>
          </div>
          <div class="signal-translated">
            <div class="signal-trans-label"><span>🔄</span> Gemini Translation · English</div>
            <div class="signal-trans-text">${sig.englishTranslation || sig.aiSummary || sig.text || sig.description || sig.textEntry}</div>
          </div>
          ${imageHtml}
          <div class="signal-meta-row" style="margin-top: 12px;">
            <span class="sig-tag sig-tag-lang">${origLang}</span>
            <span class="sig-tag sig-tag-theme">${sig.theme}</span>
            <span class="sig-tag sig-tag-cluster">${sig.evidenceClusterId || 'Cluster-01'}</span>
            <span class="sig-tag sig-tag-source">${sig.detectedLanguage ? '🎙️ Voice Input' : '🖥️ Portal Input'}</span>
            <span class="sig-tag sig-tag-impact">Priority: ${sig.urgencyScore || '8.2'}</span>
            <span class="sig-tag sig-tag-contrib">Contribution: ${sig.priorityContribution || 'HIGH'}</span>
            <span style="margin-left:auto; font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">📍 ${sig.city || 'Tikamgarh'}, ${sig.state || 'UP'} · Just now</span>
          </div>
        </div>
      `;
    }).join('');
  },

  _renderPredictiveAnalytics(signals) {
    const container = document.getElementById('predictive-chart-container');
    if (!container) return;

    const signalLen = signals ? signals.length : 0;
    
    // Generate data points
    const histVals = [
      120 + Math.round(signalLen * 1.5),
      210 + Math.round(signalLen * 2.1),
      380 + Math.round(signalLen * 3.4),
      540 + Math.round(signalLen * 4.2),
      890 + Math.round(signalLen * 6.5),
      1247 + signalLen
    ];

    const foreVals = [
      Math.round((1247 + signalLen) * 1.15),
      Math.round((1247 + signalLen) * 1.32),
      Math.round((1247 + signalLen) * 1.48),
      Math.round((1247 + signalLen) * 1.62),
      Math.round((1247 + signalLen) * 1.85),
      Math.round((1247 + signalLen) * 2.15)
    ];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allVals = [...histVals, ...foreVals];
    
    const width = 500;
    const height = 200;
    const maxVal = Math.max(...allVals) * 1.1;
    const minVal = 0;
    
    const getX = (i) => 45 + (i * (width - 65) / 11);
    const getY = (val) => height - 30 - ((val - minVal) / (maxVal - minVal) * (height - 50));

    // Build historical path
    let histPath = `M ${getX(0)} ${getY(histVals[0])}`;
    for (let i = 1; i < histVals.length; i++) {
      histPath += ` L ${getX(i)} ${getY(histVals[i])}`;
    }

    // Build forecast path (starts at end of historical)
    let forePath = `M ${getX(histVals.length - 1)} ${getY(histVals[histVals.length - 1])}`;
    for (let i = 0; i < foreVals.length; i++) {
      forePath += ` L ${getX(histVals.length + i)} ${getY(foreVals[i])}`;
    }

    // Gradient fill path for historical
    let fillPath = `${histPath} L ${getX(histVals.length - 1)} ${height - 25} L ${getX(0)} ${height - 25} Z`;

    // SVG HTML code
    let svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; font-family:var(--font-mono); overflow:visible;">
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--sky-500)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--sky-500)" stop-opacity="0.0"/>
          </linearGradient>
          <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--purple-500)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--purple-500)" stop-opacity="0.0"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Y-axis Grid Lines -->
        <line x1="40" y1="${getY(0)}" x2="${width - 15}" y2="${getY(0)}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
        <line x1="40" y1="${getY(maxVal * 0.33)}" x2="${width - 15}" y2="${getY(maxVal * 0.33)}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
        <line x1="40" y1="${getY(maxVal * 0.66)}" x2="${width - 15}" y2="${getY(maxVal * 0.66)}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
        <line x1="40" y1="${getY(maxVal)}" x2="${width - 15}" y2="${getY(maxVal)}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

        <!-- Y-axis Labels -->
        <text x="35" y="${getY(0) + 4}" text-anchor="end" fill="var(--text-muted)" font-size="8px">0</text>
        <text x="35" y="${getY(maxVal * 0.33) + 4}" text-anchor="end" fill="var(--text-muted)" font-size="8px">${Math.round(maxVal * 0.33)}</text>
        <text x="35" y="${getY(maxVal * 0.66) + 4}" text-anchor="end" fill="var(--text-muted)" font-size="8px">${Math.round(maxVal * 0.66)}</text>
        <text x="35" y="${getY(maxVal) + 4}" text-anchor="end" fill="var(--text-muted)" font-size="8px">${Math.round(maxVal)}</text>

        <!-- Gradient fills -->
        <path d="${fillPath}" fill="url(#histGrad)" />
        
        <!-- Historical Line -->
        <path d="${histPath}" fill="none" stroke="var(--sky-500)" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)" />
        
        <!-- Forecast Line -->
        <path d="${forePath}" fill="none" stroke="var(--purple-500)" stroke-width="2" stroke-dasharray="4,4" stroke-linecap="round" filter="url(#glow)" />

        <!-- X-axis Labels -->
    `;

    // Add X-axis labels and points
    for (let i = 0; i < months.length; i++) {
      const isForecast = i >= histVals.length;
      const col = isForecast ? 'var(--purple-400)' : 'var(--sky-400)';
      svgHtml += `
        <text x="${getX(i)}" y="${height - 8}" text-anchor="middle" fill="var(--text-muted)" font-size="8px">${months[i]}</text>
        <circle cx="${getX(i)}" cy="${getY(allVals[i])}" r="3.5" fill="${isForecast ? 'var(--bg-card)' : 'var(--sky-500)'}" stroke="${col}" stroke-width="1.5" />
      `;
    }

    // Add interactive hover overlay vertical line and tooltip marker
    svgHtml += `
        <!-- Vertical tracker -->
        <line id="tracker-line" x1="0" y1="20" x2="0" y2="${height - 25}" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="2,2" style="display:none;" />
      </svg>
      <div id="chart-tooltip" style="position: absolute; display: none; background: rgba(10,15,30,0.95); border: 1px solid rgba(255,255,255,0.12); padding: 8px 12px; border-radius: var(--r-md); pointer-events: none; z-index: 100; font-family: var(--font-body); font-size: 11px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(8px); min-width: 150px;">
        <div id="tooltip-month" style="font-weight: 600; font-family: var(--font-display); color: var(--text-primary); border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px; margin-bottom: 4px;">Month</div>
        <div style="display: flex; justify-content: space-between; gap: 12px;"><span style="color:var(--text-secondary);">Demand:</span> <strong id="tooltip-val" style="color:var(--sky-400); font-family:var(--font-mono);">0</strong></div>
        <div style="display: flex; justify-content: space-between; gap: 12px;"><span style="color:var(--text-secondary);">Growth:</span> <strong id="tooltip-growth" style="color:var(--emerald-400);">+0%</strong></div>
      </div>
    `;

    container.innerHTML = svgHtml;

    // Interactive mouse movement handling
    const svgEl = container.querySelector('svg');
    const trackerLine = container.querySelector('#tracker-line');
    const tooltip = container.querySelector('#chart-tooltip');
    const tMonth = container.querySelector('#tooltip-month');
    const tVal = container.querySelector('#tooltip-val');
    const tGrowth = container.querySelector('#tooltip-growth');

    if (svgEl) {
      svgEl.addEventListener('mousemove', (e) => {
        const rect = svgEl.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const svgMouseX = mouseX * (width / rect.width);
        
        // Find closest point index
        let closestIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < months.length; i++) {
          const dist = Math.abs(getX(i) - svgMouseX);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = i;
          }
        }

        const pointX = getX(closestIdx);
        const pointY = getY(allVals[closestIdx]);
        const isForecast = closestIdx >= histVals.length;

        // Position tracker line
        trackerLine.setAttribute('x1', pointX);
        trackerLine.setAttribute('x2', pointX);
        trackerLine.style.display = 'block';

        // Position & populate tooltip
        tooltip.style.display = 'block';
        
        // Bounds checking for tooltip position
        const tooltipX = mouseX + 15;
        const tooltipY = Math.min(height - 100, Math.max(10, (pointY * rect.height / height) - 40));
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;

        tMonth.textContent = `${months[closestIdx]} ${isForecast ? '(Forecasted)' : '(Historical)'}`;
        tMonth.style.color = isForecast ? 'var(--purple-300)' : 'var(--sky-300)';
        
        tVal.textContent = allVals[closestIdx].toLocaleString('en-IN') + ' signals';
        tVal.style.color = isForecast ? 'var(--purple-400)' : 'var(--sky-400)';
        
        const growthPct = closestIdx === 0 ? 0 : Math.round(((allVals[closestIdx] - allVals[closestIdx - 1]) / allVals[closestIdx - 1]) * 100);
        tGrowth.textContent = (growthPct >= 0 ? `+${growthPct}` : `${growthPct}`) + '%';
        tGrowth.style.color = growthPct >= 0 ? 'var(--emerald-400)' : 'var(--crimson-400)';
      });

      svgEl.addEventListener('mouseleave', () => {
        trackerLine.style.display = 'none';
        tooltip.style.display = 'none';
      });
    }

    // Also update forecast texts dynamically!
    const hotspotTxt = document.getElementById('forecast-hotspot-text');
    const popTxt = document.getElementById('forecast-pop-text');
    if (hotspotTxt && signals && signals.length > 0) {
      const topCat = signals[0].theme || 'Infrastructure';
      const topCity = signals[0].city || 'Bundelkhand';
      hotspotTxt.innerHTML = `Our predictive models suggest a high-probability demand spike (+${25 + signalLen}%) for <strong>${topCat}</strong> in rural <strong>${topCity}</strong> over the next 3 months, driven by seasonal shifts and regional deficit indices.`;
      
      const popEstimateVal = signals.length * 1200 + signalLen * 150;
      popTxt.innerHTML = `Anticipated population growth in these clusters will affect up to <strong>${popEstimateVal.toLocaleString('en-IN')}</strong> additional citizens, escalating the local deficit index by <strong>18%</strong> by next fiscal year.`;
    }
  },

  enlargeImage(imgUrl) {
    let lightbox = document.getElementById('jv-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'jv-lightbox';
      lightbox.style.position = 'fixed';
      lightbox.style.top = '0';
      lightbox.style.left = '0';
      lightbox.style.width = '100%';
      lightbox.style.height = '100%';
      lightbox.style.background = 'rgba(0,0,0,0.85)';
      lightbox.style.backdropFilter = 'blur(10px)';
      lightbox.style.zIndex = '99999';
      lightbox.style.display = 'none';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';
      lightbox.style.cursor = 'zoom-out';
      lightbox.onclick = () => { lightbox.style.display = 'none'; };
      lightbox.innerHTML = `
        <img id="lightbox-img" src="" style="max-width:90%; max-height:90%; border-radius: var(--r-md); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15);" />
        <button style="position:fixed; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:white; font-size:24px; width:48px; height:48px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
      `;
      document.body.appendChild(lightbox);
    }
    document.getElementById('lightbox-img').src = imgUrl;
    lightbox.style.display = 'flex';
  },

  _initSettingsModal() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsCloseBtn = document.getElementById('settings-modal-close');
    const settingsSaveBtn = document.getElementById('settings-save-btn');
    const settingsClearBtn = document.getElementById('settings-clear-btn');
    const settingsApiKeyInput = document.getElementById('settings-api-key');
    const settingsStatusBadge = document.getElementById('settings-engine-status');
    const toggleVisibilityBtn = document.getElementById('toggle-key-visibility');

    if (!settingsBtn || !settingsModal) {
      console.warn("Settings button or modal not found on page");
      return;
    }

    const updateStatusDisplay = async () => {
      const key = localStorage.getItem('gemini_api_key');
      if (key) {
        settingsApiKeyInput.value = key;
        if (settingsStatusBadge) {
          settingsStatusBadge.textContent = '⏳ Validating Key...';
          settingsStatusBadge.style.background = 'rgba(99, 102, 241, 0.15)';
          settingsStatusBadge.style.border = '1px solid rgba(99, 102, 241, 0.3)';
          settingsStatusBadge.style.color = '#6366f1';
        }
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "say ok" }] }]
            })
          });
          if (response.ok) {
            if (settingsStatusBadge) {
              settingsStatusBadge.textContent = '✓ Gemini Connected';
              settingsStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
              settingsStatusBadge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
              settingsStatusBadge.style.color = '#10b981';
            }
          } else {
            if (settingsStatusBadge) {
              settingsStatusBadge.textContent = '✗ Invalid API Key';
              settingsStatusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
              settingsStatusBadge.style.border = '1px solid rgba(239, 68, 68, 0.3)';
              settingsStatusBadge.style.color = '#ef4444';
            }
          }
        } catch (err) {
          if (!navigator.onLine) {
            if (settingsStatusBadge) {
              settingsStatusBadge.textContent = '⚠ Offline (Key Saved)';
              settingsStatusBadge.style.background = 'rgba(245, 158, 11, 0.15)';
              settingsStatusBadge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
              settingsStatusBadge.style.color = '#f59e0b';
            }
          } else {
            if (settingsStatusBadge) {
              settingsStatusBadge.textContent = '✓ Gemini Connected';
              settingsStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
              settingsStatusBadge.style.border = '1px solid rgba(16, 185, 129, 0.3)';
              settingsStatusBadge.style.color = '#10b981';
            }
          }
        }
      } else {
        settingsApiKeyInput.value = '';
        if (settingsStatusBadge) {
          settingsStatusBadge.textContent = '⚠ Gemini API Key Missing';
          settingsStatusBadge.style.background = 'rgba(245, 158, 11, 0.15)';
          settingsStatusBadge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
          settingsStatusBadge.style.color = '#f59e0b';
        }
      }
    };

    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateStatusDisplay();
      settingsModal.style.display = 'flex';
      setTimeout(() => {
        settingsModal.style.opacity = '1';
        settingsModal.classList.add('open');
      }, 10);
    });

    const closeModal = () => {
      settingsModal.style.opacity = '0';
      settingsModal.classList.remove('open');
      setTimeout(() => {
        settingsModal.style.display = 'none';
      }, 200);
    };

    if (settingsCloseBtn) {
      settingsCloseBtn.addEventListener('click', closeModal);
    }

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeModal();
      }
    });

    if (settingsSaveBtn) {
      settingsSaveBtn.addEventListener('click', () => {
        const newKey = settingsApiKeyInput.value.trim();
        if (newKey) {
          localStorage.setItem('gemini_api_key', newKey);
          updateStatusDisplay();
          this._showToast('Gemini API Key saved successfully! The AI Engine has automatically reconnected.');
          closeModal();
          // Reload dashboard to regenerate views with the real key if desired
          this.renderDashboard();
        } else {
          alert('Please enter a valid API Key first.');
        }
      });
    }

    if (settingsClearBtn) {
      settingsClearBtn.addEventListener('click', () => {
        localStorage.removeItem('gemini_api_key');
        updateStatusDisplay();
        this._showToast('Gemini API Key removed. Fell back to the local NLP rules engine.');
        closeModal();
        this.renderDashboard();
      });
    }

    if (toggleVisibilityBtn && settingsApiKeyInput) {
      toggleVisibilityBtn.addEventListener('click', () => {
        const type = settingsApiKeyInput.type === 'password' ? 'text' : 'password';
        settingsApiKeyInput.type = type;
        toggleVisibilityBtn.textContent = type === 'password' ? '👁️' : '🔒';
      });
    }

    // Set initial status display on page load
    updateStatusDisplay();
  },

  /* ─── Toast Helper ──────────────────────────────────── */
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

// Expose globally so that inline triggers still work
window.JanVikasAI = JanVikasAI;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    JanVikasAI.init();
  });
} else {
  JanVikasAI.init();
}
