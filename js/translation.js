// Translation and Localization Engine for JanVikas AI
// Supports real-time toggling between English (en) and Hindi (hi)

const TRANSLATIONS = {
  en: {
    "app_title": "JanVikas AI",
    "gateway_badge": "AI-Native Public Infrastructure",
    "gateway_subtitle": "An intelligent developmental bridge connecting native citizen voices with data-driven legislative prioritization and strategic budgetary allocations.",
    "citizen_intake_badge": "Democracy Front-End",
    "citizen_intake_title": "Citizen Signal Intake",
    "citizen_intake_desc": "Speak or write in your local native language. Our Gemini-powered analysis pipeline translates, synthesizes, and fuses your input into high-fidelity actionable development signal records.",
    "citizen_intake_action": "Enter Intake Portal",
    "admin_cockpit_badge": "Administrative Back-End",
    "admin_cockpit_title": "MP Decision Cockpit",
    "admin_cockpit_desc": "Inspect real-time predictive development heatmaps, automatically rank capital infrastructure proposals, track open budget windows, and query the legislative copilot.",
    "admin_cockpit_action": "Access Command Cockpit",
    
    // Citizen Portal Page
    "portal_subtitle": "Public Suggestion & Sensing Portal",
    "direct_submission_title": "Direct Public Suggestion Submission",
    "direct_submission_desc": "This secure portal empowers citizens to register local community requirements directly. Powered by advanced multilingual Gemini models, your voice is automatically transcribed, translated, and categorized for development schemes and public policy transparency.",
    
    "tab_text_proposal": "✍️ Text Proposal",
    "tab_voice_proposal": "🎤 Native Voice",
    
    "label_select_state": "Select State",
    "label_select_district": "Select District",
    "label_select_block": "Select Tehsil / Block",
    "label_select_village": "Select Village / Ward",
    "placeholder_describe": "Describe the local development issue or suggestion in detail. You can write in your native language (Hindi, Tamil, Telugu, Bengali, etc.)...",
    "btn_analyze": "⚡ Analyze and Submit Proposal",
    "banner_cv_nlp": "Our system uses Computer Vision & NLP to automatically match your submission with optimal state schemes. You do not need to label anything.",
    
    // Intro & Mission Details
    "intro_title": "🚀 JanVikas Mission: Direct Civic Sensing",
    "intro_subtitle": "Why should you submit suggestions?",
    "why_1_title": "Immediate Visualization",
    "why_1_desc": "Your suggestions are analyzed and plotted in real-time onto regional planning heatmaps seen directly by authorized decision makers.",
    "why_2_title": "Bypass Bureaucratic Red Tape",
    "why_2_desc": "Direct transmission eliminates manual paperwork delays, making sure your voice is structured into actionable proposals in seconds.",
    "why_3_title": "Collective Power",
    "why_3_desc": "When multiple citizens highlight similar regional demands (e.g., water quality, secondary schools), the AI fuses them into heavy-priority clusters.",
    
    // Strict Privacy Section
    "privacy_title": "🔒 100% Zero-Identity Policy",
    "privacy_desc_1": "We do not request or store your Name, Aadhaar, Phone Number, or Email. Your identity cannot be shared, sold, or leaked because it is never collected.",
    "privacy_desc_2": "The AI extracts purely development-related facts, coordinates, and photo evidence. Everything else is completely omitted.",
    
    // Ticker Titles
    "ticker_title": "🔥 CIVIC IMPACT UPDATES",
    "ticker_1": "Jal Jeevan pipeline completed in Tikamgarh within 45 days of AI scheme matching",
    "ticker_2": "Bundelkhand primary school expansion authorized following statistical cluster warning",
    "ticker_3": "Rural solar grid active across 14 remote tribal hamlets through priority mapping",
    "ticker_4": "Gravel road paving expedited in Bastar district after 18 regional citizen matches",
    
    "btn_submit_another": "🔄 Submit Another Development Need",
    "btn_view_report": "✨ View In-Depth AI Analysis Report",
    
    // Settings modal translations
    "settings_title": "⚙️ Platform AI & API Configuration",
    "settings_save": "💾 Save Configuration",
    "settings_clear": "🗑️ Clear Key"
  },
  hi: {
    "app_title": "जनविकास एआई",
    "gateway_badge": "एआई-संचालित जन बुनियादी ढांचा",
    "gateway_subtitle": "नागरिकों की स्थानीय आवाज़ को डेटा-आधारित विधायी प्राथमिकताओं और रणनीतिक बजटीय आवंटन से जोड़ने वाला एक बुद्धिमान विकासात्मक पुल।",
    "citizen_intake_badge": "लोकतंत्र का प्रवेश द्वार",
    "citizen_intake_title": "नागरिक संकेत अंतर्ग्रहण",
    "citizen_intake_desc": "अपनी स्थानीय मातृभाषा में बोलें या लिखें। हमारा जेमिनी-संचालित विश्लेषण पाइपलाइन आपके इनपुट का अनुवाद, संश्लेषण और योजना संरेखण करता है।",
    "citizen_intake_action": "पोर्टल में प्रवेश करें",
    "admin_cockpit_badge": "प्रशासनिक बैक-एंड",
    "admin_cockpit_title": "सांसद निर्णय कॉकपिट",
    "admin_cockpit_desc": "वास्तविक समय के विकास हॉटमैप का निरीक्षण करें, बुनियादी ढांचा प्रस्तावों को रैंक करें और बजटीय विलोपन को ट्रैक करें।",
    "admin_cockpit_action": "कमांड कॉकपिट तक पहुंचें",
    
    // Citizen Portal Page
    "portal_subtitle": "सार्वजनिक सुझाव और संवेदन पोर्टल",
    "direct_submission_title": "प्रत्यक्ष सार्वजनिक सुझाव प्रविष्टि",
    "direct_submission_desc": "यह सुरक्षित पोर्टल नागरिकों को स्थानीय सामुदायिक आवश्यकताओं को सीधे दर्ज करने का अधिकार देता है। उन्नत बहुभाषी जेमिनी मॉडल द्वारा संचालित, आपकी आवाज़ को स्वचालित रूप से ट्रांसक्राइब, अनुवादित और योजना संरेखण के लिए वर्गीकृत किया जाता है।",
    
    "tab_text_proposal": "✍️ लिखित प्रस्ताव",
    "tab_voice_proposal": "🎤 स्थानीय आवाज़",
    
    "label_select_state": "राज्य चुनें",
    "label_select_district": "ज़िला चुनें",
    "label_select_block": "तहसील / ब्लॉक चुनें",
    "label_select_village": "गाँव / वार्ड चुनें",
    "placeholder_describe": "स्थानीय विकास समस्या या सुझाव का विस्तार से वर्णन करें। आप अपनी मूल भाषा (हिंदी, तमिल, तेलुगु, बंगाली आदि) में लिख सकते हैं...",
    "btn_analyze": "⚡ विश्लेषण करें और प्रस्ताव जमा करें",
    "banner_cv_nlp": "हमारी प्रणाली आपके सुझाव को उपयुक्त योजनाओं से मिलाने के लिए कंप्यूटर विज़न और एनएलपी का उपयोग करती है।",
    
    // Intro & Mission Details
    "intro_title": "🚀 जनविकास मिशन: प्रत्यक्ष नागरिक संवेदन",
    "intro_subtitle": "आपको सुझाव क्यों देना चाहिए?",
    "why_1_title": "तत्काल दृश्यता",
    "why_1_desc": "आपके सुझावों का विश्लेषण किया जाता है और वास्तविक समय में क्षेत्रीय नियोजन हॉटमैप पर प्रदर्शित किया जाता है जिसे सीधे निर्णयकर्ता देख सकते हैं।",
    "why_2_title": "लालफीताशाही से मुक्ति",
    "why_2_desc": "सीधा प्रसारण कागजी कार्रवाई के विलंब को समाप्त करता है, जिससे आपकी आवाज़ सेकंडों में कार्रवाई योग्य प्रस्तावों में बदल जाती है।",
    "why_3_title": "सामूहिक शक्ति",
    "why_3_desc": "जब कई नागरिक समान क्षेत्रीय मांगों (जैसे, पानी की गुणवत्ता, माध्यमिक स्कूल) को उजागर करते हैं, तो एआई उन्हें उच्च-प्राथमिकता वाले क्लस्टर में मिला देता है।",
    
    // Strict Privacy Section
    "privacy_title": "🔒 शून्य व्यक्तिगत डेटा नीति",
    "privacy_desc_1": "हम आपका नाम, आधार, फोन या ईमेल नहीं मांगते हैं। आपकी व्यक्तिगत जानकारी कभी साझा नहीं की जा सकती, क्योंकि इसे कभी एकत्र ही नहीं किया जाता।",
    "privacy_desc_2": "एआई केवल विकास-संबंधी तथ्यों, निर्देशांकों और फोटो साक्ष्यों को निकालता है। अन्य सभी चीज़ें पूरी तरह छोड़ दी जाती हैं।",
    
    // Ticker Titles
    "ticker_title": "🔥 नागरिक प्रभाव अपडेट",
    "ticker_1": "जेमिनी एआई योजना मिलान के बाद 45 दिनों के भीतर टीकमगढ़ में जल जीवन पाइपलाइन पूरी हुई",
    "ticker_2": "सांख्यिकीय क्लस्टर चेतावनी के बाद बुंदेलखंड प्राथमिक विद्यालय विस्तार को मंजूरी मिली",
    "ticker_3": "प्राथमिकता मानचित्रण के माध्यम से 14 दूरस्थ आदिवासी बस्तियों में ग्रामीण सौर ग्रिड सक्रिय हुआ",
    "ticker_4": "18 क्षेत्रीय नागरिक मिलानों के बाद बस्तर जिले में बजरी सड़क बिछाने में तेजी आई",
    
    "btn_submit_another": "🔄 एक और विकास आवश्यकता सबमिट करें",
    "btn_view_report": "✨ गहन एआई विश्लेषण रिपोर्ट देखें",
    
    // Settings modal translations
    "settings_title": "⚙️ प्लेटफॉर्म एआई और एपीआई कॉन्फ़िगरेशन",
    "settings_save": "💾 कॉन्फ़िगरेशन सहेजें",
    "settings_clear": "🗑️ कुंजी साफ़ करें"
  }
};

window.JanVikasTranslation = {
  currentLanguage: 'en',

  init() {
    const saved = localStorage.getItem('janvikas_lang');
    if (saved === 'hi') {
      this.currentLanguage = 'hi';
    } else {
      this.currentLanguage = 'en';
    }
    this.apply();
    this.injectToggler();
  },

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('janvikas_lang', lang);
    this.apply();
    this.updateTogglerUI();
    // Dispatch a custom event for other modules
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  },

  apply() {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    document.querySelectorAll('[data-tk]').forEach(el => {
      const key = el.getAttribute('data-tk');
      const text = dict[key];
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          // Keep icons if they are at the start of text
          const hasEmoji = el.getAttribute('data-keep-emoji');
          if (hasEmoji) {
            el.innerHTML = `${hasEmoji} ${text}`;
          } else {
            el.textContent = text;
          }
        }
      }
    });

    // Handle document HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  },

  injectToggler() {
    // Look for a language container or find the settings button to inject beside
    const target = document.getElementById('settings-btn') || document.querySelector('.topbar-time');
    if (!target) return;

    // Check if toggler already exists
    if (document.getElementById('janvikas-lang-toggler')) return;

    const toggler = document.createElement('div');
    toggler.id = 'janvikas-lang-toggler';
    toggler.className = 'lang-selector';
    toggler.style.cssText = `
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: var(--r-md);
      padding: 2px;
      gap: 2px;
      font-family: var(--font-body);
    `;

    const enBtn = document.createElement('button');
    enBtn.id = 'lang-btn-en';
    enBtn.textContent = 'EN';
    enBtn.style.cssText = this.getBtnStyle(this.currentLanguage === 'en');
    enBtn.addEventListener('click', () => this.setLanguage('en'));

    const hiBtn = document.createElement('button');
    hiBtn.id = 'lang-btn-hi';
    hiBtn.textContent = 'हिन्दी';
    hiBtn.style.cssText = this.getBtnStyle(this.currentLanguage === 'hi');
    hiBtn.addEventListener('click', () => this.setLanguage('hi'));

    toggler.appendChild(enBtn);
    toggler.appendChild(hiBtn);

    // Insert before settings-btn
    target.parentNode.insertBefore(toggler, target);
  },

  getBtnStyle(isActive) {
    return `
      background: ${isActive ? 'linear-gradient(135deg, #FF9933 0%, #138808 100%)' : 'transparent'};
      color: ${isActive ? '#ffffff' : 'var(--text-secondary)'};
      border: none;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
    `;
  },

  updateTogglerUI() {
    const enBtn = document.getElementById('lang-btn-en');
    const hiBtn = document.getElementById('lang-btn-hi');
    if (enBtn) enBtn.style.cssText = this.getBtnStyle(this.currentLanguage === 'en');
    if (hiBtn) hiBtn.style.cssText = this.getBtnStyle(this.currentLanguage === 'hi');
  },

  initTicker() {
    if (document.getElementById('citizen-intro-card')) {
      // The citizen page has its own dynamic database-driven ticker!
      return;
    }
    let activeIdx = 0;
    const slides = document.querySelectorAll('.ticker-slide');
    if (slides.length === 0) return;
    setInterval(() => {
      slides[activeIdx].classList.remove('active');
      activeIdx = (activeIdx + 1) % slides.length;
      slides[activeIdx].classList.add('active');
    }, 4000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.JanVikasTranslation.init();
  window.JanVikasTranslation.initTicker();
});
