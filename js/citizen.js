/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — Public Citizen Portal Controller
 * Category: Government Intelligence / AI-Native Intake
 * Style: Dark OLED + Glassmorphism + Interactive Simulation
 * ═══════════════════════════════════════════════════════
 */

import { Utils } from './utils.js';
import { StorageEngine } from './firebase.js';
import { AIEngine } from './ai-engine.js';

const JanVikasCitizen = {
  /* ─── Hierarchical Location Datasets ─────────────────── */
  locationData: {
    "Uttar Pradesh": {
      "Tikamgarh": {
        "Tikamgarh Block": ["Ward 4 - Gidkhini Village", "Ward 12 - Tikamgarh Town", "Kharagpur Panchayat"],
        "Niwari Block": ["Ward 1 - Niwari Proper", "Orchha Heritage Ward", "Prithvipur Village"],
        "Lalitpur Block": ["Ward 8 - Lalitpur Town", "Maharoni Panchayat", "Talbehat Village Grid"]
      },
      "Jhansi": {
        "Jhansi Sadar": ["Ward 15 - Jhansi Fort", "Sipri Bazar Ward", "Baragaon Block"],
        "Mauranipur": ["Ward 5 - Mauranipur Proper", "Gursarai Panchayat", "Ranipur Handloom Grid"]
      }
    },
    "Bihar": {
      "Gaya": {
        "Gaya Sadar": ["Ward 12 - Chand Chaura", "Ward 15 - Gaya Main", "Pahasi Village Panchayat"],
        "Bodhgaya": ["Ward 2 - Temple Sector", "Bodhgaya Block Proper", "Mastiipur Gram Panchayat"],
        "Sherghati": ["Ward 9 - Sherghati Proper", "Dobhi Block", "Amas Village Grid"]
      },
      "Patna": {
        "Patna Urban": ["Ward 22 - Kankarbagh", "Ward 34 - Fraser Road", "Ward 11 - Danapur"],
        "Phulwari Sharif": ["Ward 3 - Phulwari Sharif", "Khagaul Block", "Janipur Gram Panchayat"]
      }
    },
    "Odisha": {
      "Koraput": {
        "Koraput Block": ["Ward 3 - Pujariput", "Ward 8 - Koraput Town", "Damanjodi Panchayat"],
        "Jeypore Block": ["Ward 14 - Jeypore Town", "Borigumma Block", "Kundura Gram Panchayat"],
        "Semiliguda": ["Ward 5 - Semiliguda Main", "Sunabeda Aerospace Ward", "Pottangi Village"]
      }
    }
  },

  /* ─── State ─────────────────────────────────────────── */
  state: {
    inputType: 'text', // text | voice
    recording: false,
    recordingSeconds: 0,
    recordingTimerInterval: null,
    uploadedFiles: [],
    selectedState: 'Uttar Pradesh',
    selectedDistrict: 'Tikamgarh',
    selectedCity: 'Tikamgarh Block',
    supportedProposals: new Set()
  },

  /* ─── Elements ──────────────────────────────────────── */
  _el: {},

  /* ─── Initialization ────────────────────────────────── */
  init() {
    this._cacheElements();
    this._bindEvents();
    this._populateStates();
    Utils.initClock('portal-clock');
    this.resetForm();
  },

  _cacheElements() {
    this._el = {
      btnInputText: document.getElementById('btn-input-text'),
      btnInputVoice: document.getElementById('btn-input-voice'),
      textEntryArea: document.getElementById('text-entry-area'),
      voiceEntryArea: document.getElementById('voice-entry-area'),
      micToggle: document.getElementById('mic-toggle'),
      recordingStatus: document.getElementById('recording-status-label'),
      recordingTimer: document.getElementById('recording-timer'),
      soundWave: document.getElementById('sound-wave'),
      descriptionInput: document.getElementById('citizen-description'),
      charCounter: document.getElementById('char-counter'),
      dropZone: document.getElementById('drop-zone'),
      fileInput: document.getElementById('file-upload-input'),
      previewContainer: document.getElementById('preview-container'),
      locState: document.getElementById('loc-state'),
      locDistrict: document.getElementById('loc-district'),
      locCity: document.getElementById('loc-city'),
      locWard: document.getElementById('loc-ward'),
      portalGrid: document.getElementById('portal-grid'),
      intakeCard: document.getElementById('citizen-intake-card'),
      processingArea: document.getElementById('analysis-processing-area'),
      aiResultsPanel: document.getElementById('ai-results-panel')
    };
  },

  _bindEvents() {
    // Drag and drop event listeners
    if (this._el.dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        this._el.dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this._el.dropZone.classList.add('dragover');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this._el.dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this._el.dropZone.classList.remove('dragover');
        }, false);
      });

      this._el.dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleDroppedFiles(files);
      }, false);
    }
  },

  /* ─── Input Type Controller ─────────────────────────── */
  setInputType(type) {
    this.state.inputType = type;
    if (type === 'text') {
      this._el.btnInputText.className = 'pill-btn active';
      this._el.btnInputVoice.className = 'pill-btn inactive';
      this._el.textEntryArea.style.display = 'flex';
      this._el.voiceEntryArea.style.display = 'none';
      if (this.state.recording) this.stopVoiceRecording(false);
    } else {
      this._el.btnInputText.className = 'pill-btn inactive';
      this._el.btnInputVoice.className = 'pill-btn active';
      this._el.textEntryArea.style.display = 'none';
      this._el.voiceEntryArea.style.display = 'flex';
    }
  },

  /* ─── Voice Recording Controller ────────────────────── */
  toggleVoiceRecording() {
    if (!this.state.recording) {
      this.startVoiceRecording();
    } else {
      this.stopVoiceRecording(true);
    }
  },

  startVoiceRecording() {
    this.state.recording = true;
    this._el.micToggle.classList.add('active');
    this._el.micToggle.querySelector('.mic-icon').textContent = '⏹️';
    this._el.voiceEntryArea.classList.add('recording');
    this._el.recordingStatus.textContent = 'Recording Ambient Audio in Native Language...';
    this._el.recordingStatus.classList.add('recording-text');
    this._el.recordingTimer.style.display = 'block';
    this._el.soundWave.style.display = 'flex';
    
    this.state.recordingSeconds = 0;
    this._el.recordingTimer.textContent = '00:00';
    this.state.recordingTimerInterval = setInterval(() => {
      this.state.recordingSeconds++;
      const mins = String(Math.floor(this.state.recordingSeconds / 60)).padStart(2, '0');
      const secs = String(this.state.recordingSeconds % 60).padStart(2, '0');
      this._el.recordingTimer.textContent = `${mins}:${secs}`;

      // Simulate wave heights
      const bars = this._el.soundWave.querySelectorAll('.wave-bar');
      bars.forEach(bar => {
        const h = Math.floor(Math.random() * 20) + 4;
        bar.style.height = `${h}px`;
      });
    }, 1000);
  },

  stopVoiceRecording(keepData) {
    this.state.recording = false;
    this._el.micToggle.classList.remove('active');
    this._el.micToggle.querySelector('.mic-icon').textContent = '🎙️';
    this._el.voiceEntryArea.classList.remove('recording');
    this._el.recordingStatus.classList.remove('recording-text');
    this._el.recordingStatus.textContent = 'Audio Captured Successfully ✓';
    this._el.recordingTimer.style.display = 'none';
    this._el.soundWave.style.display = 'none';

    clearInterval(this.state.recordingTimerInterval);

    if (keepData) {
      this._showToast("Native voice signal captured. Ready to transcribe.");
      // Auto-fill some voice description simulation so that they can submit it!
      this._el.descriptionInput.value = "మా గ్రామంలో తాగునీటి సమస్య ఉంది. పిల్లలు స్కూలుకు వెళ్ళలేకపోతున్నారు. ఎందుకంటే 8 కిలోమీటర్లు వెళ్లి నీళ్లు మోసుకురావాల్సి వస్తోంది.";
      this.handleTextareaInput();
    }
  },

  /* ─── Textarea Character Counter ────────────────────── */
  handleTextareaInput() {
    const len = this._el.descriptionInput.value.length;
    this._el.charCounter.textContent = `${len} / 2000 chars`;
  },

  /* ─── Drag & Drop / Image Previews ──────────────────── */
  handleDroppedFiles(files) {
    this.processFileAttachments(files);
  },

  handleFileSelect(e) {
    this.processFileAttachments(e.target.files);
  },

  processFileAttachments(files) {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        this._showToast("Only image files are permitted as visual evidence.");
        return;
      }
      if (this.state.uploadedFiles.length >= 4) {
        this._showToast("Maximum limit of 4 photos reached.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileObj = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          dataUrl: e.target.result
        };
        this.state.uploadedFiles.push(fileObj);
        this._renderImagePreviews();
      };
      reader.readAsDataURL(file);
    });
  },

  removeUploadedImage(id) {
    this.state.uploadedFiles = this.state.uploadedFiles.filter(f => f.id !== id);
    this._renderImagePreviews();
  },

  _renderImagePreviews() {
    const container = this._el.previewContainer;
    if (!container) return;

    if (this.state.uploadedFiles.length === 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.style.display = 'grid';
    container.innerHTML = this.state.uploadedFiles.map(file => `
      <div class="thumb-preview" style="background-image: url('${file.dataUrl}')">
        <button type="button" class="thumb-remove" onclick="JanVikasCitizen.removeUploadedImage('${file.id}')">✕</button>
      </div>
    `).join('');
  },

  /* ─── Hierarchical Location Selector Dropdowns ──────── */
  _populateStates() {
    const states = Object.keys(this.locationData);
    this._el.locState.innerHTML = states.map(s => `<option value="${s}">${s}</option>`).join('');
    this.onStateChange(states[0]);
  },

  onStateChange(stateName) {
    this.state.selectedState = stateName;
    const districts = Object.keys(this.locationData[stateName] || {});
    this._el.locDistrict.innerHTML = districts.map(d => `<option value="${d}">${d}</option>`).join('');
    this.onDistrictChange(districts[0]);
  },

  onDistrictChange(districtName) {
    this.state.selectedDistrict = districtName;
    const cities = Object.keys(this.locationData[this.state.selectedState]?.[districtName] || {});
    this._el.locCity.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');
    this.onCityChange(cities[0]);
  },

  onCityChange(cityName) {
    this.state.selectedCity = cityName;
    const wards = this.locationData[this.state.selectedState]?.[this.state.selectedDistrict]?.[cityName] || [];
    this._el.locWard.innerHTML = wards.map(w => `<option value="${w}">${w}</option>`).join('');
  },

  /* ─── Form Submission & Pipeline Simulation ────────── */
  async handleFormSubmit(e) {
    e.preventDefault();

    const text = this._el.descriptionInput.value.trim();
    const hasText = text.length > 0;
    const hasVoice = this.state.inputType === 'voice' && !this.state.recording && this.state.recordingSeconds > 0;

    if (!hasText && !hasVoice) {
      this._showToast("Please write a description or record a voice signal before submitting.");
      return;
    }

    // Toggle layout into processing simulation state
    this._el.intakeCard.style.display = 'none';
    this._el.processingArea.style.display = 'flex';
    this._el.aiResultsPanel.style.display = 'none';

    // Scroll to processing timeline smoothly
    this._el.processingArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Begin pipeline step animations (Sequential delays)
    this._simulateAIProcessingSteps(text);
  },

  _simulateAIProcessingSteps(text) {
    const steps = [
      { id: 'step-received', delay: 400 },
      { id: 'step-lang', delay: 1000 },
      { id: 'step-stt', delay: 1800 },
      { id: 'step-translation', delay: 2800 },
      { id: 'step-vision', delay: 3500 },
      { id: 'step-theme', delay: 4300 },
      { id: 'step-similarity', delay: 5000 },
      { id: 'step-fusion', delay: 5800 },
      { id: 'step-priority', delay: 6500 },
      { id: 'step-ready', delay: 7200 }
    ];

    // Clear previous classes
    document.querySelectorAll('.timeline-step').forEach(step => {
      step.classList.remove('active', 'completed');
    });

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const el = document.getElementById(step.id);
        if (!el) return;

        // Set previous step completed
        if (idx > 0) {
          const prevEl = document.getElementById(steps[idx - 1].id);
          if (prevEl) {
            prevEl.classList.remove('active');
            prevEl.classList.add('completed');
          }
        }

        // Set current step active
        el.classList.add('active');

        // Render results on final step
        if (idx === steps.length - 1) {
          setTimeout(async () => {
            await this._processAndShowAIResults(text);
          }, 800);
        }
      }, step.delay);
    });
  },

  /* ─── AI Results Rendering ─────────────────────────── */
  async _processAndShowAIResults(text) {
    const reportPayload = {
      text: text,
      state: this.state.selectedState,
      district: this.state.selectedDistrict,
      city: this.state.selectedCity,
      ward: document.getElementById('loc-ward').value,
      images: this.state.uploadedFiles.map(img => img.dataUrl)
    };

    // Analyze using the AI engine
    const scenario = await AIEngine.analyzeReport(reportPayload);

    // Save report to StorageEngine (Firestore or LocalStorage Cache)
    const storedReport = {
      uid: Utils.generateUUID(),
      title: scenario.theme + " - " + reportPayload.city,
      text: reportPayload.text,
      state: reportPayload.state,
      district: reportPayload.district,
      city: reportPayload.city,
      ward: reportPayload.ward,
      theme: scenario.theme,
      scheme: scenario.scheme,
      urgency: scenario.theme === 'Water Infrastructure' ? 'critical' : (scenario.theme === 'Healthcare Access' ? 'critical' : 'high'),
      urgencyScore: scenario.urgencyValue || 8.2,
      detectedLanguage: scenario.lang,
      englishTranslation: scenario.translation,
      evidenceClusterId: scenario.clusterId,
      priorityContribution: scenario.contribution,
      aiSummary: scenario.summary,
      confidence: scenario.confidence,
      images: reportPayload.images,
      supports: 1,
      timestamp: Date.now()
    };

    await StorageEngine.insert('citizenSignals', storedReport);

    // Bind fields to DOM
    document.getElementById('res-detected-lang').textContent = scenario.lang;
    const themeEl = document.getElementById('res-theme');
    themeEl.textContent = scenario.theme;
    themeEl.className = `res-value ${scenario.themeClass}`;

    // Adjust transcript display if spoken or typed
    const labelEl = document.getElementById('res-transcript-label');
    if (this.state.inputType === 'voice') {
      labelEl.textContent = "Gemini AI Speech Transcript";
      document.getElementById('res-transcript').textContent = `"${scenario.transcript}"`;
    } else {
      labelEl.textContent = "Original Citizen Text";
      document.getElementById('res-transcript').textContent = `"${text}"`;
    }

    // Set Translation
    if (this.state.inputType === 'voice' || text.match(/[^a-zA-Z0-9\s,.?]/)) {
      document.getElementById('res-translation').parentElement.style.display = 'block';
      document.getElementById('res-translation').textContent = `"${scenario.translation}"`;
    } else {
      document.getElementById('res-translation').parentElement.style.display = 'none';
    }

    document.getElementById('res-scheme').textContent = scenario.scheme;
    const urgencyEl = document.getElementById('res-urgency');
    urgencyEl.textContent = scenario.urgency;
    urgencyEl.className = `res-value ${scenario.urgencyClass}`;
    
    document.getElementById('res-cluster-id').textContent = scenario.clusterId;
    document.getElementById('res-contribution').textContent = scenario.contribution;
    document.getElementById('res-ai-summary').innerHTML = scenario.summary;
    document.getElementById('conf-score').textContent = scenario.confidence;

    // Render similar proposals list
    const proposalsContainer = document.getElementById('proposals-container');
    if (proposalsContainer) {
      proposalsContainer.innerHTML = scenario.proposals.map(prop => `
        <div class="proposal-item" id="prop-card-${prop.id}">
          <div class="proposal-head">
            <span class="proposal-name">${prop.name}</span>
            <span class="proposal-match">${prop.match}</span>
          </div>
          <div class="proposal-meta">
            <span>📍 ${this.state.selectedDistrict}, ${this.state.selectedState}</span>
            <span>•</span>
            <span>Theme: ${prop.theme}</span>
          </div>
          <div class="proposal-action-row">
            <span style="font-size: 11px; color: var(--text-tertiary);" id="support-count-label-${prop.id}">👥 ${prop.supports.toLocaleString('en-IN')} citizens supporting</span>
            <button class="support-btn" id="support-btn-${prop.id}" onclick="JanVikasCitizen.supportProposal(${prop.id})">
              <span>👍</span> Support Existing Proposal
            </button>
          </div>
        </div>
      `).join('');
    }

    // Reset support button states
    this.state.supportedProposals.clear();

    // Swap views
    this._el.processingArea.style.display = 'none';
    this._el.aiResultsPanel.style.display = 'block';
    this._el.aiResultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    this._showToast("Gemini Analysis Completed! Results compiled for government cockpit.");
  },

  supportProposal(id) {
    if (this.state.supportedProposals.has(id)) return;
    
    this.state.supportedProposals.add(id);
    const btn = document.getElementById(`support-btn-${id}`);
    const label = document.getElementById(`support-count-label-${id}`);

    if (btn && label) {
      btn.className = 'support-btn supported';
      btn.innerHTML = '✓ Supported!';
      
      // Increment support count in mock UI
      const match = label.textContent.match(/\d+[\d,]*/);
      if (match) {
        const count = parseInt(match[0].replace(/,/g, ''), 10) + 1;
        label.textContent = `👥 ${count.toLocaleString('en-IN')} citizens supporting`;
      }
      this._showToast("Thank you! Your support vote has been compiled in this evidence cluster.");
    }
  },

  /* ─── Reset State ───────────────────────────────────── */
  resetForm() {
    this.state.inputType = 'text';
    this.state.uploadedFiles = [];
    this.state.recording = false;
    this.state.recordingSeconds = 0;
    
    if (this._el.descriptionInput) this._el.descriptionInput.value = '';
    if (this._el.charCounter) this._el.charCounter.textContent = '0 / 2000 chars';
    this._renderImagePreviews();

    if (this._el.intakeCard) this._el.intakeCard.style.display = 'block';
    if (this._el.processingArea) this._el.processingArea.style.display = 'none';
    if (this._el.aiResultsPanel) this._el.aiResultsPanel.style.display = 'none';

    this.setInputType('text');
  },

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
  }
};

// Expose globally so that inline events find it perfectly
window.JanVikasCitizen = JanVikasCitizen;

// Start portal on page load
document.addEventListener('DOMContentLoaded', () => {
  JanVikasCitizen.init();
});
