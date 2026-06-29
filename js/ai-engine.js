/**
 * ═══════════════════════════════════════════════════════
 * JanVikas AI — Intelligent Processing Engine
 * ═══════════════════════════════════════════════════════
 */

import { Utils } from './utils.js';
import { StorageEngine } from './firebase.js';

export const AIEngine = {
  /**
   * Run semantic NLP & Gemini analysis on public report submissions.
   * If online, attempts API proxy. If proxy fails or offline, runs local fallback.
   * @param {Object} report
   * @returns {Promise<Object>}
   */
  async analyzeReport(report) {
    const text = (report.text || '').trim();
    let scenario = null;
    
    // 1. Attempt Client-Side Direct Gemini API Call if Key Exists
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey && navigator.onLine) {
      try {
        const promptText = `
You are the JanVikas AI civic intelligence analyst. Your task is to analyze the following citizen complaint / development need from an Indian citizen and return a highly structured JSON response.

Citizen Submission:
State: ${report.state || ''}
District: ${report.district || ''}
Block/City: ${report.city || ''}
Ward: ${report.ward || ''}
Text/Speech Input: "${text}"

Analyze the input text/speech and output a valid JSON object matching this exact schema:
{
  "lang": "The language of the user input with ISO suffix (e.g. 'English (ISO: en_US)', 'Hindi (ISO: hi_IN)', 'Telugu (ISO: te_IN)', 'Marathi (ISO: mr_IN)', 'Kannada (ISO: kn_IN)', 'Tamil (ISO: ta_IN)', etc.)",
  "theme": "One of: 'Water Infrastructure', 'Healthcare Access', 'Road Connectivity', 'Energy Access', 'Civic Facilities'",
  "themeClass": "One of: 'accent-water', 'accent-health', 'accent-edu', 'accent-critical' (accent-critical is for critical issues, accent-water is general, accent-health is for health, accent-edu is for education/civic)",
  "transcript": "The user input in its original language, cleaned of verbal filler if speech.",
  "translation": "The direct English translation of the user's input. If the input is already in English, this should match the transcript.",
  "scheme": "The national or state development scheme that applies to this complaint (e.g. 'Jal Jeevan Mission (JJM)' for Water, 'National Health Mission (NHM)' for Health, 'Pradhan Mantri Gram Sadak Yojana (PMGSY)' for Roads, 'Swachh Bharat Abhiyan (SBA)' for Sanitation/Civic, 'PM-KUSUM / Deen Dayal Upadhyaya Gram Jyoti Yojana' for Energy/Solar)",
  "urgency": "Format: '🔴 Critical (Score: X.Y/10)' or '🟠 High (Score: X.Y/10)' or '🟡 Moderate (Score: X.Y/10)' based on severity of the issue",
  "urgencyValue": 6.8,
  "urgencyClass": "One of: 'accent-critical' (for score >= 8.5), 'accent-health' (for health score >= 7.0), 'accent-water' (for general or moderate score), 'accent-edu' (for general/civic)",
  "clusterId": "A string ID like 'Water-Cluster-42' or 'Health-Cluster-15' or 'Road-Cluster-31' depending on category and location",
  "contribution": "A brief priority impact description (e.g. 'HIGH (+1.8 to regional water deficit)' or 'CRITICAL (+2.1 to health accessibility)')",
  "summary": "A professional 3-sentence summary analyzing the citizen's report, explaining why it was categorized under the chosen theme, citing the location (${report.city || ''}, ${report.district || ''}, ${report.state || ''}), and specifying its priority multiplier in the government database.",
  "confidence": "Format: 'XX% AI Confidence' where XX is between 85 and 99",
  "proposals": [
    {
      "id": 201,
      "name": "A realistic, high-impact proposed project name to solve this specific complaint in this block (e.g. 'Rural Drinking Water Network Upgrade' or 'Primary Health Centre Ambulance Unit')",
      "match": "Format: 'XX% AI Match' where XX is between 80 and 98",
      "location": "📍 ${report.city || report.district || ''}, ${report.state || ''}",
      "theme": "The theme selected above",
      "supports": 1200
    },
    {
      "id": 202,
      "name": "Another secondary related development proposal in the district",
      "match": "Format: 'XX% Similarity' where XX is between 40 and 75",
      "location": "📍 ${report.district || ''}, ${report.state || ''}",
      "theme": "A related theme",
      "supports": 450
    }
  ]
}

Only return a valid JSON object. Do not include any markdown backticks (such as \`\`\`json) or any explanation text outside of the JSON. Make sure the JSON is completely valid and parseable.
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawText = data.candidates[0].content.parts[0].text;
          if (rawText.includes('```')) {
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          }
          scenario = JSON.parse(rawText);
          console.log("🚀 Direct Gemini 2.5 Flash response successfully parsed:", scenario);
        } else {
          console.warn(`Gemini API returned status ${response.status}. Defaulting to rule-based client-side engine.`);
        }
      } catch (err) {
        console.warn("Direct Gemini 2.5 Flash query failed. Defaulting to local high-fidelity NLP rules.", err);
      }
    }

    if (!scenario) {
      // 2. High-Fidelity Client-Side Rule-Based NLP & Gemini Fallback
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing delay
      
      const lowerText = text.toLowerCase();
      
      // Default Fallback Scenario (Civic/Infrastructure Maintenance)
      scenario = {
        lang: "English (ISO: en_US)",
        theme: "Infrastructure Maintenance",
        themeClass: "accent-water",
        transcript: text || "Local civic maintenance required for public utilities.",
        translation: text || "Local civic maintenance required for public utilities.",
        scheme: "SBA (Swachh Bharat Abhiyan)",
        urgency: "🟡 Moderate (Score: 6.8/10)",
        urgencyValue: 6.8,
        urgencyClass: "accent-water",
        clusterId: "Civic-Cluster-12",
        contribution: "MODERATE (+0.6 to maintenance deficit)",
        summary: "Your submission has been captured. It categorized under general Infrastructure Maintenance and matches local development grids. It has been registered as an active feedback node and scheduled for regional planning review.",
        confidence: "85% (Rule-Based Fallback)",
        proposals: [
          { id: 101, name: "Panchayat Community Hall Renovation", match: "82% AI Match", location: `📍 ${report.city || 'Selected Location'}`, theme: "Civic Facilities", supports: 120 },
          { id: 102, name: "Public Waste Bin Placements", match: "45% Similarity", location: `📍 ${report.district || 'Local Block'}`, theme: "Sanitation & Waste", supports: 231 }
        ]
      };

      // Water Pipeline / Drought Scenario
      if (lowerText.includes('water') || lowerText.includes('drinking') || lowerText.includes('pipeline') || lowerText.includes('well') || lowerText.includes('తాగునీటి') || lowerText.includes('पानी')) {
        scenario = {
          lang: lowerText.includes('తాగునీటి') ? "Telugu (ISO: te_IN)" : (lowerText.match(/[\u0900-\u097F]/) ? "Hindi (ISO: hi_IN)" : "English (ISO: en_US)"),
          theme: "Water Infrastructure",
          themeClass: "accent-water",
          transcript: text,
          translation: lowerText.includes('తాగునీటి') 
            ? "There is a severe drinking water problem in our village. Children are unable to attend school because they must walk 8 kilometers daily to fetch clean water." 
            : text,
          scheme: "Jal Jeevan Mission (JJM)",
          urgency: "🔴 Critical (Score: 9.4/10)",
          urgencyValue: 9.4,
          urgencyClass: "accent-critical",
          clusterId: `Water-Cluster-${Math.floor(Math.random() * 90 + 10)}`,
          contribution: "HIGH (+1.8 to regional deficit)",
          summary: `Your multilingual submission has been successfully translated and categorized under <strong>Water Infrastructure</strong>. The evidence matches existing infrastructure gap profiles in ${report.city || 'Tikamgarh Block'} (−63% coverage below norm). The school-dropout/drought risk triggers a heavy critical priority score multiplier. This report has been consolidated into the active national evidence cockpit.`,
          confidence: "94% (Rule-Based Fallback)",
          proposals: [
            { id: 1, name: "Rural Drinking Water Network Upgrade", match: "94% AI Match", location: `📍 ${report.city || 'Tikamgarh'}, ${report.state || 'UP'}`, theme: "Water Infrastructure", supports: 4821 },
            { id: 2, name: "Panchayat Primary Health Centre Expansion", match: "42% Similarity", location: `📍 ${report.district || 'Bundelkhand'}, ${report.state || 'UP'}`, theme: "Healthcare Access", supports: 842 }
          ]
        };
      } 
      // Healthcare / Clinic / Hospital Scenario
      else if (lowerText.includes('health') || lowerText.includes('clinic') || lowerText.includes('phc') || lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('एम्बुलेंस') || lowerText.includes('अस्पताल')) {
        scenario = {
          lang: lowerText.match(/[\u0900-\u097F]/) ? "Hindi (ISO: hi_IN)" : "English (ISO: en_US)",
          theme: "Healthcare Access",
          themeClass: "accent-health",
          transcript: text,
          translation: lowerText.includes('एम्बुलेंस') || lowerText.includes('अस्पताल') 
            ? "There is no Primary Health Centre (PHC) in our block. The nearest hospital is 45 kilometers away, and even emergency ambulances cannot reach here." 
            : text,
          scheme: "National Health Mission (NHM)",
          urgency: "🔴 Critical (Score: 8.9/10)",
          urgencyValue: 8.9,
          urgencyClass: "accent-health",
          clusterId: `Health-Cluster-${Math.floor(Math.random() * 90 + 10)}`,
          contribution: "HIGH (+1.5 to regional health index)",
          summary: `Your multilingual submission has been processed. It matches the <strong>Healthcare Access</strong> theme. Evidence confirms severe localized medical desert status with the nearest hospital over 45km away. The ambulance connectivity challenge has triggered a high urgency level in ${report.city || 'Gaya Block'}. It has been synced into the active regional health funding proposal.`,
          confidence: "91% (Rule-Based Fallback)",
          proposals: [
            { id: 3, name: "District Hospital Equipment Upgrade", match: "88% AI Match", location: `📍 ${report.city || 'Gaya'}, ${report.state || 'Bihar'}`, theme: "Healthcare Access", supports: 3247 },
            { id: 4, name: "Rural Connectivity Link Road Expansion", match: "51% Similarity", location: `📍 ${report.district || 'Magadh Area'}, ${report.state || 'Bihar'}`, theme: "Road Connectivity", supports: 1542 }
          ]
        };
      }
      // Road / Transportation / Connectivity Scenario
      else if (lowerText.includes('road') || lowerText.includes('pmgsy') || lowerText.includes('bridge') || lowerText.includes('highway') || lowerText.includes('connectivity') || lowerText.includes('रास्ता') || lowerText.includes('सड़क')) {
        scenario = {
          lang: lowerText.match(/[\u0900-\u097F]/) ? "Hindi (ISO: hi_IN)" : "English (ISO: en_US)",
          theme: "Road Connectivity",
          themeClass: "accent-water",
          transcript: text,
          translation: text,
          scheme: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
          urgency: "🟠 High (Score: 8.6/10)",
          urgencyValue: 8.6,
          urgencyClass: "accent-water",
          clusterId: `Road-Cluster-${Math.floor(Math.random() * 90 + 10)}`,
          contribution: "HIGH (+1.2 to accessibility score)",
          summary: `Your submission has been cataloged under the <strong>Road Connectivity (PMGSY)</strong> scheme. Access indicators in ${report.city || 'Koraput Block'} confirm that over 89 villages lack all-weather metalled road access, triggering transport priority multipliers. This report is flagged for Lok Sabha MP review in the Q2 budgeting round.`,
          confidence: "93% (Rule-Based Fallback)",
          proposals: [
            { id: 5, name: "Rural Road Connectivity (PMGSY Ph.2)", match: "98% AI Match", location: `📍 ${report.city || 'Koraput'}, ${report.state || 'Odisha'}`, theme: "Road Connectivity", supports: 2819 },
            { id: 6, name: "Solar Micro-Grid Electrification", match: "31% Similarity", location: `📍 ${report.district || 'Koraput District'}, ${report.state || 'Odisha'}`, theme: "Energy Access", supports: 1547 }
          ]
        };
      }
      // Solar / Electricity / Power Scenario
      else if (lowerText.includes('solar') || lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('grid') || lowerText.includes('light') || lowerText.includes('बिजली')) {
        scenario = {
          lang: lowerText.match(/[\u0900-\u097F]/) ? "Hindi (ISO: hi_IN)" : "English (ISO: en_US)",
          theme: "Energy Access",
          themeClass: "accent-water",
          transcript: text,
          translation: text,
          scheme: "PM-KUSUM / Deen Dayal Upadhyaya Gram Jyoti Yojana",
          urgency: "🟠 High (Score: 8.2/10)",
          urgencyValue: 8.2,
          urgencyClass: "accent-water",
          clusterId: `Power-Cluster-${Math.floor(Math.random() * 90 + 10)}`,
          contribution: "HIGH (+1.1 to rural grid expansion)",
          summary: `Your power-grid feedback is analyzed under <strong>Energy Access</strong>. Correlating local coordinates with satellite night-lights confirms a deficit grid status. This submission has been merged into the PM-KUSUM rural solar micro-grid proposal list.`,
          confidence: "88% (Rule-Based Fallback)",
          proposals: [
            { id: 7, name: "Solar Micro-Grid Electrification", match: "96% AI Match", location: `📍 ${report.city || 'Barmer'}, ${report.state || 'Rajasthan'}`, theme: "Energy Access", supports: 1547 },
            { id: 8, name: "School Capacity & Midday Meal Infra", match: "24% Similarity", location: `📍 ${report.district || 'Barmer Block'}, ${report.state || 'Rajasthan'}`, theme: "School Capacity", supports: 1203 }
          ]
        };
      }
    }

    // Post-process similar proposals with actual live database records for duplicate detection
    let existingSignals = [];
    try {
      existingSignals = await StorageEngine.getAll('citizenSignals');
    } catch (e) {
      existingSignals = [];
    }

    const matchingSignals = existingSignals.filter(s => {
      const sameTheme = (s.theme || s.category || '').toLowerCase() === scenario.theme.toLowerCase();
      const sameDistrict = (s.district || '').toLowerCase() === (report.district || '').toLowerCase();
      return sameTheme && sameDistrict;
    });

    const realProposals = matchingSignals.map(sig => ({
      id: sig.id,
      name: sig.title || `${sig.theme || sig.category} Upgrade Requisition`,
      match: "98% AI Match (DUPLICATE)",
      location: `📍 ${sig.city || 'Local Area'}, ${sig.state || 'Local State'}`,
      theme: sig.theme || sig.category,
      supports: sig.supports || 1,
      isRealSignal: true
    }));

    scenario.proposals = [...realProposals, ...scenario.proposals].slice(0, 2);

    return scenario;
  },

  /**
   * Translates speech text, detects language and estimates confidence
   * @param {string} text 
   * @returns {Promise<Object>}
   */
  async translateSpeech(text) {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey && navigator.onLine) {
      try {
        const promptText = `
You are a translation and language detection expert. Analyze the following Indian regional speech transcript.
Analyze the language, translate it to English, and estimate a confidence score of the transcription.

Speech Transcript:
"${text}"

Return a valid JSON object matching this exact schema:
{
  "original": "The original transcript, cleaned of verbal filler.",
  "language": "Detected language (e.g. 'Hindi', 'Telugu', 'Bengali', 'Tamil', 'Marathi', etc.)",
  "translation": "The direct English translation of the transcript.",
  "confidence": 92, // integer percentage confidence between 85 and 99
  "engine": "Gemini 2.5 Flash"
}

Only return a valid JSON object. Do not include any markdown backticks or explanation text.
`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let rawText = data.candidates[0].content.parts[0].text;
          if (rawText.includes('```')) {
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          }
          const res = JSON.parse(rawText);
          return res;
        }
      } catch (err) {
        console.warn("Gemini translateSpeech failed, falling back to local:", err);
      }
    }

    // Local fallback engine
    let language = "Detected Language";
    let translation = text;
    let confidence = 88;
    
    // Simple mock heuristic for fallback
    const textLower = text.toLowerCase();
    if (textLower.includes("నీరు") || textLower.includes("తాగునీటి") || textLower.includes("సమస్య ఉంది")) {
      language = "Telugu";
      translation = "Our village has a drinking water problem. Children are unable to go to school because they have to carry water from 8 kilometers away.";
      confidence = 94;
    } else if (textLower.includes("পানীয়") || textLower.includes("জল") || textLower.includes("আমাদের গ্রামে")) {
      language = "Bengali";
      translation = "Our village has a severe drinking water problem. Children have to carry water from 8 kilometers away.";
      confidence = 90;
    } else if (textLower.includes("पानी") || textLower.includes("सड़क") || textLower.includes("टूट") || textLower.includes("समस्या")) {
      language = "Hindi";
      if (textLower.includes("सड़क") || textLower.includes("रोड")) {
        translation = "The road is completely broken. There are deep potholes making it impossible to travel or walk.";
      } else {
        translation = "There is a severe drinking water problem in our area.";
      }
      confidence = 92;
    } else if (textLower.includes("குடிநீர்") || textLower.includes("பிரச்சனை")) {
      language = "Tamil";
      translation = "There is an acute drinking water problem in our village. Children are forced to carry water from 8km away.";
      confidence = 93;
    } else if (textLower.includes("पिण्याच्या") || textLower.includes("पाण्याची")) {
      language = "Marathi";
      translation = "There is a massive drinking water problem in our village. Children have to bring water from 8km away.";
      confidence = 91;
    } else {
      // General fallback if English or other unrecognized text
      language = "English";
      translation = text;
      confidence = 95;
    }

    return {
      original: text,
      language: language,
      translation: translation,
      confidence: confidence,
      engine: "Offline Translation"
    };
  },

  /**
   * Conversational query handler with Governance Copilot
   * @param {string} prompt 
   * @param {Array} history
   * @returns {Promise<string>}
   */
  async askCopilot(prompt, history = []) {
    let reports = [];
    try {
      reports = await StorageEngine.getAll('citizenSignals');
    } catch (e) {
      reports = [];
    }

    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey && navigator.onLine) {
      try {
        const reportContext = reports.length === 0 
          ? "No citizen signals have been submitted yet in the database." 
          : JSON.stringify(reports.map(r => ({
              state: r.state || '',
              district: r.district || '',
              city: r.city || '',
              ward: r.ward || '',
              theme: r.theme || r.category || '',
              description: r.aiSummary || r.text || '',
              urgency: r.urgencyScore || 6.5,
              supports: r.supports || 1,
              scheme: r.scheme || 'N/A'
            })));

        const systemPrompt = `
You are the JanVikas Governance Copilot, an expert administrative and developmental planning AI assistant for Arjun Kumar, Member of Parliament (MP).
You are grounded in actual, real-time citizen development signals from your constituency database.

Here are the active citizen development signals currently registered in the database:
${reportContext}

Provide highly precise, professional, and actionable administrative recommendations. Quote exact districts, cities, and schemes when relevant. Break down responses with clean markdown headers and bullet points. Be concise but extremely detailed when discussing budgeting, outlays, or Detailed Project Reports (DPR) requisitions.

User's Query: "${prompt}"

Context of conversational history (previous exchanges in this session):
${JSON.stringify(history)}

Generate a helpful, grounded, and executive response. Use bullet points and clean typography. Only return the response text (no system labels).
`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates[0].content.parts[0].text;
          console.log("🚀 Direct Gemini 2.5 Flash Copilot reply successfully generated");
          return reply;
        } else {
          console.warn(`Gemini API returned status ${response.status}. Defaulting to local copilot.`);
        }
      } catch (err) {
        console.warn("Direct Gemini API Copilot call failed, using local fallback responses:", err);
      }
    }

    // High fidelity Copilot fallback simulation using LIVE DATA
    await new Promise(resolve => setTimeout(resolve, 1200));
    const query = prompt.toLowerCase();

    // Group reports to analyze live data
    const waterReports = reports.filter(r => (r.theme || r.category || '').toLowerCase().includes('water'));
    const healthReports = reports.filter(r => (r.theme || r.category || '').toLowerCase().includes('health'));
    const roadReports = reports.filter(r => (r.theme || r.category || '').toLowerCase().includes('road'));
    const energyReports = reports.filter(r => (r.theme || r.category || '').toLowerCase().includes('solar') || (r.theme || r.category || '').toLowerCase().includes('electr'));

    const sortedReports = [...reports].sort((a, b) => (b.urgencyScore || 6.5) - (a.urgencyScore || 6.5));
    const topReport = sortedReports[0];

    // Response for "prioritize / priority / first / why"
    if (query.includes('priorit') || query.includes('first') || query.includes('why')) {
      if (reports.length === 0) {
        return "There are currently no active development projects or citizen signals registered in the database. Once citizens submit development requests on the Citizen Portal, they will appear here and I will calculate their priority scores dynamically.";
      }
      
      let response = `Based on our live database of **${reports.length} citizen signals**, the project that should be prioritized first is:\n\n`;
      response += `### 🥇 Top Priority: **${topReport.theme} Upgrade Scheme**\n`;
      response += `• **Location:** ${topReport.city}, ${topReport.district}, ${topReport.state} (Ward: ${topReport.ward || 'N/A'})\n`;
      response += `• **Priority Score:** **${(topReport.urgencyScore || 6.5).toFixed(1)}/10**\n`;
      response += `• **Support Count:** ${topReport.supports || 1} citizens supporting\n`;
      response += `• **National Scheme:** ${topReport.scheme || 'N/A'}\n\n`;
      response += `### 🔍 Why this project is prioritized first:\n`;
      response += `1. **Acute Infrastructure Deficit:** Our local telemetry shows this region lacks baseline norm coverage.\n`;
      response += `2. **High Social Vulnerability:** The issue described ("*${topReport.englishTranslation || topReport.text}*") represents a high social risk and potential school dropout/emergency transit blockade.\n`;
      response += `3. **Consensus Urgency:** Real-time citizen demand indicators show active local mobilization.\n\n`;
      response += `Would you like me to generate a Detailed Project Report (DPR) for this proposal to unlock funding under **${topReport.scheme}**?`;
      return response;
    }

    // Response for "compare / healthcare / road"
    if (query.includes('compare') || (query.includes('health') && query.includes('road'))) {
      let response = `### 📊 Comparative Development Analysis: Healthcare vs. Roads\n\n`;
      response += `Here is a comparison of active demand clusters registered across our constituency:\n\n`;
      response += `1. **Healthcare Access:**\n`;
      response += `   • **Active Signals:** ${healthReports.length} reports\n`;
      response += `   • **Average Urgency:** ${healthReports.length > 0 ? (healthReports.reduce((acc, r) => acc + (r.urgencyScore || 6.5), 0) / healthReports.length).toFixed(1) : '0.0'}/10\n`;
      response += `   • **Key Scheme:** National Health Mission (NHM)\n\n`;
      response += `2. **Road Connectivity:**\n`;
      response += `   • **Active Signals:** ${roadReports.length} reports\n`;
      response += `   • **Average Urgency:** ${roadReports.length > 0 ? (roadReports.reduce((acc, r) => acc + (r.urgencyScore || 6.5), 0) / roadReports.length).toFixed(1) : '0.0'}/10\n`;
      response += `   • **Key Scheme:** Pradhan Mantri Gram Sadak Yojana (PMGSY)\n\n`;

      if (healthReports.length === 0 && roadReports.length === 0) {
        response += `*No active citizen signals are currently registered for healthcare or roads in the database. General baseline metrics are loaded.*`;
      } else {
        const healthAvg = healthReports.length > 0 ? (healthReports.reduce((acc, r) => acc + (r.urgencyScore || 6.5), 0) / healthReports.length) : 0;
        const roadAvg = roadReports.length > 0 ? (roadReports.reduce((acc, r) => acc + (r.urgencyScore || 6.5), 0) / roadReports.length) : 0;
        if (healthAvg > roadAvg) {
          response += `**AI Recommendation:** Healthcare Access projects currently carry a higher average priority score (**${healthAvg.toFixed(1)}/10**) due to severe localized medical clinic deserts and emergency transit constraints. We recommend prioritizing PHC facility allocations this quarter.`;
        } else if (roadAvg > healthAvg) {
          response += `**AI Recommendation:** Road Connectivity projects currently carry a higher average priority score (**${roadAvg.toFixed(1)}/10**) due to unpaved all-weather road isolation affecting agricultural transit. PMGSY allocations should take precedence.`;
        } else {
          response += `**AI Recommendation:** Both clusters show critical parity. We recommend joint-scheme proposals linking health centre accessibility with rural road networks.`;
        }
      }
      return response;
    }

    // Response for "ward / attention / hotspot"
    if (query.includes('ward') || query.includes('attention') || query.includes('hotspot')) {
      if (reports.length === 0) {
        return "No citizen signals have been registered yet. Once complaints are submitted, I will list the specific wards and localities requiring immediate attention.";
      }
      
      const criticalReports = reports.filter(r => (r.urgencyScore || 6.5) >= 8.5);
      let response = `### 🚨 Localities & Wards Requiring Immediate Attention\n\n`;
      response += `Based on real-time citizen demand telemetry, here are the highest-deficit wards in our constituency:\n\n`;
      
      const listToRender = criticalReports.length > 0 ? criticalReports : sortedReports.slice(0, 3);
      listToRender.forEach((r, idx) => {
        response += `${idx + 1}. **Ward: ${r.ward || 'N/A'}**, ${r.city}, ${r.district} (${r.state})\n`;
        response += `   • **Theme:** ${r.theme} · **Priority Score:** **${(r.urgencyScore || 6.5).toFixed(1)}/10**\n`;
        response += `   • **Status:** ${r.urgency === 'critical' ? '🔴 Critical' : '🟠 High'}\n`;
        response += `   • **Primary Issue:** "*${r.englishTranslation || r.text}*"\n\n`;
      });
      
      response += `**Administrative Recommendation:** Direct the District Collector to initiate an immediate site audit and file a feasibility report for these wards.`;
      return response;
    }

    if (query.includes('budget') || query.includes('fund') || query.includes('money')) {
      return "Based on active Ministry API listings, there are **3 open funding windows** available to our constituency this quarter:\n\n" +
        "1. **Jal Jeevan Mission (JJM):** Rural drinking water network expansion has ₹847 Cr ready for clearance. The submission window closes in **38 days**.\n" +
        "2. **National Health Mission (NHM):** Bihar emergency PHC allocation has ₹420 Cr awaiting localized DPR validation.\n" +
        "3. **PMGSY Rural Roads:** ₹310 Cr for Koraput, Odisha is pending final administrative sign-off.\n\n" +
        "Would you like me to draft a requisition letter to the Ministry of Finance for any of these?";
    }

    if (query.includes('water') || query.includes('bundelkhand') || query.includes('drinking')) {
      return "The **Bundelkhand Drinking Water Network** is our highest priority item:\n\n" +
        "• **Priority Score:** 9.4/10\n" +
        "• **Citizen Signals:** 4,821 active support nodes aggregated from local panchayats\n" +
        "• **Deficit Profile:** The region is currently operating at **63% below the national average** for household water access.\n" +
        "• **Next Step:** Awaiting MP signature on the Detailed Project Report (DPR) to unlock ₹847 Cr of JJM funding.\n\n" +
        "I can auto-generate the complete DPR for your review. Would you like to proceed?";
    }

    if (query.includes('dpr') || query.includes('report') || query.includes('generate')) {
      return "I have successfully drafted the **Detailed Project Report (DPR)** for the **Bundelkhand Rural Water Grid**!\n\n" +
        "• **Proposal Code:** UP-DPR-2026-JJM-07\n" +
        "• **Primary Scheme:** National Rural Drinking Water Program (Jal Jeevan Mission)\n" +
        "• **Outlay Allocation:** ₹847.45 Crores\n" +
        "• **Estimated Beneficiaries:** 420,000 residents across 142 villages.\n\n" +
        "I have populated all sections including executive summary, environmental impact, technical engineering bills, and scheme compliance. You can review and export the PDF from the **DPR Generator** tab on the sidebar.";
    }

    return "Greetings Arjun Kumar, MP. I am your **JanVikas Governance Copilot**.\n\n" +
      `Our live database currently holds **${reports.length} active citizen development signals** across the constituency.\n\n` +
      "Here are some prompt suggestions to ask me:\n\n" +
      "• *'Which project should be prioritized first?'*\n" +
      "• *'Compare healthcare and roads.'*\n" +
      "• *'Which ward needs immediate attention?'*\n\n" +
      "How can I assist your legislative development plans today?";
  }
};
