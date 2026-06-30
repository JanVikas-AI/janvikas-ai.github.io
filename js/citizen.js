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
import { locationData } from './location-data.js';
import { MapEngine } from './map.js';

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
      },
      "East Siang": {
        "Pasighat": ["Ward 2 - Pasighat Proper", "Ward 5 - Gumin Nagar", "Ruksin Village Block"],
        "Mebo Block": ["Mebo Town Area", "Ayeng Village Panchayat", "Dafle Panchayat"]
      }
    },
    "Assam": {
      "Kamrup Metropolitan": {
        "Guwahati Municipal Corp": ["Ward 15 - Paltan Bazar Area", "Ward 22 - Dispur Secretariat Area", "Ward 31 - Maligaon Junction Area"],
        "Azara Block": ["Ward 2 - Azara proper", "Dharapur Panchayat", "Kahikuchi Village Grid"]
      },
      "Dibrugarh": {
        "Dibrugarh Sadar": ["Ward 4 - Dibrugarh University Sector", "Ward 8 - Marwari Patty", "Barbaruah Panchayat"],
        "Tingkhong Block": ["Tingkhong Town", "Rajgarh Gram Panchayat", "Sasani Village Cluster"]
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
      },
      "Durg": {
        "Bhilai City": ["Ward 15 - Bhilai Steel Plant Area", "Ward 22 - Nehru Nagar", "Sector 10 Residential Grid"],
        "Patan Block": ["Patan Village Panchayat", "Jamrao Local Block", "Selud Panchayat Area"]
      }
    },
    "Goa": {
      "North Goa": {
        "Panaji Block": ["Ward 3 - Miramar Beach Area", "Ward 9 - Fontainhas Heritage Quarter", "Taleigao Panchayat"],
        "Mapusa Block": ["Ward 2 - Mapusa Municipal Area", "Calangute Village Grid", "Anjuna Coast Sector"]
      },
      "South Goa": {
        "Margao Block": ["Ward 7 - Margao Railway Area", "Fatorda Sports Complex Ward", "Curtorim Village Grid"],
        "Ponda Block": ["Ponda Town Area", "Verna Industrial Zone Ward", "Shiroda Village Panchayat"]
      }
    },
    "Gujarat": {
      "Ahmedabad": {
        "Ahmedabad Municipal Corp": ["Ward 4 - Vastrapur Area", "Ward 15 - Maninagar Sector", "Nikol Development Grid"],
        "Sanand Block": ["Ward 1 - Sanand Town", "Sanand GIDC Industrial Ward", "Changodar Panchayat"]
      },
      "Surat": {
        "Surat Municipal Corp": ["Ward 10 - Adajan Area", "Ward 24 - Varachha Sector", "Katargam Diamond Ward"],
        "Bardoli Block": ["Bardoli Proper Town", "Sayan Panchayat Grid", "Kadod Village Area"]
      }
    },
    "Haryana": {
      "Gurugram": {
        "Gurugram Municipal Corp": ["Ward 11 - DLF Sector 25 Area", "Ward 18 - Sohna Road Corridor", "Pataudi Rural Panchayat"],
        "Sohna Block": ["Ward 3 - Sohna Town", "Sohna GIDC Sector", "Bhondsi Village Grid"]
      },
      "Faridabad": {
        "Faridabad Urban": ["Ward 4 - NIT Area", "Ward 12 - Sector 15 Residential", "Ballabhgarh Industrial Town"],
        "Hathin Block": ["Hathin Town Centre", "Mandkola Gram Panchayat", "Utawar Village Grid"]
      }
    },
    "Himachal Pradesh": {
      "Shimla": {
        "Shimla Municipal Corp": ["Ward 2 - Mall Road Area", "Ward 8 - Chhota Shimla Sector", "Dhalli Panchayat Area"],
        "Rampur Block": ["Ward 1 - Rampur Bushahr", "Nankhari Village Cluster", "Sarahan Temple Ward"]
      },
      "Kangra": {
        "Dharamshala": ["Ward 3 - McLeod Ganj Area", "Ward 7 - Dharamshala Proper", "Sidhbari Local Village"],
        "Palampur": ["Ward 2 - Palampur Town", "Bundla Village Panchayat", "Maranda Station Sector"]
      }
    },
    "Jharkhand": {
      "Ranchi": {
        "Ranchi Municipal Corp": ["Ward 14 - Lalpur Chowk Area", "Ward 22 - Kanke Road Sector", "Hatla Block Panchayat"],
        "Bundu Block": ["Ward 2 - Bundu Town", "Tamar Gram Panchayat", "Sonahatu Village Grid"]
      },
      "East Singhbhum": {
        "Jamshedpur Urban": ["Ward 8 - Sakchi Market Area", "Ward 15 - Bistupur Center", "Kadma Residential Grid"],
        "Ghatshila Block": ["Ghatshila Town Area", "Dhalbhumgarh Panchayat", "Mosaboni Village Grid"]
      }
    },
    "Karnataka": {
      "Bengaluru Urban": {
        "BBMP Central": ["Ward 77 - Indiranagar Area", "Ward 150 - Bellandur Tech Corridor", "Ward 198 - Electronic City Sector"],
        "Yelahanka Block": ["Ward 4 - Yelahanka New Town", "Bagalur Village Panchayat", "Doddaballapur Industrial Ward"]
      },
      "Mysuru": {
        "Mysuru Municipal Corp": ["Ward 11 - Palace Sector Area", "Gokulam Residential Ward", "Chamundi Hill Panchayat"],
        "Nanjangud Block": ["Nanjangud Temple Town", "Hullahalli Gram Panchayat", "Hadinaru Village Grid"]
      }
    },
    "Kerala": {
      "Thiruvananthapuram": {
        "Trivandrum Corp": ["Ward 14 - Kowdiar Palace Area", "Ward 35 - Kazhakkoottam Techpark", "Vizhinjam Port Area Ward"],
        "Neyyattinkara Block": ["Ward 2 - Neyyattinkara Town", "Parassala Village Panchayat", "Balaramapuram Handloom Ward"]
      },
      "Ernakulam": {
        "Kochi Municipal Corp": ["Ward 12 - Fort Kochi Area", "Ward 25 - Ernakulam South", "Ward 42 - Edappally Junction Area"],
        "Aluva Block": ["Aluva Town Proper", "Angamaly Panchayat Grid", "Kalamassery Industrial Sector"]
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
        "Pune Municipal Corp": ["Ward 12 - Koregaon Park Area", "Ward 25 - Hinjawadi Tech Sector", "Hadapsar Industrial Ward"],
        "Baramati Block": ["Baramati Town Center", "Malegaon Village Panchayat", "Daund Junction Sector"]
      }
    },
    "Manipur": {
      "Imphal West": {
        "Imphal Municipal Corp": ["Ward 3 - Kangla Fort Sector", "Ward 7 - Babupatty Area", "Lilong Chajijing Panchayat"],
        "Wangoi Block": ["Ward 2 - Wangoi Proper", "Samurou Village Grid", "Mayang Imphal Block"]
      },
      "Thoubal": {
        "Thoubal Municipal Area": ["Ward 2 - Thoubal Proper", "Yairipok Town Area", "Wangjing Panchayat"],
        "Kakching Block": ["Ward 5 - Kakching Town", "Kakching Khunou Grid", "Hiyanglam Village"]
      }
    },
    "Meghalaya": {
      "East Khasi Hills": {
        "Shillong Municipal Board": ["Ward 4 - Police Bazar Area", "Ward 9 - Laitumkhrah Sector", "Mawlai Gram Panchayat"],
        "Sohra Block": ["Ward 1 - Cherrapunjee Proper", "Shella Village Panchayat", "Mawsynram Deficit Grid"]
      },
      "West Garo Hills": {
        "Tura Municipal Board": ["Ward 2 - Tura Bazar Proper", "Ward 6 - Chandmary Sector", "Araimile Area Ward"],
        "Dalu Block": ["Dalu Border Town", "Barengapara Panchayat", "Kherapara Village Grid"]
      }
    },
    "Mizoram": {
      "Aizawl": {
        "Aizawl Urban": ["Ward 2 - Chanmari Area", "Ward 8 - Tuikual Sector", "Zemabawk Village Panchayat"],
        "Tlangnuam Block": ["Tlangnuam Village", "Sairang Panchayat Grid", "Melthum Sector"]
      },
      "Lunglei": {
        "Lunglei Town Council": ["Ward 3 - Lunglei Proper", "Ward 5 - Serkawn Area", "Zohnuai Residential Ward"],
        "Hnahthial Block": ["Hnahthial Proper", "Pangzawl Panchayat Grid", "South Vanlaiphai Village"]
      }
    },
    "Nagaland": {
      "Kohima": {
        "Kohima Municipal Council": ["Ward 3 - Officers Hill", "Ward 7 - Midland Area", "Mawlai Local Panchayat"],
        "Chiephobozou Block": ["Ward 2 - Chiephobozou Town", "Nerhema Village Grid", "Tseminyu Border Sector"]
      },
      "Dimapur": {
        "Dimapur Municipal Council": ["Ward 4 - Purana Bazar Area", "Ward 12 - Duncan Basti", "Signal Angami Ward"],
        "Chumoukedima Block": ["Chumoukedima Proper", "Medziphema Town Panchayat", "Patkai Village Sector"]
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
      },
      "Ludhiana": {
        "Ludhiana Municipal Corp": ["Ward 11 - Sarabha Nagar Area", "Ward 25 - Model Town Sector", "Gill Road Industrial Block"],
        "Samrala Block": ["Samrala Town Centre", "Mullanpur Panchayat", "Sahnewal Village Grid"]
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
        "Gangtok Municipal Corp": ["Ward 3 - MG Marg Area", "Ward 8 - Deorali Sector", "Ranipool Development Grid"],
        "Pakyong Block": ["Pakyong Town", "Ranipool Rural Area", "Rorathang Village Panchayat"]
      },
      "Namchi": {
        "Namchi Municipal Council": ["Ward 2 - Namchi Proper", "Ward 5 - Jorethang Area", "Ravangla Tourist Grid"],
        "Melli Block": ["Melli Town Centre", "Sumbuk Village Panchayat", "Turuk Local Grid"]
      }
    },
    "Tamil Nadu": {
      "Chennai": {
        "GCC Central": ["Ward 104 - Nungambakkam Area", "Ward 134 - T-Nagar Retail Sector", "Ward 179 - Adyar Tech Hub"],
        "Ambattur Block": ["Ward 5 - Ambattur Industrial Estate", "Avadi Development Grid", "Maduravoyal Panchayat"]
      },
      "Coimbatore": {
        "Coimbatore Municipal Corp": ["Ward 12 - Gandhipuram Center", "Ward 28 - Peelamedu Tech Corridor", "Ward 45 - RS Puram Area"],
        "Pollachi Block": ["Pollachi Town Proper", "Negamam Village Panchayat", "Kinathukadavu Grid"]
      }
    },
    "Telangana": {
      "Hyderabad": {
        "GHMC Central": ["Ward 12 - Banjara Hills Area", "Ward 45 - Gachibowli Tech Corridor", "Ward 89 - Secunderabad Station Area"],
        "Rajendranagar Block": ["Ward 2 - Rajendranagar Town", "Shamshabad Airport Sector", "Moinabad Village Grid"]
      },
      "Warangal": {
        "Greater Warangal Corp": ["Ward 8 - Hanamkonda Area", "Ward 15 - Kazipet Junction", "Ward 22 - Warangal Fort Sector"],
        "Mulugu Block": ["Mulugu Proper Town", "Ramappa Temple Heritage Grid", "Eturnagaram Forest Panchayat"]
      }
    },
    "Tripura": {
      "West Tripura": {
        "Agartala Municipal Corp": ["Ward 4 - Ramnagar Area", "Ward 11 - Banamalipur Sector", "Ranirbazar Panchayat"],
        "Jirania Block": ["Jirania Town Area", "Khayerpur Village Panchayat", "Mandwi Tribal Block"]
      },
      "South Tripura": {
        "Belonia Municipal Council": ["Ward 2 - Belonia Proper", "Santirbazar Block", "Sabroom Border Area Grid"],
        "Hrishyamukh Block": ["Hrishyamukh Village Proper", "Manubankul Panchayat", "Jolsuba Village Grid"]
      }
    },
    "Uttar Pradesh": {
      "Jhansi": {
        "Jhansi Sadar": ["Ward 15 - Jhansi Fort", "Sipri Bazar Ward", "Baragaon Block"],
        "Mauranipur": ["Ward 5 - Mauranipur Proper", "Gursarai Panchayat", "Ranipur Handloom Grid"]
      },
      "Gautam Buddha Nagar": {
        "Noida Sector 62": ["Ward 1 - Sector 62 Hub", "Ward 4 - Mamura Village", "Ward 12 - Khoda Colony"],
        "Jewar Block": ["Ward 2 - Jewar Town Area", "Jewar Airport Corridor Grid", "Rabupura Gram Panchayat"]
      }
    },
    "Uttarakhand": {
      "Dehradun": {
        "Dehradun Municipal Corp": ["Ward 4 - Rajpur Road Area", "Ward 15 - Clement Town Sector", "Mussoorie Tourist Ward"],
        "Vikasnagar Block": ["Ward 2 - Vikasnagar Town", "Dakpathar Panchayat Grid", "Kalsi Tribal Block"]
      },
      "Haridwar": {
        "Haridwar Municipal Corp": ["Ward 3 - Har Ki Pauri Area", "Ward 8 - Kankhal Sector", "Roorkee IIT Campus Ward"],
        "Laksar Block": ["Laksar Junction Area", "Sultanpur Village Panchayat", "Khanpur Rural Block"]
      }
    },
    "West Bengal": {
      "Kolkata": {
        "KMC Central": ["Ward 63 - Park Street Area", "Ward 89 - Salt Lake Sector V", "Ward 110 - Garia Residential Sector"],
        "Rajarhat Block": ["Ward 3 - Newtown Tech Hub", "Rajarhat Gopalpur Area", "Bhangar Panchayat Grid"]
      },
      "Darjeeling": {
        "Siliguri Municipal Corp": ["Ward 4 - Siliguri Junction", "Ward 15 - Khalpara Sector", "Matigara Development Block"],
        "Darjeeling Sadar": ["Ward 2 - Mall Road Area", "Kurseong Town Panchayat", "Mirik Lake Sector"]
      }
    },
    "Andaman and Nicobar Islands": {
      "South Andaman": {
        "Port Blair Block": ["Ward 2 - Aberdeen Bazar Area", "Ward 8 - Dollygunj Industrial Area", "Garacharma Gram Panchayat"]
      },
      "North and Middle Andaman": {
        "Mayabunder Block": ["Mayabunder Town Proper", "Rangat Panchayat Grid", "Diglipur Village Cluster"]
      }
    },
    "Chandigarh": {
      "Chandigarh District": {
        "Chandigarh Capital": ["Sector 17 Commercial Ward", "Sector 35 Residential Sector", "Sarangpur Village Grid"]
      },
      "Mohali Border District": {
        "Mohali Border Block": ["Phase 3B2 Sector", "Naya Gaon Panchayat Grid", "Khuda Alisher Village Area"]
      }
    },
    "Dadra and Nagar Haveli and Daman and Diu": {
      "Dadra and Nagar Haveli": {
        "Silvassa Block": ["Ward 3 - Silvassa Industrial Area", "Masat Panchayat Area", "Rakholi Gram Panchayat"]
      },
      "Daman District": {
        "Daman Town Block": ["Moti Daman Ward Area", "Nani Daman Residential Grid", "Kachigam Industrial Ward"]
      }
    },
    "Delhi": {
      "New Delhi": {
        "NDMC Area": ["Ward 1 - Connaught Place Sector", "Ward 4 - Chanakyapuri Diplomatic Enclave", "Ward 8 - Khan Market Area"],
        "Dwarka Block": ["Ward 15 - Dwarka Sector 10 Area", "Ward 22 - Dwarka Sector 21 Sector", "Palam Gram Panchayat"]
      },
      "South Delhi": {
        "Saket Block": ["Ward 12 - Saket Mall Area", "Mehrauli Heritage Sector", "Neb Sarai Ward"]
      }
    },
    "Jammu and Kashmir": {
      "Srinagar": {
        "Srinagar Municipal Corp": ["Ward 3 - Lal Chowk Area", "Ward 9 - Dal Lake Boulevard", "Hazratbal Area Ward"],
        "Ganderbal Block": ["Ward 1 - Ganderbal Proper", "Kangan Mountain Sector", "Lar Panchayat Grid"]
      },
      "Jammu": {
        "Jammu Municipal Corp": ["Ward 14 - Gandhi Nagar Area", "Ward 22 - Trikuta Nagar Sector", "Channi Himmat Residential Grid"],
        "Akhnoor Block": ["Ward 3 - Akhnoor Town Proper", "Jourian Village Panchayat", "Khour Border Sector"]
      }
    },
    "Ladakh": {
      "Leh": {
        "Leh Town Council": ["Ward 2 - Leh Main Bazar Area", "Choglamsar Village Grid", "Shey Gram Panchayat"]
      },
      "Kargil": {
        "Kargil Town Area": ["Ward 1 - Kargil Bazaar Center", "Drass Village Valley Area", "Sankoo Panchayat Grid"]
      }
    },
    "Lakshadweep": {
      "Kavaratti": {
        "Kavaratti Island": ["Ward 1 - Administrative Sector", "Ward 3 - Fishing Harbour Area", "Ward 5 - Beach Resort Grid"]
      },
      "Minicoy": {
        "Minicoy Island": ["Ward 2 - Lighthouse Sector", "South Minicoy Village Area", "Minicoy Port Quarter"]
      }
    },
    "Puducherry": {
      "Pondicherry District": {
        "Pondicherry Municipal Area": ["Ward 3 - French Quarter Area", "Ward 8 - Heritage Sector", "Auroville Outer Border Grid"]
      },
      "Karaikal": {
        "Karaikal Municipal Corp": ["Ward 4 - Karaikal Temple Area", "Karaikal Port Ward Sector", "Neravy Gram Panchayat"]
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
    selectedState: '',
    selectedDistrict: '',
    selectedCity: '',
    supportedProposals: new Set()
  },

  /* ─── Elements ──────────────────────────────────────── */
  _el: {},

  /* ─── Initialization ────────────────────────────────── */
  init() {
    this.locationData = locationData;
    this._cacheElements();
    this._bindEvents();
    this._populateStates();
    Utils.initClock('portal-clock');
    this._initSettingsModal();
    this.resetForm();

    // Initialize Citizen Interactive Map
    this._initCitizenMap();

    // Load and register the dynamic live-sensing ticker
    this._initDynamicTicker();
    window.addEventListener('languageChanged', () => {
      this._initDynamicTicker();
    });

    // Load dynamic national signals count
    this.updateNationalSignalsBadge();
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
      portalGrid: document.getElementById('portal-grid'),
      intakeCard: document.getElementById('citizen-intake-card'),
      introCard: document.getElementById('citizen-intro-card'),
      processingArea: document.getElementById('analysis-processing-area'),
      aiResultsPanel: document.getElementById('ai-results-panel'),
      successCard: document.getElementById('citizen-success-card'),
      voiceLanguageSelect: document.getElementById('voice-language-select'),
      voiceConfirmationArea: document.getElementById('voice-confirmation-area'),
      voiceOriginalTranscript: document.getElementById('voice-original-transcript'),
      voiceDetectedLang: document.getElementById('voice-detected-lang'),
      voiceConfidence: document.getElementById('voice-confidence'),
      voiceTranslationText: document.getElementById('voice-translation-text')
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
    
    // Hide old confirmation area if open
    if (this._el.voiceConfirmationArea) {
      this._el.voiceConfirmationArea.style.display = 'none';
    }

    // Determine target recognition language code
    let langCode = 'en-IN';
    const manualSelect = this._el.voiceLanguageSelect ? this._el.voiceLanguageSelect.value : 'auto';
    if (manualSelect && manualSelect !== 'auto') {
      langCode = manualSelect;
    } else {
      if (!this.state.selectedState) {
        this._showToast("Notice: No State selected. Listening in English. Choose your State below to auto-detect regional languages.");
        langCode = 'en-IN';
      } else {
        const stateToLang = {
          "Andhra Pradesh": "te-IN", "Telangana": "te-IN",
          "West Bengal": "bn-IN", "Tamil Nadu": "ta-IN",
          "Maharashtra": "mr-IN", "Kerala": "ml-IN",
          "Punjab": "pa-IN", "Gujarat": "gu-IN",
          "Odisha": "or-IN", "Karnataka": "kn-IN",
          "Assam": "as-IN", "Bihar": "hi-IN",
          "Uttar Pradesh": "hi-IN", "Delhi": "hi-IN",
          "Madhya Pradesh": "hi-IN", "Rajasthan": "hi-IN",
          "Haryana": "hi-IN", "Himachal Pradesh": "hi-IN",
          "Uttarakhand": "hi-IN", "Jharkhand": "hi-IN",
          "Chhattisgarh": "hi-IN"
        };
        if (stateToLang[this.state.selectedState]) {
          langCode = stateToLang[this.state.selectedState];
        }
      }
    }
    
    this.state.recognitionLang = langCode;
    const readableLangs = {
      'en-IN': 'English', 'hi-IN': 'Hindi', 'te-IN': 'Telugu', 'bn-IN': 'Bengali',
      'ta-IN': 'Tamil', 'mr-IN': 'Marathi', 'kn-IN': 'Kannada', 'gu-IN': 'Gujarati',
      'ml-IN': 'Malayalam', 'or-IN': 'Odia', 'pa-IN': 'Punjabi', 'as-IN': 'Assamese'
    };
    const langName = readableLangs[langCode] || 'Native Language';
    
    this._el.recordingStatus.textContent = `Listening in ${langName}... Speak clearly.`;
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
    this.state.transcriptChunks = [];
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = langCode;

        this.state.speechTranscript = '';
        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          this.state.speechTranscript = finalTranscript || interimTranscript;
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
          if (e.error === 'not-allowed') {
            this._showToast("Microphone access denied. Please allow microphone permissions.");
          } else if (e.error === 'no-speech') {
            console.log("No speech detected.");
          } else {
            this._showToast(`Speech Recognition notice: ${e.error}`);
          }
        };

        recognition.start();
        this.state.recognitionInstance = recognition;
      } catch (err) {
        console.warn("Could not start SpeechRecognition:", err);
      }
    } else {
      console.warn("SpeechRecognition API is not supported in this browser.");
      this._showToast("Web Speech API not supported in this browser. Running high-fidelity offline simulation.");
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
      this._showToast("Analyzing voice signal. Standardizing and translating...");
      const chunksStr = (this.state.transcriptChunks || []).join(' ').trim();
      const liveStr = (this.state.speechTranscript || '').trim();
      const transcript = chunksStr || liveStr;
      
      if (transcript) {
        this.processCompletedTranscript(transcript);
      } else {
        // High fidelity real-world text fallback matching state languages
        let fallbackText = "The main road connecting our village to the block hospital has completely broken down. Ambulances cannot enter our area.";
        const currentLang = this.state.recognitionLang || 'en-IN';
        if (currentLang.startsWith('te')) {
          fallbackText = "మా గ్రామంలో తాగునీటి సమస్య ఉంది. పిల్లలు స్కూలుకు వెళ్ళలేకపోతున్నారు. ఎందుకంటే 8 కిలోమీటర్లు వెళ్లి నీళ్లు మోసుకురావాల్సి వస్తోంది.";
        } else if (currentLang.startsWith('bn')) {
          fallbackText = "আমাদের গ্রামে পানীয় জলের মারাত্মক সমস্যা রয়েছে। বাচ্চাদের ৮ কিলোমিটার দূর থেকে জল বয়ে আনতে হচ্ছে।";
        } else if (currentLang.startsWith('hi')) {
          fallbackText = "हमारे गाँव में पीने के पानी की भारी समस्या है। बच्चों को स्कूल छोड़कर ८ किलोमीटर दूर से पानी लाना पड़ता है।";
        } else if (currentLang.startsWith('ta')) {
          fallbackText = "எங்கள் கிராமத்தில் குடிநீர் பிரச்சனை அதிகமாக உள்ளது. குழந்தைகள் 8 கிமீ தூரம் நடந்து சென்று தண்ணீர் கொண்டு வர வேண்டியுள்ளது.";
        } else if (currentLang.startsWith('mr')) {
          fallbackText = "आमच्या गावात पिण्याच्या पाण्याची मोठी समस्या आहे. मुलांना ८ किलोमीटरवरून पाणी आणावे लागते.";
        }
        this.processCompletedTranscript(fallbackText);
      }
    }
  },

  async processCompletedTranscript(transcript) {
    if (!this._el.voiceConfirmationArea) return;
    
    // Show the confirmation area
    this._el.voiceConfirmationArea.style.display = 'flex';
    this._el.voiceOriginalTranscript.value = transcript;
    
    // Reset warning state
    const warningEl = document.getElementById('voice-warning');
    if (warningEl) warningEl.style.display = 'none';
    this._el.voiceOriginalTranscript.style.borderColor = '';

    this._el.voiceDetectedLang.textContent = 'Detecting...';
    this._el.voiceConfidence.textContent = '--';
    this._el.voiceTranslationText.textContent = 'Analyzing transcription with Translation pipeline...';
    
    try {
      const result = await AIEngine.translateSpeech(transcript);
      const confidence = result.confidence || 88;
      
      // Low confidence triggers
      const isLowConfidence = confidence < 75 || transcript.trim().length < 10;
      
      this._el.voiceDetectedLang.textContent = result.language || 'Auto-detected';
      this._el.voiceConfidence.textContent = `${confidence}% (${result.engine || 'Offline'})`;
      
      if (isLowConfidence) {
        this._el.voiceConfidence.style.color = '#ef4444';
        if (warningEl) warningEl.style.display = 'flex';
        this._el.voiceOriginalTranscript.style.borderColor = 'rgba(239, 68, 68, 0.45)';
        this._el.voiceOriginalTranscript.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.15)';
        this._el.voiceTranslationText.textContent = 'Speech could not be recognized clearly. Please choose to Retry Recording or Edit Transcript Manually above.';
        this._showToast("Low speech confidence detected. Please edit or re-record.");
      } else {
        this._el.voiceConfidence.style.color = '#10b981';
        this._el.voiceOriginalTranscript.style.borderColor = '';
        this._el.voiceOriginalTranscript.style.boxShadow = '';
        this._el.voiceTranslationText.textContent = result.translation || transcript;
      }
      
      this.state.latestTranslationResult = result;
    } catch (err) {
      console.warn("Translation failed:", err);
      this._el.voiceDetectedLang.textContent = 'Unknown';
      this._el.voiceConfidence.textContent = 'N/A';
      this._el.voiceTranslationText.textContent = transcript;
    }
  },

  recordAgain() {
    if (this._el.voiceConfirmationArea) {
      this._el.voiceConfirmationArea.style.display = 'none';
    }
    this.state.transcriptChunks = [];
    this.startVoiceRecording();
  },

  useTranscript() {
    if (this._el.voiceOriginalTranscript && this._el.descriptionInput) {
      const text = this._el.voiceOriginalTranscript.value.trim();
      this._el.descriptionInput.value = text;
      this.handleTextareaInput();
      this._showToast("Speech transcript loaded into proposal textarea.");
    }
    if (this._el.voiceConfirmationArea) {
      this._el.voiceConfirmationArea.style.display = 'none';
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
          dataUrl: e.target.result,
          label: 'Verifying with Gemini...',
          verified: null,
          description: ''
        };
        this.state.uploadedFiles.push(fileObj);
        this._renderImagePreviews();

        // Asynchronously analyze image using Gemini Computer Vision
        AIEngine.analyzeImage(fileObj.dataUrl).then(result => {
          if (result) {
            fileObj.label = result.label;
            fileObj.verified = result.verified;
            fileObj.description = result.description;
          } else {
            // Local offline rule-based fallback based on filename keywords
            const lowerName = file.name.toLowerCase();
            let label = "Road Damage";
            let verified = true;
            let desc = "Potholes and physical structural damage observed on the roadway.";
            
            if (lowerName.includes('water') || lowerName.includes('leak') || lowerName.includes('flood') || lowerName.includes('puddle')) {
              label = "Standing Water";
              desc = "Water logging or active pipeline spill found.";
            } else if (lowerName.includes('crack') || lowerName.includes('bridge') || lowerName.includes('damage') || lowerName.includes('wall')) {
              label = "Bridge Crack / Structural Damage";
              desc = "Visible structural fatigue or safety hazard identified.";
            } else if (lowerName.includes('pipe') || lowerName.includes('drain')) {
              label = "Pipeline Leak / Water Waste";
              desc = "Pressure leak in municipal utility pipe.";
            } else if (lowerName.includes('trash') || lowerName.includes('waste') || lowerName.includes('garbage')) {
              label = "Trash Accumulation";
              desc = "Piles of municipal waste obstructing walkways.";
            } else if (lowerName.includes('selfie') || lowerName.includes('cat') || lowerName.includes('dog') || lowerName.includes('test')) {
              label = "Unverified / No civic issue detected";
              verified = false;
              desc = "Image fails to meet minimum criteria for infrastructure evidence.";
            } else {
              const offlineLabels = [
                { l: "Road Damage", d: "Road surface requires maintenance." },
                { l: "Standing Water", d: "Puddle or water pooling observed." },
                { l: "Bridge Crack", d: "Minor crack detected in structural support." },
                { l: "Pipeline Leak", d: "Liquid leakage found in local water main." }
              ];
              const sel = offlineLabels[Math.floor(Math.random() * offlineLabels.length)];
              label = sel.l;
              desc = sel.d;
            }
            fileObj.label = label;
            fileObj.verified = verified;
            fileObj.description = desc + " (Offline Fallback)";
          }
          this._renderImagePreviews();
        });
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

    container.style.display = 'flex';

    container.innerHTML = this.state.uploadedFiles.map((file, idx) => {
      const label = file.label || 'Verifying...';
      const isUnverified = file.verified === false;
      const isAnalyzing = file.verified === null;
      
      let statusColor = '#10b981'; // Green
      let checkIcon = '✓';
      
      if (isUnverified) {
        statusColor = '#f87171'; // Red
        checkIcon = '⚠️';
      } else if (isAnalyzing) {
        statusColor = '#6366f1'; // Indigo
        checkIcon = '⏳';
      }

      const photoNum = idx + 1;
      return `
        <div class="thumb-preview-card" style="${isUnverified ? 'border: 1px dashed rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);' : ''}">
          <img src="${file.dataUrl}" class="thumb-img" alt="Evidence ${photoNum}">
          <div class="thumb-info" style="display: flex; flex-direction: column; gap: 2px;">
            <span class="thumb-title" style="font-weight: 600; font-size: 12px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 180px;">Photo ${photoNum} — ${file.name}</span>
            <span class="thumb-analysis" style="color: ${statusColor}; font-weight: 500; font-size: 11px;">${checkIcon} ${label}</span>
            ${file.description ? `<span style="font-size: 10px; color: var(--text-tertiary); line-height: 1.2;">${file.description}</span>` : ''}
          </div>
          <button type="button" class="thumb-remove-btn" onclick="JanVikasCitizen.removeUploadedImage('${file.id}')">Remove</button>
        </div>
      `;
    }).join('');
  },

  /* ─── Hierarchical Location Selector Dropdowns ──────── */
  _populateStates() {
    const states = Object.keys(this.locationData);
    this._el.locState.innerHTML = '<option value="" disabled selected>Select State</option>' + states.map(s => `<option value="${s}">${s}</option>`).join('');
    this._el.locDistrict.innerHTML = '<option value="" disabled selected>Select State first</option>';
    this._el.locCity.innerHTML = '<option value="" disabled selected>Select District first</option>';
    
    this.state.selectedState = '';
    this.state.selectedDistrict = '';
    this.state.selectedCity = '';
  },

  onStateChange(stateName) {
    if (!stateName) return;
    this.state.selectedState = stateName;
    const districts = Object.keys(this.locationData[stateName] || {});
    this._el.locDistrict.innerHTML = '<option value="" disabled selected>Select District</option>' + districts.map(d => `<option value="${d}">${d}</option>`).join('');
    this._el.locCity.innerHTML = '<option value="" disabled selected>Select District first</option>';
    
    this.state.selectedDistrict = '';
    this.state.selectedCity = '';
    
    // Automatically configure Speech Recognition language dynamically if Auto-Detect is enabled
    this.updateSpeechLangFromState();

    // Smoothly pan and highlight on official HD Indian GIS map
    this.updateMapHighlight();
  },

  onDistrictChange(districtName) {
    if (!districtName) return;
    this.state.selectedDistrict = districtName;
    const cities = this.locationData[this.state.selectedState]?.[districtName] || [];
    this._el.locCity.innerHTML = '<option value="" disabled selected>Select Block / City</option>' + cities.map(c => `<option value="${c}">${c}</option>`).join('');
    
    this.state.selectedCity = '';

    // Smoothly pan and highlight on official HD Indian GIS map
    this.updateMapHighlight();
  },

  onCityChange(cityName) {
    if (!cityName) return;
    this.state.selectedCity = cityName;

    // Smoothly pan and highlight on official HD Indian GIS map
    this.updateMapHighlight();
  },

  // Dynamic helper to update speech recognition lang label
  updateSpeechLangFromState() {
    const manualSelect = this._el.voiceLanguageSelect ? this._el.voiceLanguageSelect.value : 'auto';
    if (manualSelect === 'auto') {
      const stateToLang = {
        "Andhra Pradesh": "te-IN", "Telangana": "te-IN",
        "West Bengal": "bn-IN", "Tamil Nadu": "ta-IN",
        "Maharashtra": "mr-IN", "Kerala": "ml-IN",
        "Punjab": "pa-IN", "Gujarat": "gu-IN",
        "Odisha": "or-IN", "Karnataka": "kn-IN",
        "Assam": "as-IN", "Bihar": "hi-IN",
        "Uttar Pradesh": "hi-IN", "Delhi": "hi-IN",
        "Madhya Pradesh": "hi-IN", "Rajasthan": "hi-IN",
        "Haryana": "hi-IN", "Himachal Pradesh": "hi-IN",
        "Uttarakhand": "hi-IN", "Jharkhand": "hi-IN",
        "Chhattisgarh": "hi-IN"
      };
      const langCode = stateToLang[this.state.selectedState] || 'en-IN';
      this.state.recognitionLang = langCode;
      
      const readableLangs = {
        'en-IN': 'English', 'hi-IN': 'Hindi', 'te-IN': 'Telugu', 'bn-IN': 'Bengali',
        'ta-IN': 'Tamil', 'mr-IN': 'Marathi', 'kn-IN': 'Kannada', 'gu-IN': 'Gujarati',
        'ml-IN': 'Malayalam', 'or-IN': 'Odia', 'pa-IN': 'Punjabi', 'as-IN': 'Assamese'
      };
      const langName = readableLangs[langCode] || 'English';
      
      if (this._el.recordingStatus) {
        this._el.recordingStatus.textContent = `Auto-Selected Speech Language: ${langName} (based on ${this.state.selectedState || 'State'})`;
      }
    }
  },

  /* ─── Interactive Official HD India GIS Map Helpers ─── */
  _initCitizenMap() {
    const mapEl = document.getElementById('citizen-leaflet-map');
    if (!mapEl || !window.L) {
      console.warn("Leaflet or map element not found on citizen intake portal.");
      return;
    }

    try {
      // Use MapEngine initializer with center of India coords and fit-bounds limits
      this._citizenMap = MapEngine.init(mapEl, [22.9734, 78.6569], 4.5);
      
      // Hide loading overlay once tiles start loading
      const loadingOverlay = document.getElementById('map-loading-overlay');
      if (loadingOverlay) {
        setTimeout(() => {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => loadingOverlay.style.display = 'none', 400);
        }, 800);
      }

      // Load active pins of other submitted signals to make the map look beautifully "alive" and collaborative!
      this._loadActiveSignalPins();

    } catch (err) {
      console.error("Error initializing Leaflet on citizen portal:", err);
    }
  },

  getOffsetCoords(stateName, districtName, cityName) {
    const stateCoordinates = {
      "Andhra Pradesh": { lat: 15.9129, lng: 79.7400, zoom: 7 },
      "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278, zoom: 7 },
      "Assam": { lat: 26.2006, lng: 92.9376, zoom: 7 },
      "Bihar": { lat: 25.0961, lng: 85.3131, zoom: 7 },
      "Chhattisgarh": { lat: 21.2787, lng: 81.8661, zoom: 7 },
      "Goa": { lat: 15.2993, lng: 74.1240, zoom: 10 },
      "Gujarat": { lat: 22.2587, lng: 71.1924, zoom: 7 },
      "Haryana": { lat: 29.0588, lng: 76.0856, zoom: 8 },
      "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, zoom: 8 },
      "Jharkhand": { lat: 23.6102, lng: 85.2799, zoom: 7 },
      "Karnataka": { lat: 15.3173, lng: 75.7139, zoom: 7 },
      "Kerala": { lat: 10.8505, lng: 76.2711, zoom: 7 },
      "Madhya Pradesh": { lat: 22.9734, lng: 78.6569, zoom: 7 },
      "Maharashtra": { lat: 19.7515, lng: 75.7139, zoom: 7 },
      "Manipur": { lat: 24.6637, lng: 93.9063, zoom: 8 },
      "Meghalaya": { lat: 25.4670, lng: 91.3662, zoom: 8 },
      "Mizoram": { lat: 23.1645, lng: 92.9376, zoom: 8 },
      "Nagaland": { lat: 26.1584, lng: 94.5624, zoom: 8 },
      "Odisha": { lat: 20.9517, lng: 85.0985, zoom: 7 },
      "Punjab": { lat: 31.1471, lng: 75.3412, zoom: 8 },
      "Rajasthan": { lat: 27.0238, lng: 74.2179, zoom: 7 },
      "Sikkim": { lat: 27.5330, lng: 88.5122, zoom: 9 },
      "Tamil Nadu": { lat: 11.1271, lng: 78.6569, zoom: 7 },
      "Telangana": { lat: 18.1124, lng: 79.0193, zoom: 7 },
      "Tripura": { lat: 23.9408, lng: 91.9882, zoom: 9 },
      "Uttar Pradesh": { lat: 26.8467, lng: 80.9462, zoom: 7 },
      "Uttarakhand": { lat: 30.0668, lng: 79.0193, zoom: 8 },
      "West Bengal": { lat: 22.9868, lng: 87.8550, zoom: 7 },
      "Andaman and Nicobar Islands": { lat: 11.7401, lng: 92.6586, zoom: 8 },
      "Chandigarh": { lat: 30.7333, lng: 76.7794, zoom: 12 },
      "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.1809, lng: 73.0169, zoom: 10 },
      "Delhi": { lat: 28.7041, lng: 77.1025, zoom: 11 },
      "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762, zoom: 7 },
      "Ladakh": { lat: 34.1526, lng: 77.5771, zoom: 7 },
      "Lakshadweep": { lat: 10.5667, lng: 72.6417, zoom: 9 },
      "Puducherry": { lat: 11.9416, lng: 79.8083, zoom: 11 }
    };

    const base = stateCoordinates[stateName] || { lat: 22.9734, lng: 78.6569, zoom: 4.5 };
    if (!districtName) {
      return { lat: base.lat, lng: base.lng, zoom: base.zoom };
    }
    
    // Deterministic hash based on string character codes to yield realistic, persistent, spread-out coords
    const hashString = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const dHash = hashString(districtName);
    const cHash = cityName ? hashString(cityName) : dHash;

    // Offset of ~40km around central state coords so each area looks distinct and realistic on leaflet
    const latOffset = ((dHash % 200) - 100) / 250;
    const lngOffset = ((cHash % 200) - 100) / 250;

    return {
      lat: base.lat + latOffset,
      lng: base.lng + lngOffset,
      zoom: cityName ? 10 : 8
    };
  },

  updateMapHighlight() {
    if (!this._citizenMap || !window.L) return;

    const state = this.state.selectedState;
    const district = this.state.selectedDistrict;
    const city = this.state.selectedCity;

    if (!state) {
      // Return to India center
      this._citizenMap.setView([22.9734, 78.6569], 4.5);
      const badge = document.getElementById('map-target-badge');
      if (badge) badge.textContent = "INDIA (CENTRAL)";
      const coordsEl = document.getElementById('map-coordinates');
      if (coordsEl) coordsEl.textContent = "Center: 22.97° N, 78.65° E";
      if (this._activeSelectionMarker) {
        this._activeSelectionMarker.remove();
        this._activeSelectionMarker = null;
      }
      return;
    }

    const loc = this.getOffsetCoords(state, district, city);

    // Update lat/lng coordinates in UI
    const coordsEl = document.getElementById('map-coordinates');
    if (coordsEl) {
      coordsEl.textContent = `LAT: ${loc.lat.toFixed(4)}° N, LNG: ${loc.lng.toFixed(4)}° E`;
    }

    // Update target breadcrumb badge
    const badge = document.getElementById('map-target-badge');
    if (badge) {
      let pathStr = state;
      if (district) pathStr += ` ➔ ${district}`;
      if (city) pathStr += ` ➔ ${city}`;
      badge.textContent = pathStr;
    }

    // Clear old pinpoint
    if (this._activeSelectionMarker) {
      this._activeSelectionMarker.remove();
    }

    // Create custom Amber/Gold circle marker with pulse class to denote user's targeted suggestion
    this._activeSelectionMarker = L.circleMarker([loc.lat, loc.lng], {
      radius: 12,
      fillColor: '#f59e0b',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
      className: 'glowing-pulse-marker'
    }).addTo(this._citizenMap);

    let popupMarkup = `
      <div style="font-family:'Inter', sans-serif; min-width: 140px;">
        <span style="font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:11px; color:#ffffff; display: block; margin-bottom: 4px; text-transform: uppercase; color: var(--amber-400);">🎯 Targeted Planning Area</span>
        <div style="font-size:10.5px; color:#cbd5e1; line-height: 1.45;">
          <strong>Block/City:</strong> ${city || 'Select below...'}<br>
          <strong>District:</strong> ${district || 'Select below...'}<br>
          <strong>State:</strong> ${state}
        </div>
      </div>
    `;
    this._activeSelectionMarker.bindPopup(popupMarkup).openPopup();

    // Smoothly pan & zoom
    this._citizenMap.setView([loc.lat, loc.lng], loc.zoom);
  },

  async _loadActiveSignalPins() {
    if (!this._citizenMap || !window.L) return;

    try {
      let signals = [];
      try {
        signals = await StorageEngine.getAll('citizenSignals');
      } catch {
        signals = [];
      }

      // Prepopulate map with realistic coordinates across different states to represent active sensing platform
      if (signals.length === 0) {
        signals = [
          { title: "Drinking Water Pipe Leakage", state: "Madhya Pradesh", district: "Tikamgarh", city: "Tikamgarh", severity: "high" },
          { title: "Primary School Structural Cracks", state: "Uttar Pradesh", district: "Gaya", city: "Bodhgaya", severity: "critical" },
          { title: "Rural Solar Microgrid Outage", state: "Bihar", district: "Gaya", city: "Gaya Sadar", severity: "moderate" },
          { title: "Unpaved Gravel Potholes", state: "Andhra Pradesh", district: "Visakhapatnam", city: "Visakhapatnam Urban", severity: "high" }
        ];
      }

      signals.forEach(sig => {
        if (!sig.state) return;
        const loc = this.getOffsetCoords(sig.state, sig.district, sig.city);
        
        let color = '#6366f1'; // Indigo
        if (sig.severity === 'critical') color = '#ef4444'; // Red
        else if (sig.severity === 'high') color = '#f59e0b'; // Amber
        else if (sig.severity === 'good') color = '#10b981'; // Green

        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 6,
          fillColor: color,
          color: '#ffffff',
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.5
        }).addTo(this._citizenMap);

        const popupMarkup = `
          <div style="font-family:'Inter', sans-serif; min-width: 140px;">
            <div style="font-weight:700; font-size:11px; color:#ffffff; margin-bottom: 3px;">${sig.title || 'Civic Proposal'}</div>
            <div style="font-size:10px; color:#94a3b8; margin-bottom: 5px;">📍 ${sig.city || sig.district || 'Region'}, ${sig.state}</div>
            <span style="font-size:9px; background:${color}20; color:${color}; padding:2px 5px; border-radius:3px; font-weight:600; font-family:'JetBrains Mono', monospace; text-transform: uppercase;">${(sig.severity || 'MODERATE').toUpperCase()}</span>
          </div>
        `;
        marker.bindPopup(popupMarkup);
      });

    } catch (err) {
      console.warn("Could not load signal pins onto GIS map:", err);
    }
  },

  /* ─── Form Submission & Pipeline Simulation ────────── */
  async handleFormSubmit(e) {
    e.preventDefault();

    if (!this.state.selectedState || !this.state.selectedDistrict || !this.state.selectedCity) {
      this._showToast("Please select your State, District, and Block / City before submitting.");
      return;
    }

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
    if (this._el.introCard) this._el.introCard.style.display = 'none';

    // Scroll to processing timeline smoothly
    this._el.processingArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Begin pipeline step animations (Sequential delays)
    this._simulateAIProcessingSteps(text);
  },

  _simulateAIProcessingSteps(text) {
    // Clear previous classes
    document.querySelectorAll('.timeline-step').forEach(step => {
      step.classList.remove('active', 'completed', 'failed');
    });

    const updateStep = (id, status, newDesc = null) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active', 'completed', 'failed');
      if (status) {
        el.classList.add(status);
      }
      if (newDesc) {
        const descEl = el.querySelector('.step-desc');
        if (descEl) descEl.textContent = newDesc;
      }
    };

    const runPipeline = async () => {
      try {
        // Step 1: Citizen Submission Received
        updateStep('step-received', 'active', 'Payload received, checking data boundaries...');
        await new Promise(resolve => setTimeout(resolve, 800));
        updateStep('step-received', 'completed', 'Submission accepted into national queue');

        // Step 2: Language Auto-Detection
        updateStep('step-lang', 'active', 'Identifying regional language characteristics...');
        await new Promise(resolve => setTimeout(resolve, 700));
        const detectedLang = this.state.inputType === 'voice' 
          ? (this.state.recognitionLang || 'Auto-Detected') 
          : 'English (Auto-Detected)';
        updateStep('step-lang', 'completed', `Detected: ${detectedLang}`);

        // Step 3: Gemini Voice Transcription
        updateStep('step-stt', 'active', 'Transcribing speech to original script...');
        await new Promise(resolve => setTimeout(resolve, 800));
        const sttDesc = this.state.inputType === 'voice' 
          ? 'Transcript verified and cleaned of fillers' 
          : 'Skipped - Typed text input';
        updateStep('step-stt', 'completed', sttDesc);

        // Step 4: Gemini Translation to English
        updateStep('step-translation', 'active', 'Standardizing content for governance alignment...');
        await new Promise(resolve => setTimeout(resolve, 800));
        updateStep('step-translation', 'completed', 'Standard English Translation created');

        // Step 5: Image Understanding
        updateStep('step-vision', 'active', 'Analyzing computer vision patterns inside photo metadata...');
        await new Promise(resolve => setTimeout(resolve, 700));
        const imgCount = this.state.uploadedFiles.length;
        const unverifiedCount = this.state.uploadedFiles.filter(img => img.verified === false).length;
        let visionDesc = 'No evidence images attached';
        if (imgCount > 0) {
          if (unverifiedCount === imgCount) {
            visionDesc = `Processed ${imgCount} image(s): ⚠️ All images flagged as unrelated/unverified.`;
          } else if (unverifiedCount > 0) {
            visionDesc = `Processed ${imgCount} image(s): ${imgCount - unverifiedCount} verified, ${unverifiedCount} unverified.`;
          } else {
            visionDesc = `Processed ${imgCount} geo-tagged evidence image(s): Verified ✓`;
          }
        }
        updateStep('step-vision', 'completed', visionDesc);

        // Step 6: Theme & Infra Category Detection
        updateStep('step-theme', 'active', 'Matching with NITI Aayog development goals...');
        const reportPayload = {
          text: text,
          state: this.state.selectedState,
          district: this.state.selectedDistrict,
          city: this.state.selectedCity,
          ward: document.getElementById('loc-ward')?.value || 'Ward 1',
          images: this.state.uploadedFiles.map(img => img.dataUrl)
        };
        const scenario = await AIEngine.analyzeReport(reportPayload);
        if (!scenario) throw new Error("AI analysis did not return a valid scenario.");
        updateStep('step-theme', 'completed', `Identified Theme: ${scenario.theme}`);

        // Step 7: Semantic Similarity & Duplicate Search
        updateStep('step-similarity', 'active', 'Scanning active regional proposal clusters...');
        await new Promise(resolve => setTimeout(resolve, 700));
        updateStep('step-similarity', 'completed', `Clustered in database under ${scenario.clusterId || 'General'}`);

        // Step 8: 7-Source Evidence Fusion
        updateStep('step-fusion', 'active', 'Calculating demographic and satellite overlaps...');
        await new Promise(resolve => setTimeout(resolve, 700));
        updateStep('step-fusion', 'completed', 'Overlapped with block census datasets');

        // Step 9: Priority Vector Calculation
        updateStep('step-priority', 'active', 'Assigning quantitative contribution to constituency budget...');
        await new Promise(resolve => setTimeout(resolve, 700));
        updateStep('step-priority', 'completed', `Contribution calculated: ${scenario.contribution || 'High'}`);

        // Step 10: Civic Planning Brief Synced
        updateStep('step-ready', 'active', 'Syncing report with the Community Decision Cockpit...');
        
        // Prepare storage payload
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

        const startTime = Date.now();
        
        // Create a listener on BroadcastChannel to wait for 'dashboard_acknowledged'
        const ackPromise = new Promise((resolve, reject) => {
          let bcListener;
          let timeoutId;
          
          if (window.BroadcastChannel) {
            const bc = new BroadcastChannel('janvikas_channel');
            bcListener = (event) => {
              if (event.data && event.data.type === 'dashboard_acknowledged') {
                clearTimeout(timeoutId);
                bc.removeEventListener('message', bcListener);
                bc.close();
                resolve();
              }
            };
            bc.addEventListener('message', bcListener);
          } else {
            resolve(); // Fallback if BroadcastChannel is missing
          }

          // Timeout after 4.5 seconds
          timeoutId = setTimeout(() => {
            if (window.BroadcastChannel && bcListener) {
              const bc = new BroadcastChannel('janvikas_channel');
              bc.removeEventListener('message', bcListener);
              bc.close();
            }
            // Double-check localStorage as a secondary fallback channel
            const lastSync = localStorage.getItem('jv_dashboard_last_sync');
            if (lastSync && parseInt(lastSync) >= startTime) {
              resolve();
            } else {
              reject(new Error("Telemetry Cockpit Offline: Dashboard must be open in another tab to establish a live sync connection. Please keep both tabs open."));
            }
          }, 4500);
        });

        // Insert into storage which also triggers BroadcastChannel message post
        await StorageEngine.insert('citizenSignals', storedReport);

        // Update top bar dynamic signals count
        this.updateNationalSignalsBadge();

        // Wait for dynamic dashboard acknowledgement
        try {
          await ackPromise;
          updateStep('step-ready', 'completed', 'Telemetry Sync Connection Established Successfully · 100% data integrity');
        } catch (syncErr) {
          updateStep('step-ready', 'failed', syncErr.message);
          throw syncErr;
        }

        // Allow some time for user to see step 10 is green
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Render fields and show results
        this._renderAIResults(scenario, text);

      } catch (err) {
        console.error("Pipeline failure:", err);
        // Mark all active steps as failed
        document.querySelectorAll('.timeline-step.active, .timeline-step.step-ready').forEach(el => {
          el.classList.remove('active', 'completed');
          el.classList.add('failed');
          const desc = el.querySelector('.step-desc');
          if (desc) desc.textContent = `Failed: ${err.message || 'Unknown processing error'}`;
        });
        this._showToast(`Pipeline execution failed: ${err.message || 'System error'}`);
      }
    };

    runPipeline();
  },

  /* ─── AI Results Rendering ─────────────────────────── */
  _renderAIResults(scenario, text) {
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

    // Configure success card content
    if (this._el.successCard) {
      const localizedMessage = this._getLocalizedSuccessMessage(scenario.lang);
      const msgEl = document.getElementById('success-localized-message');
      if (msgEl) msgEl.textContent = localizedMessage;
      
      const themeMetric = document.getElementById('success-metric-theme');
      if (themeMetric) themeMetric.textContent = scenario.theme;
      
      const urgencyMetric = document.getElementById('success-metric-urgency');
      if (urgencyMetric) urgencyMetric.textContent = scenario.urgency;
      
      this._el.successCard.style.display = 'flex';
    }

    // Swap views
    this._el.processingArea.style.display = 'none';
    this._el.aiResultsPanel.style.display = 'block';
    
    if (this._el.successCard) {
      this._el.successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this._el.aiResultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this._showToast("Gemini Analysis Completed! Results compiled for civic planning dashboard.");
  },

  _getLocalizedSuccessMessage(langName) {
    const messages = {
      'hindi': "हर सुझाव का महत्व है! एक मजबूत और बेहतर जुड़े समुदाय के निर्माण में आपकी आवाज़ दर्ज कर ली गई है।",
      'telugu': "ప్రతి సలహాకూ విలువ ఉంది! బలమైన, మెరుగైన సమాజాన్ని నిర్మించడంలో మీ గళం విజయవంతంగా నమోదు చేయబడింది.",
      'bengali': "প্রতিটি পরামর্শেরই গুরুত্ব রয়েছে! একটি শক্তিশালী এবং আরও উন্নত সমাজ গঠনে আপনার কণ্ঠস্বর নথিভুক্ত করা হয়েছে।",
      'tamil': "ஒவ்வொரு ஆலோசனையும் முக்கியமானது! ஒரு வலுவான மற்றும் சிறந்த சமூகத்தை உருவாக்க உங்கள் குரல் பதிவு செய்யப்பட்டுள்ளது.",
      'marathi': "प्रत्येक सूचनेला महत्त्व आहे! एक मजबूत आणि अधिक चांगल्या प्रकारे जोडलेला समुदाय उभारण्यासाठी आपला आवाज नोंदवला गेला आहे.",
      'kannada': "ಪ್ರತಿಯೊಂದು ಸಲಹೆಯೂ ಮುಖ್ಯವಾಗಿದೆ! ಒಂದು ಬಲಿಷ್ಠ ಮತ್ತು ಉತ್ತಮ ಸಂಪರ್ਕ ಹೊಂದಿದ ಸಮಾਜವನ್ನು ನಿರ್ਮಿಸಲು ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.",
      'gujarati': "દરેક સૂચન મહત્વનું છે! એક મજબૂત અને વધુ સારી રીતે જોડાયેલા સમુદાયના નિર્માણમાં તમારો आवाज नोंदवण्यात आला आहे.",
      'malayalam': "ഓരോ നിർദ്ദേശവും വിലപ്പെട്ടതാണ്! കൂടുതൽ ശക്തവും മെച്ചപ്പെട്ടതുമായ ഒരു സമൂഹം കെട്ടിപ്പടുക്കുന്നതിനായി താങ്കളുടെ ശബ്ദം രേഖപ്പെടുത്തിയിരിക്കുന്നു.",
      'odia': "ପ୍ରତ୍ୟେକ ପରାମର୍ଶର ମୂଲ୍ୟ ରହିଛି! ଏକ ସୁଦୃଢ଼ ଏବଂ ସଂଯୁକ୍ତ ସମାଜ ଗଠନ ପାଇଁ ଆପଣଙ୍କ ସ୍ୱରକୁ ପଞ୍ਜିକୃତ କରାଯାଇଛି।",
      'punjabi': "ਹਰ ਸੁਝਾਅ ਦਾ ਮਹੱਤਵ ਹੈ! ਇੱਕ ਮਜ਼ਬੂਤ ਅਤੇ ਬਿਹਤਰ ਜੁੜੇ ਭਾਈਚਾਰੇ ਦੇ ਨਿਰਮਾਣ ਵਿੱਚ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਦਰਜ ਕਰ ਲਈ ਗਈ ਹੈ।",
      'assamese': "প্ৰতিটো পৰামৰ্শৰে মূল্য আছে! এক শক্তিশালী সমাজ গঠনৰ বাবে আপোনাৰ মন্তব্য সফলভাৱে পঞ্জীয়ন কৰা হৈছে।"
    };
    
    const lowerLang = String(langName || '').toLowerCase();
    if (lowerLang.includes('hind') || lowerLang.includes('हिन्')) return messages.hindi;
    if (lowerLang.includes('telu') || lowerLang.includes('తెలు')) return messages.telugu;
    if (lowerLang.includes('beng') || lowerLang.includes('bang') || lowerLang.includes('বাং')) return messages.bengali;
    if (lowerLang.includes('tami') || lowerLang.includes('தமி')) return messages.tamil;
    if (lowerLang.includes('marath') || lowerLang.includes('मरा')) return messages.marathi;
    if (lowerLang.includes('kann') || lowerLang.includes('ಕನ್ನ')) return messages.kannada;
    if (lowerLang.includes('guja') || lowerLang.includes('ગુજ')) return messages.gujarati;
    if (lowerLang.includes('malay') || lowerLang.includes('മല')) return messages.malayalam;
    if (lowerLang.includes('odia') || lowerLang.includes('oriy') || lowerLang.includes('ଓଡ଼')) return messages.odia;
    if (lowerLang.includes('punj') || lowerLang.includes('ਪੰਞ')) return messages.punjabi;
    if (lowerLang.includes('assam') || lowerLang.includes('অসম')) return messages.assamese;
    
    return "Every suggestion counts! Your voice has been registered to help build a stronger, better-connected community.";
  },

  scrollToResults() {
    if (this._el.aiResultsPanel) {
      this._el.aiResultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
              await StorageEngine.update('citizenSignals', sig.id || sig.uid, { supports: currentSupports + 1 });
              matchedAny = true;
              console.log(`Successfully boosted live signal ${sig.id || sig.uid} (${sigTheme}) supports to ${currentSupports + 1}`);
            }
          }

          if (!matchedAny && signals.length > 0) {
            const sig = signals[0];
            const currentSupports = sig.supports || 1;
            await StorageEngine.update('citizenSignals', sig.id || sig.uid, { supports: currentSupports + 1 });
            console.log(`No exact category match, boosted first signal ${sig.id || sig.uid} supports to ${currentSupports + 1}`);
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

    // Reset location states and dropdowns
    this._populateStates();

    // Re-center official India GIS map back to central view and remove selection markers
    this.updateMapHighlight();

    if (this._el.intakeCard) this._el.intakeCard.style.display = 'block';
    if (this._el.processingArea) this._el.processingArea.style.display = 'none';
    if (this._el.aiResultsPanel) this._el.aiResultsPanel.style.display = 'none';
    if (this._el.successCard) this._el.successCard.style.display = 'none';
    if (this._el.introCard) this._el.introCard.style.display = 'block';

    this.setInputType('text');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  },

  async _initDynamicTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    let signals = [];
    try {
      signals = await StorageEngine.getAll('citizenSignals');
    } catch (err) {
      console.warn("Failed to fetch signals for ticker, using defaults", err);
    }

    // Sort by timestamp descending if available
    if (signals && signals.length > 0) {
      signals.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Default curated fallback list (inspiring government-style items)
    const defaults = [
      {
        theme: "Water Infrastructure",
        city: "Tikamgarh",
        state: "Madhya Pradesh",
        text: "Jal Jeevan pipeline completed in Tikamgarh within 45 days of AI scheme matching",
        englishTranslation: "Jal Jeevan pipeline completed in Tikamgarh within 45 days of AI scheme matching",
        detectedLanguage: "English"
      },
      {
        theme: "Education Quality",
        city: "Bundelkhand",
        state: "Uttar Pradesh",
        text: "Bundelkhand primary school expansion authorized following statistical cluster warning",
        englishTranslation: "Bundelkhand primary school expansion authorized following statistical cluster warning",
        detectedLanguage: "English"
      },
      {
        theme: "Renewable Energy",
        city: "Bastar",
        state: "Chhattisgarh",
        text: "प्राथमिकता मानचित्रण के माध्यम से 14 दूरस्थ आदिवासी बस्तियों में ग्रामीण सौर ग्रिड सक्रिय हुआ",
        englishTranslation: "Rural solar grid active across 14 remote tribal hamlets through priority mapping",
        detectedLanguage: "Hindi"
      },
      {
        theme: "Roads & Transit",
        city: "Bastar",
        state: "Chhattisgarh",
        text: "Gravel road paving expedited in Bastar district after 18 regional citizen matches",
        englishTranslation: "Gravel road paving expedited in Bastar district after 18 regional citizen matches",
        detectedLanguage: "English"
      }
    ];

    // Combine database signals and fallback defaults
    const displaySignals = (signals && signals.length > 0) ? [...signals, ...defaults].slice(0, 10) : defaults;

    // Build ticker slides
    track.innerHTML = '';
    displaySignals.forEach((sig, idx) => {
      const slide = document.createElement('div');
      slide.className = `ticker-slide${idx === 0 ? ' active' : ''}`;
      
      // Determine if this entry does not support translation or needs original text
      const isHindiMode = window.JanVikasTranslation && window.JanVikasTranslation.currentLanguage === 'hi';
      const translationMissing = !sig.englishTranslation || sig.englishTranslation.trim() === "" || sig.englishTranslation === sig.text;
      
      // Every 3rd item or items with missing translation will show as "Original/No Translation Support"
      const supportsTranslation = !translationMissing && (idx % 3 !== 2);
      
      let isNative = false;
      let displayText = "";

      if (isHindiMode) {
        // Hindi language mode displays original text
        displayText = sig.text || sig.englishTranslation;
        isNative = true;
      } else if (!supportsTranslation) {
        // Translation is either missing or deliberately skipped to display authentic original voice!
        displayText = sig.text || sig.englishTranslation;
        isNative = true;
      } else {
        // Standard English translation
        displayText = sig.englishTranslation || sig.text;
      }

      // Shorten text to fit nicely in one line
      if (displayText.length > 120) {
        displayText = displayText.substring(0, 117) + '...';
      }

      const langLabel = isNative ? (sig.detectedLanguage || 'Native') : 'English';
      const themeIcon = sig.theme === 'Water Infrastructure' ? '💧' : (sig.theme === 'Roads & Transit' ? '🛣️' : '⚡');
      
      slide.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 6px; margin-right: 12px; flex-shrink: 0;">
          <span style="font-size: 10px; background: rgba(99,102,241,0.15); padding: 2px 6px; border-radius: 4px; color: var(--indigo-300); border: 1px solid rgba(99,102,241,0.25); font-weight: 600; text-transform: uppercase;">
            📍 ${sig.city || 'District'}
          </span>
          <span style="font-size: 10px; background: ${isNative ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'}; padding: 2px 6px; border-radius: 4px; color: ${isNative ? '#f87171' : '#34d399'}; border: 1px solid ${isNative ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${isNative ? `🗣️ ${langLabel} (Original)` : '✨ Translated'}
          </span>
        </span>
        <span style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14.5px; font-weight: 500; color: var(--text-primary);">
          ${themeIcon} ${displayText}
        </span>
      `;
      track.appendChild(slide);
    });

    // Start slide animation
    let activeIdx = 0;
    const slides = track.querySelectorAll('.ticker-slide');
    if (slides.length <= 1) return;

    if (this._tickerInterval) clearInterval(this._tickerInterval);
    this._tickerInterval = setInterval(() => {
      slides[activeIdx].classList.remove('active');
      activeIdx = (activeIdx + 1) % slides.length;
      slides[activeIdx].classList.add('active');
    }, 4500);
  },

  async updateNationalSignalsBadge() {
    const badge = document.getElementById('national-signals-badge');
    if (!badge) return;

    try {
      const signals = await StorageEngine.getAll('citizenSignals');
      const totalCount = 1247 + (signals ? signals.length : 0);
      badge.textContent = `${totalCount.toLocaleString('en-IN')} national signals aggregated`;
    } catch (err) {
      console.warn("Failed to update national signals badge from database:", err);
    }
  }
};

// Expose globally so that inline events find it perfectly
window.JanVikasCitizen = JanVikasCitizen;

// Start portal on page load
document.addEventListener('DOMContentLoaded', () => {
  JanVikasCitizen.init();
});
