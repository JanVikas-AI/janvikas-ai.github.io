/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { developmentProjectsCol, CitizenSignal, AIAnalysis, citizenSignalsCol, aiAnalysisCol } from '../firebase/collections';
import { updateDevelopmentProjectTransaction } from '../firebase/transactions';
import { PriorityEngine } from '../utils/priority-engine';
import { ClusterEngine } from '../utils/cluster-engine';

export class PriorityService {
  /**
   * Recalculates priority scores and updates or provisions a Development Project.
   */
  static async updateProjectForCluster(
    clusterId: string,
    signalsInCluster: CitizenSignal[],
    analysesInCluster: AIAnalysis[]
  ): Promise<void> {
    const projectId = `proj_${clusterId.replace('cluster_', '')}`;
    const projectTitle = `${ClusterEngine.getClusterName(clusterId)} Renewal Project`;

    // Calculate updated metrics using the modular priority engine
    const projectUpdate = PriorityEngine.refreshProject(
      projectId,
      projectTitle,
      signalsInCluster,
      analysesInCluster
    );

    // Apply transaction to update project atomically
    await updateDevelopmentProjectTransaction(projectId, {
      id: projectId,
      ...projectUpdate
    });

    console.log(`[PriorityService] Recalculated priority and updated project: ${projectId} (Score: ${projectUpdate.priorityScore})`);
  }

  /**
   * Triggers a global priority review across all clusters.
   */
  static async triggerGlobalPriorityRevaluation(): Promise<void> {
    // 1. Fetch all signals and analyses
    const signalsSnap = await getDocs(citizenSignalsCol);
    const analysesSnap = await getDocs(aiAnalysisCol);

    const signals = signalsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as CitizenSignal[];
    const analyses = analysesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as AIAnalysis[];

    // Group by cluster
    const clusterMap: { [key: string]: { signals: CitizenSignal[]; analyses: AIAnalysis[] } } = {};

    analyses.forEach((analysis) => {
      const clusterId = analysis.similarityCluster || ClusterEngine.determineCluster(analysis);
      const signal = signals.find((s) => s.id === analysis.id);
      if (signal) {
        if (!clusterMap[clusterId]) {
          clusterMap[clusterId] = { signals: [], analyses: [] };
        }
        clusterMap[clusterId].signals.push(signal);
        clusterMap[clusterId].analyses.push(analysis);
      }
    });

    // Revalue each cluster
    for (const clusterId of Object.keys(clusterMap)) {
      const { signals: sList, analyses: aList } = clusterMap[clusterId];
      await this.updateProjectForCluster(clusterId, sList, aList);
    }
  }
}
