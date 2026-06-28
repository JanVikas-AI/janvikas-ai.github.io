/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import {
  citizenSignalsCol,
  aiAnalysisCol,
  developmentProjectsCol,
  evidenceClustersCol,
  CitizenSignal,
  AIAnalysis,
  DevelopmentProject,
  EvidenceCluster
} from '../firebase/collections';
import {
  subscribeToCitizenSignals,
  subscribeToDevelopmentProjects,
  subscribeToEvidenceClusters
} from '../firebase/listeners';
import { CitizenReport, DevelopmentRecommendation } from '../types';

export class DashboardService {
  /**
   * Translates database CitizenSignal & AIAnalysis pairings into the core CitizenReport UI model.
   */
  static mapToCitizenReport(signal: CitizenSignal, analysis?: AIAnalysis): CitizenReport {
    const id = signal.id || '';
    const type: CitizenReport['type'] = signal.voiceFile ? 'voice' : (signal.uploadedImages && signal.uploadedImages.length > 0) ? 'image' : 'text';

    // Extract image format base64 check
    let imageUrl = undefined;
    if (signal.uploadedImages && signal.uploadedImages.length > 0) {
      imageUrl = signal.uploadedImages[0];
      if (imageUrl && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http')) {
        imageUrl = `data:image/png;base64,${imageUrl}`;
      }
    }

    let audioUrl = undefined;
    if (signal.voiceFile) {
      audioUrl = signal.voiceFile;
      if (audioUrl && !audioUrl.startsWith('data:') && !audioUrl.startsWith('http')) {
        audioUrl = `data:audio/wav;base64,${audioUrl}`;
      }
    }

    const category = (analysis?.infrastructureCategory || 'Other') as CitizenReport['category'];
    const priority = (analysis?.urgency || 'Medium') as CitizenReport['priority'];
    
    let priorityScore = 65;
    if (priority === 'Critical') priorityScore = 95;
    else if (priority === 'High') priorityScore = 82;
    else if (priority === 'Medium') priorityScore = 65;
    else if (priority === 'Low') priorityScore = 40;

    let impactScore = 6;
    if (priority === 'Critical') impactScore = 9;
    else if (priority === 'High') impactScore = 8;
    else if (priority === 'Medium') impactScore = 6;
    else if (priority === 'Low') impactScore = 3;

    return {
      id,
      type,
      title: analysis?.summary ? (analysis.summary.substring(0, 45) + '...') : (signal.originalText.substring(0, 45) + '...'),
      description: signal.translatedText || signal.originalText,
      imageUrl,
      audioUrl,
      timestamp: signal.submissionTimestamp,
      category,
      priority,
      priorityScore,
      status: 'Submitted', // Read-only consumer status, defaults to submitted
      location: {
        state: signal.state,
        district: signal.district,
        city: signal.city || undefined,
        ward: signal.ward || undefined,
        constituency: 'Local Assembly Constituency',
        lat: signal.coordinates.lat,
        lng: signal.coordinates.lng,
        address: `${signal.ward || ''}, ${signal.district || ''}, ${signal.state || ''}`
      },
      aiAnalysis: analysis ? {
        summary: analysis.explanation || analysis.summary,
        similarityClusterId: analysis.similarityCluster,
        impactScore,
        sentiment: `${signal.detectedLanguage} / ${priority}`,
        recommendedAction: analysis.priorityContribution,
        estimatedBudgetRange: '₹1,50,000 - ₹3,50,000',
        timelineDays: priority === 'Critical' ? 3 : 7
      } : undefined
    };
  }

  /**
   * Translates a Firestore DevelopmentProject document into the standard DevelopmentRecommendation UI model.
   */
  static mapToRecommendation(project: DevelopmentProject, id: string): DevelopmentRecommendation {
    const urgency: 'Immediate' | 'Short-Term' | 'Medium-Term' = 
      project.priorityScore >= 90 ? 'Immediate' : project.priorityScore >= 75 ? 'Short-Term' : 'Medium-Term';

    // Parse category from infrastructureGap
    let category = 'Other';
    const gap = (project.infrastructureGap || '').toLowerCase();
    if (gap.includes('road')) category = 'Roads & Transport';
    else if (gap.includes('water')) category = 'Water Supply';
    else if (gap.includes('waste') || gap.includes('sanitation')) category = 'Sanitation & Waste';
    else if (gap.includes('power') || gap.includes('electri')) category = 'Electricity & Power';
    else if (gap.includes('light') || gap.includes('safe')) category = 'Safety & Lighting';
    else if (gap.includes('health')) category = 'Public Health';
    else if (gap.includes('educat')) category = 'Education & Facilities';

    return {
      id: project.id || id,
      title: project.projectTitle,
      primaryCategory: category,
      urgency,
      priorityScore: project.priorityScore,
      reportCount: project.supportingEvidence?.length || 1,
      details: project.recommendation,
      benefits: project.explainability,
      locationName: project.infrastructureGap || 'Constituency Ward Grid',
      costEstimation: project.beneficiaryEstimate || '₹1,20,000 - ₹3,50,000'
    };
  }

  /**
   * Live streaming dashboard listener connecting Firestore directly to React states.
   */
  static listenToDashboardMetrics(
    onReportsUpdate: (reports: CitizenReport[]) => void,
    onRecommendationsUpdate: (recs: DevelopmentRecommendation[]) => void
  ) {
    let cachedSignals: CitizenSignal[] = [];
    let cachedAnalyses: AIAnalysis[] = [];

    const triggerMerge = () => {
      const mappedReports = cachedSignals.map((signal) => {
        const analysis = cachedAnalyses.find((a) => a.id === signal.id);
        return this.mapToCitizenReport(signal, analysis);
      });
      onReportsUpdate(mappedReports);
    };

    // Subscribes to real-time collections
    const unsubSignals = subscribeToCitizenSignals((signals) => {
      cachedSignals = signals;
      triggerMerge();
    });

    const unsubProjects = subscribeToDevelopmentProjects((projects) => {
      const mappedRecs = projects.map((p, index) => this.mapToRecommendation(p, p.id || `rec_${index}`));
      onRecommendationsUpdate(mappedRecs);
    });

    // Subscribes to real-time AI analyses
    const unsubAnalyses = onSnapshot(aiAnalysisCol, (snapshot) => {
      cachedAnalyses = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AIAnalysis[];
      triggerMerge();
    }, (error) => {
      console.error('[Firebase Listeners] Error in live listener for aiAnalysis:', error);
    });

    // Return combined unsubscribe hook
    return () => {
      unsubSignals();
      unsubProjects();
      unsubAnalyses();
    };
  }
}
