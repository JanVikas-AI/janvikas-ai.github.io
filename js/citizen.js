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
    "Andhra Pradesh": {
      "Visakhapatnam": {
        "Visakhapatnam Urban": ["Ward 5 - Beach Road Area", "Ward 12 - Madhurawada Sector", "Gajuwaka Industrial Ward"],
        "Anakapalli Block": ["Ward 2 - Anakapalli Town", "Munagapaka Village Panchayat", "Kasimkota Local Grid"]
      },
      "Anantapur": {
        "Dharmavaram": ["Ward 8 - Silk Weavers Grid", "Dharmavaram Town Centre", "Battalapalli Panchayat"],
        "Hindupur": ["Ward 4 - Hindupur Proper", "Lepakshi Heritage Sector", "Chilamathur Block"]
      }
    },
    "Arunachal Pradesh": {
      "Itanagar Capital Complex": {
        "Itanagar Block": ["Ward 1 - Ganga Market", "Ward 3 - Niti Vihar Sector", "Chimpu Gram Panchayat"],
        "Naharlagun Block": ["Ward 7 - Naharlagun Town", "Nirjuli Village Cluster", "Banderdewa Checkpoint Ward"]
      }
    },
    "Assam": {
      "Kamrup Metropolitan": {
        "Guwahati Municipal Corp": ["Ward 15 - Paltan Bazar Area", "Ward 22 - Dispur Secretariat Area", "Ward 31 - Maligaon Junction Area"],
        "Azara Block": ["Ward 2 - Azara proper", "Dharapur Panchayat", "Kahikuchi Village Grid"]
      },
      "Dibrugarh": {
        "Dibrugarh Sadar": ["Ward 4 - Dibrugarh University Sector", "Ward 8 - Marwari Patty", "Barbaruah Panchayat"]
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
    "Chhattisgarh": {
      "Raipur": {
        "Raipur Municipal Corp": ["Ward 12 - Shastri Chowk Area", "Ward 18 - Tatibandh Sector", "Abhanpur Village Panchayat"],
        "Arang Block": ["Ward 5 - Arang Town", "Mandir Hasaud Panchayat", "Kharora Village Grid"]
      }
    },
    "Goa": {
      "North Goa": {
        "Panaji Block": ["Ward 3 - Miramar Beach Area", "Ward 9 - Fontainhas Heritage Quarter", "Taleigao Panchayat"],
        "Mapusa Block": ["Ward 2 - Mapusa Municipal Area", "Calangute Village Grid", "Anjuna Coast Sector"]
      },
      "South Goa": {
        "Margao Block": ["Ward 7 - Margao Railway Area", "Fatorda Sports Complex Ward", "Curtorim Village Grid"]
      }
    },
    "Gujarat": {
      "Ahmedabad": {
        "Ahmedabad Municipal Corp": ["Ward 4 - Vastrapur Area", "Ward 15 - Maninagar Sector", "Nikol Development Grid"],
        "Sanand Block": ["Ward 1 - Sanand Town", "Sanand GIDC Industrial Ward", "Changodar Panchayat"]
      },
      "Surat": {
        "Surat Municipal Corp": ["Ward 10 - Adajan Area", "Ward 24 - Varachha Sector", "Katargam Diamond Ward"]
      }
    },
    "Haryana": {
      "Gurugram": {
        "Gurugram Municipal Corp": ["Ward 11 - DLF Sector 25 Area", "Ward 18 - Sohna Road Corridor", "Pataudi Rural Panchayat"],
        "Sohna Block": ["Ward 3 - Sohna Town", "Sohna GIDC Sector", "Bhondsi Village Grid"]
      }
    },
    "Himachal Pradesh": {
      "Shimla": {
        "Shimla Municipal Corp": ["Ward 2 - Mall Road Area", "Ward 8 - Chhota Shimla Sector", "Dhalli Panchayat Area"],
        "Rampur Block": ["Ward 1 - Rampur Bushahr", "Nankhari Village Cluster", "Sarahan Temple Ward"]
      }
    },
    "Jharkhand": {
      "Ranchi": {
        "Ranchi Municipal Corp": ["Ward 14 - Lalpur Chowk Area", "Ward 22 - Kanke Road Sector", "Hatla Block Panchayat"],
        "Bundu Block": ["Ward 2 - Bundu Town", "Tamar Gram Panchayat", "Sonahatu Village Grid"]
      }
    },
    "Karnataka": {
      "Bengaluru Urban": {
        "BBMP Central": ["Ward 77 - Indiranagar Area", "Ward 150 - Bellandur Tech Corridor", "Ward 198 - Electronic City Sector"],
        "Yelahanka Block": ["Ward 4 - Yelahanka New Town", "Bagalur Village Panchayat", "Doddaballapur Industrial Ward"]
      },
      "Mysuru": {
        "Mysuru Municipal Corp": ["Ward 11 - Palace Sector Area", "Gokulam Residential Ward", "Chamundi Hill Panchayat"]
      }
    },
    "Kerala": {
      "Thiruvananthapuram": {
        "Trivandrum Corp": ["Ward 14 - Kowdiar Palace Area", "Ward 35 - Kazhakkoottam Techpark", "Vizhinjam Port Area Ward"],
        "Neyyattinkara Block": ["Ward 2 - Neyyattinkara Town", "Parassala Village Panchayat", "Balaramapuram Handloom Ward"]
      }
    },
    "Madhya Pradesh": {
      "Indore": {
        "Indore Municipal Corp": ["Ward 18 - Vijay Nagar Sector", "Ward 32 - Rajwada Area", "Mhow Cantonment Ward"],
        "Depalpur Block": ["Ward 3 - Depalpur Town", "Betma Panchayat Area", "Gautampura Village Grid"]
      },
      "Tikamgarh": {
        "Tikamgarh Block": ["Ward 4 - Gidkhini Village", "Ward 12 - Tikamgarh Town", "Kharagpur Panchayat"],
        "Niwari Block": ["Ward 1 - Niwari Proper", "Orchha Heritage Ward", "Prithvipur Village"]
      }
    },
    "Maharashtra": {
      "Mumbai City": {
        "MCGM Central": ["Ward A - Colaba Area", "Ward F/North - Matunga Sector", "Ward G/South - Elphinstone Area"],
        "Dharavi Block": ["Ward 1 - Dharavi Main Sector", "Koliwada Fishing Ward", "Shahu Nagar Area"]
      },
      "Pune": {
        "Pune Municipal Corp": ["Ward 12 - Koregaon Park Area", "Ward 25 - Hinjawadi Tech Sector", "Hadapsar Industrial Ward"]
      }
    },
    "Manipur": {
      "Imphal West": {
        "Imphal Municipal Corp": ["Ward 3 - Kangla Fort Sector", "Ward 7 - Babupatty Area", "Lilong Chajijing Panchayat"],
        "Wangoi Block": ["Ward 2 - Wangoi Proper", "Samurou Village Grid", "Mayang Imphal Block"]
      }
    },
    "Meghalaya": {
      "East Khasi Hills": {
        "Shillong Municipal Board": ["Ward 4 - Police Bazar Area", "Ward 9 - Laitumkhrah Sector", "Mawlai Gram Panchayat"],
        "Sohra Block": ["Ward 1 - Cherrapunjee Proper", "Shella Village Panchayat", "Mawsynram Deficit Grid"]
      }
    },
    "Mizoram": {
      "Aizawl": {
        "Aizawl Municipal Corp": ["Ward 2 - Chanmari Area", "Ward 8 - Tuikual Sector", "Zemabawk Village Panchayat"]
      }
    },
    "Nagaland": {
      "Kohima": {
        "Kohima Municipal Council": ["Ward 3 - Officers Hill", "Ward 7 - Midland Area", "Mawlai Local Panchayat"],
        "Chiephobozou Block": ["Ward 2 - Chiephobozou Town", "Nerhema Village Grid", "Tseminyu Border Sector"]
      }
    },
    "Odisha": {
      "Khordha": {
        "Bhubaneswar Municipal Corp": ["Ward 12 - Saheed Nagar Area", "Ward 33 - Patia Tech Corridor", "Jatni Railway Junction Grid"],
        "Khordha Sadar": ["Ward 4 - Khordha Town", "Begunia Block Panchayat", "Bolagarh Gram Panchayat"]
      },
      "Koraput": {
        "Koraput Block": ["Ward 3 - Pujariput", "Ward 8 - Koraput Town", "Damanjodi Panchayat"],
        "Jeypore Block": ["Ward 14 - Jeypore Town", "Borigumma Block", "Kundura Gram Panchayat"]
      }
    },
    "Punjab": {
      "Amritsar": {
        "Amritsar Municipal Corp": ["Ward 5 - Golden Temple Sector", "Ward 12 - Lawrence Road Area", "Attari Border Village Grid"],
        "Ajnala Block": ["Ward 1 - Ajnala Town", "Ramdas Panchayat Area", "Chogawan Block"]
      }
    },
    "Rajasthan": {
      "Jaipur": {
        "Jaipur Municipal Corp": ["Ward 18 - C-Scheme Area", "Ward 35 - Malviya Nagar Sector", "Sanganer Handloom Ward"],
        "Chomu Block": ["Ward 3 - Chomu Town", "Govindgarh Village Grid", "Kaladera Industrial Ward"]
      },
      "Barmer": {
        "Barmer Block": ["Ward 1 - Barmer Proper", "Balotra Panchayat", "Sheo Gram Panchayat"]
      }
    },
    "Sikkim": {
      "Gangtok": {
        "Gangtok Municipal Corp": ["Ward 3 - MG Marg Area", "Ward 8 - Deorali Sector", "Ranipool Development Grid"]
      }
    },
    "Tamil Nadu": {
      "Chennai": {
        "GCC Central": ["Ward 104 - Nungambakkam Area", "Ward 134 - T-Nagar Retail Sector", "Ward 179 - Adyar Tech Hub"],
        "Ambattur Block": ["Ward 5 - Ambattur Industrial Estate", "Avadi Development Grid", "Maduravoyal Panchayat"]
      }
    },
    "Telangana": {
      "Hyderabad": {
        "GHMC Central": ["Ward 12 - Banjara Hills Area", "Ward 45 - Gachibowli Tech Corridor", "Ward 89 - Secunderabad Station Area"],
        "Rajendranagar Block": ["Ward 2 - Rajendranagar Town", "Shamshabad Airport Sector", "Moinabad Village Grid"]
      }
    },
    "Tripura": {
      "West Tripura": {
        "Agartala Municipal Corp": ["Ward 4 - Ramnagar Area", "Ward 11 - Banamalipur Sector", "Ranirbazar Panchayat"]
      }
    },
    "Uttar Pradesh": {
      "Jhansi": {
        "Jhansi Sadar": ["Ward 15 - Jhansi Fort", "Sipri Bazar Ward", "Baragaon Block"],
        "Mauranipur": ["Ward 5 - Mauranipur Proper", "Gursarai Panchayat", "Ranipur Handloom Grid"]
      },
      "Gautam Buddha Nagar": {
        "Noida Sector 62": ["Ward 1 - Sector 62 Hub", "Ward 4 - Mamura Village", "Ward 12 - Khoda Colony"]
      }
    },
    "Uttarakhand": {
      "Dehradun": {
        "Dehradun Municipal Corp": ["Ward 4 - Rajpur Road Area", "Ward 15 - Clement Town Sector", "Mussoorie Tourist Ward"],
        "Vikasnagar Block": ["Ward 2 - Vikasnagar Town", "Dakpathar Panchayat Grid", "Kalsi Tribal Block"]
      }
    },
    "West Bengal": {
      "Kolkata": {
        "KMC Central": ["Ward 63 - Park Street Area", "Ward 89 - Salt Lake Sector V", "Ward 110 - Garia Residential Sector"],
        "Rajarhat Block": ["Ward 3 - Newtown Tech Hub", "Rajarhat Gopalpur Area", "Bhangar Panchayat Grid"]
      }
    },
    "Andaman and Nicobar Islands": {
      "South Andaman": {
        "Port Blair Block": ["Ward 2 - Aberdeen Bazar Area", "Ward 8 - Dollygunj Industrial Area", "Garacharma Gram Panchayat"]
      }
    },
    "Chandigarh": {
      "Chandigarh District": {
        "Chandigarh Capital": ["Sector 17 Commercial Ward", "Sector 35 Residential Sector", "Sarangpur Village Grid"]
      }
    },
    "Dadra and Nagar Haveli and Daman and Diu": {
      "Dadra and Nagar Haveli": {
        "Silvassa Block": ["Ward 3 - Silvassa Industrial Area", "Masat Panchayat Area", "Rakholi Gram Panchayat"]
      }
    },
    "Delhi": {
      "New Delhi": {
        "NDMC Area": ["Ward 1 - Connaught Place Sector", "Ward 4 - Chanakyapuri Diplomatic Enclave", "Ward 8 - Khan Market Area"],
        "Dwarka Block": ["Ward 15 - Dwarka Sector 10 Area", "Ward 22 - Dwarka Sector 21 Sector", "Palam Gram Panchayat"]
      }
    },
    "Jammu and Kashmir": {
      "Srinagar": {
        "Srinagar Municipal Corp": ["Ward 3 - Lal Chowk Area", "Ward 9 - Dal Lake Boulevard", "Hazratbal Area Ward"],
        "Ganderbal Block": ["Ward 1 - Ganderbal Proper", "Kangan Mountain Sector", "Lar Panchayat Grid"]
      }
    },
    "Ladakh": {
      "Leh": {
        "Leh Town Council": ["Ward 2 - Leh Main Bazar Area", "Choglamsar Village Grid", "Shey Gram Panchayat"]
      }
    },
    "Lakshadweep": {
      "Kavaratti": {
        "Kavaratti Island": ["Ward 1 - Administrative Sector", "Ward 3 - Fishing Harbour Area", "Ward 5 - Beach Resort Grid"]
      }
    },
    "Puducherry": {
      "Pondicherry District": {
        "Pondicherry Municipal Area": ["Ward 3 - French Quarter Area", "Ward 8 - Heritage Sector", "Auroville Outer Border Grid"]
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
    selectedState: 'Andhra Pradesh',
    selectedDistrict: 'Visakhapatnam',
    selectedCity: 'Visakhapatnam Urban',
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
    this._initSettingsModal();
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

    // Try starting real SpeechRecognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        let langCode = 'en-IN';
        const stateToLang = {
          "Uttar Pradesh": "hi-IN", "Bihar": "hi-IN", "Madhya Pradesh": "hi-IN", "Rajasthan": "hi-IN", "Delhi": "hi-IN", "Haryana": "hi-IN", "Himachal Pradesh": "hi-IN", "Uttarakhand": "hi-IN", "Jharkhand": "hi-IN", "Chhattisgarh": "hi-IN",
          "Andhra Pradesh": "te-IN", "Telangana": "te-IN",
          "Tamil Nadu": "ta-IN", "Karnataka": "kn-IN", "Kerala": "ml-IN", "Maharashtra": "mr-IN", "Gujarat": "gu-IN", "West Bengal": "bn-IN", "Odisha": "or-IN", "Punjab": "pa-IN", "Assam": "as-IN"
        };
        if (stateToLang[this.state.selectedState]) {
          langCode = stateToLang[this.state.selectedState];
        }
        recognition.lang = langCode;

        this.state.transcriptChunks = [];
        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            this.state.transcriptChunks.push(finalTranscript);
            this._el.descriptionInput.value = this.state.transcriptChunks.join(' ');
            this.handleTextareaInput();
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
        };

        recognition.start();
        this.state.recognitionInstance = recognition;
      } catch (err) {
        console.warn("Could not start SpeechRecognition:", err);
      }
    }
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

    if (this.state.recognitionInstance) {
      try {
        this.state.recognitionInstance.stop();
      } catch (err) {
        console.warn("Could not stop recognition:", err);
      }
      this.state.recognitionInstance = null;
    }

    if (keepData) {
      this._showToast("Native voice signal captured. Ready to transcribe.");
      if (!this._el.descriptionInput.value.trim()) {
        this._el.descriptionInput.value = "మా గ్రామంలో తాగునీటి సమస్య ఉంది. పిల్లలు స్కూలుకు వెళ్ళలేకపోతున్నారు. ఎందుకంటే 8 కిలోమీటర్లు వెళ్లి నీళ్లు మోసుకురావాల్సి వస్తోంది.";
        this.handleTextareaInput();
      }
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

  async supportProposal(id) {
    const stringId = String(id);
    if (this.state.supportedProposals.has(stringId)) return;
    
    this.state.supportedProposals.add(stringId);
    const btn = document.getElementById(`support-btn-${id}`);
    const label = document.getElementById(`support-count-label-${id}`);

    if (btn && label) {
      btn.className = 'support-btn supported';
      btn.innerHTML = '✓ Supported!';
      
      const match = label.textContent.match(/\d+[\d,]*/);
      let count = 1;
      if (match) {
        count = parseInt(match[0].replace(/,/g, ''), 10) + 1;
        label.textContent = `👥 ${count.toLocaleString('en-IN')} citizens supporting`;
      }

      // 1. If it's a real database record, update it directly
      const isRealRecord = isNaN(id) || stringId.length > 5;
      if (isRealRecord) {
        try {
          await StorageEngine.update('citizenSignals', stringId, { supports: count });
          console.log(`Successfully incremented supports for signal ${stringId} to ${count}`);
        } catch (err) {
          console.warn("Could not update supports in Firestore:", err);
        }
      } else {
        // 2. If it's a mock proposal card, find matching live signals in the same location & category and increment them!
        try {
          const signals = await StorageEngine.getAll('citizenSignals');
          let matchedAny = false;
          
          let cardTheme = 'Water Infrastructure';
          const cardElement = document.getElementById(`prop-card-${id}`);
          if (cardElement) {
            const txt = cardElement.textContent.toLowerCase();
            if (txt.includes('health') || txt.includes('medical') || txt.includes('clinic')) {
              cardTheme = 'Healthcare Access';
            } else if (txt.includes('road') || txt.includes('street') || txt.includes('connectivity')) {
              cardTheme = 'Road Connectivity';
            } else if (txt.includes('energy') || txt.includes('solar') || txt.includes('electricity')) {
              cardTheme = 'Energy Access';
            } else if (txt.includes('civic') || txt.includes('sanitation') || txt.includes('waste')) {
              cardTheme = 'Civic Facilities';
            }
          }

          for (const sig of signals) {
            const sigTheme = sig.theme || sig.category || 'Other';
            if (sigTheme.toLowerCase().includes(cardTheme.toLowerCase().split(' ')[0])) {
              const currentSupports = sig.supports || 1;
              await StorageEngine.update('citizenSignals', sig.id, { supports: currentSupports + 1 });
              matchedAny = true;
              console.log(`Successfully boosted live signal ${sig.id} (${sigTheme}) supports to ${currentSupports + 1}`);
            }
          }

          if (!matchedAny && signals.length > 0) {
            const sig = signals[0];
            const currentSupports = sig.supports || 1;
            await StorageEngine.update('citizenSignals', sig.id, { supports: currentSupports + 1 });
            console.log(`No exact category match, boosted first signal ${sig.id} supports to ${currentSupports + 1}`);
          }
        } catch (err) {
          console.warn("Error running support boost on citizenSignals:", err);
        }
      }

      this._showToast("Thank you! Your support vote has been registered in the live database.");
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
  }
};

// Expose globally so that inline events find it perfectly
window.JanVikasCitizen = JanVikasCitizen;

// Start portal on page load
document.addEventListener('DOMContentLoaded', () => {
  JanVikasCitizen.init();
});
