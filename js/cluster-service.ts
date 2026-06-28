/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { evidenceClustersCol, EvidenceCluster, CitizenSignal, AIAnalysis } from '../firebase/collections';
import { updateEvidenceClusterTransaction } from '../firebase/transactions';
import { ClusterEngine } from '../utils/cluster-engine';

export class ClusterService {
  /**
   * Orchestrates the integration of a single AI analysis into our aggregated Evidence Clusters.
   */
  static async processSignalClustering(
    signalId: string,
    signal: CitizenSignal,
    analysis: AIAnalysis
  ): Promise<string> {
    // 1. Determine optimal cluster using our engine rules
    const clusterId = ClusterEngine.determineCluster(analysis);

    // 2. Execute ACID transaction to safely update counters and merge arrays
    await updateEvidenceClusterTransaction(clusterId, {
      language: signal.detectedLanguage,
      image: (signal.uploadedImages && signal.uploadedImages.length > 0) ? signal.uploadedImages[0] : undefined,
      voice: signal.voiceFile,
      aiSummary: analysis.summary,
      supportedPopulationAddition: 65 // Estimated average population count
    });

    console.log(`[ClusterService] Signal ${signalId} grouped successfully under cluster: ${clusterId}`);
    return clusterId;
  }

  /**
   * Performs an entire scan of all signal/analysis items to completely rebuild clusters.
   * Useful for batch syncs or recovery.
   */
  static async rebuildAllClusters(
    signals: CitizenSignal[],
    analyses: AIAnalysis[]
  ): Promise<void> {
    const clusterGroups: { [key: string]: { signals: CitizenSignal[]; analyses: AIAnalysis[] } } = {};

    analyses.forEach((analysis) => {
      const clusterId = ClusterEngine.determineCluster(analysis);
      const signal = signals.find((s) => s.id === analysis.id);
      if (signal) {
        if (!clusterGroups[clusterId]) {
          clusterGroups[clusterId] = { signals: [], analyses: [] };
        }
        clusterGroups[clusterId].signals.push(signal);
        clusterGroups[clusterId].analyses.push(analysis);
      }
    });

    for (const clusterId of Object.keys(clusterGroups)) {
      const { signals: groupSignals, analyses: groupAnalyses } = clusterGroups[clusterId];
      const aggregated = ClusterEngine.aggregateCluster(clusterId, groupAnalyses, groupSignals);
      
      const clusterRef = doc(evidenceClustersCol, clusterId);
      await setDoc(clusterRef, aggregated);
    }
    console.log('[ClusterService] Fully rebuilt and synchronized all evidence clusters.');
  }
}
