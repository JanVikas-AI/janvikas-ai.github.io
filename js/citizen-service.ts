/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, setDoc } from 'firebase/firestore';
import { citizenSignalsCol, CitizenSignal } from '../firebase/collections';
import { SynchronizationEngine } from '../firebase/sync';
import { OfflineManager } from '../firebase/offline';
import { CitizenReport } from '../types';

export class CitizenService {
  /**
   * Submits a new citizen signal to the platform.
   * Leverages optimistic updates, offline queuing, and real-time backend synchronization.
   */
  static async submitReport(
    payload: {
      type: 'text' | 'voice' | 'image';
      content: string;
      mediaBase64?: string;
      mediaMimeType?: string;
      userLocation: {
        state: string;
        district: string;
        city?: string;
        panchayat?: string;
        ward?: string;
        lat: number;
        lng: number;
        address?: string;
      };
    },
    onOptimisticUpdate?: (optimisticReport: CitizenReport) => void
  ): Promise<CitizenReport> {
    const tempId = `sig_opt_${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString();

    // Map input payload to standard Firestore CitizenSignal document schema
    const signal: CitizenSignal = {
      originalText: payload.content,
      translatedText: payload.content, // Handled by Gemini on sync, fallback to original
      detectedLanguage: 'English',     // Handled by Gemini on sync, fallback to English
      voiceFile: payload.type === 'voice' ? payload.mediaBase64 : undefined,
      uploadedImages: payload.type === 'image' && payload.mediaBase64 ? [payload.mediaBase64] : [],
      coordinates: {
        lat: payload.userLocation.lat,
        lng: payload.userLocation.lng
      },
      state: payload.userLocation.state,
      district: payload.userLocation.district,
      city: payload.userLocation.city || '',
      ward: payload.userLocation.ward || '',
      submissionTimestamp: nowStr,
      anonymousSessionId: `session_${Math.floor(Math.random() * 1000000)}`
    };

    // 1. Trigger Optimistic Update Callback (Immediate UI responsiveness)
    if (onOptimisticUpdate) {
      const optimisticReport: CitizenReport = {
        id: tempId,
        type: payload.type,
        title: payload.content.substring(0, 45) + ' (Processing...)',
        description: payload.content,
        imageUrl: payload.type === 'image' && payload.mediaBase64 ? `data:${payload.mediaMimeType || 'image/png'};base64,${payload.mediaBase64}` : undefined,
        timestamp: nowStr,
        category: 'Other',
        priority: 'Medium',
        priorityScore: 50,
        status: 'Submitted',
        location: {
          ...payload.userLocation,
          constituency: 'Local Assembly Constituency',
        },
        aiAnalysis: {
          summary: 'Submitting signal... Processing real-time AI Analysis.',
          impactScore: 5,
          sentiment: 'Queued',
          recommendedAction: 'Standby for automated Gemini routing...',
          estimatedBudgetRange: '₹30,000 - ₹90,000',
          timelineDays: 7
        }
      };
      onOptimisticUpdate(optimisticReport);
    }

    // 2. Queue signal offline or upload directly via SyncEngine
    const syncResult = await SynchronizationEngine.queueOrUploadSignal(signal);

    // 3. Trigger network-backed real-time Gemini processing if device is online
    if (OfflineManager.getNetworkStatus()) {
      try {
        console.log('[CitizenService] Triggering online Gemini analysis flow...');
        const res = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            signalId: syncResult.id // Bind custom ID so backend writes cleanly to Firestore
          })
        });

        if (res.ok) {
          const finishedReport = await res.json();
          console.log('[CitizenService] Online Gemini analysis succeeded:', finishedReport);
          return finishedReport;
        } else {
          console.warn('[CitizenService] Gemini service endpoint returned an error status.');
        }
      } catch (err) {
        console.error('[CitizenService] API communication error during analyze-report:', err);
      }
    }

    // 4. Fallback: If device is offline or API fails, return a clean queued report status
    return {
      id: syncResult.id,
      type: payload.type,
      title: payload.content.substring(0, 45) + ' (Offline Queued)',
      description: payload.content,
      imageUrl: payload.type === 'image' && payload.mediaBase64 ? `data:${payload.mediaMimeType || 'image/png'};base64,${payload.mediaBase64}` : undefined,
      timestamp: nowStr,
      category: 'Other',
      priority: 'Medium',
      priorityScore: 50,
      status: 'Submitted',
      location: {
        ...payload.userLocation,
        constituency: 'Local Assembly Constituency',
      },
      aiAnalysis: {
        summary: 'Your report has been securely saved in local offline cache. It will automatically synchronize and undergo AI processing once your internet connection is restored.',
        impactScore: 5,
        sentiment: 'Queued (Offline)',
        recommendedAction: 'Keep application open to ensure automatic syncing.',
        estimatedBudgetRange: '₹30,000 - ₹90,000',
        timelineDays: 7
      }
    };
  }
}
