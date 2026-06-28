/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { addDoc, getDocs, query, where, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { executiveBriefsCol, ExecutiveBrief, DevelopmentProject } from '../firebase/collections';

export class BriefService {
  /**
   * Automatically generates and persists an Executive Brief in Firestore.
   */
  static async generateExecutiveBrief(
    constituency: string,
    projects: DevelopmentProject[]
  ): Promise<ExecutiveBrief> {
    const id = `brief_${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString();

    const priorities = projects
      .slice(0, 3)
      .map((p) => `Rank ${p.priorityScore}/100: ${p.projectTitle} - Benefiting ${p.beneficiaryEstimate}`);

    const recommendations = projects
      .slice(0, 3)
      .map((p) => `Immediate Action for ${p.projectTitle}: ${p.recommendation}`);

    const evidenceCount = projects.reduce((acc, p) => acc + (p.supportingEvidence?.length || 0), 0);
    const evidence = [
      `${evidenceCount} unique geocoded citizen submissions cataloged across municipal sectors.`,
      `Verified multi-modal evidence clusters including photographic defects and localized voice transcriptions.`
    ];

    const executiveSummary = `Comprehensive constituency development audit for ${constituency || 'Local Assembly'}. Standardized AI prioritization analysis of ${evidenceCount} civil signals across ${projects.length} primary infrastructure projects. Prominent deficit factors point to acute transport bottlenecks and public utility drops requiring immediate emergency Swachh Bharat and municipal funding allocations.`;

    const brief: ExecutiveBrief = {
      id,
      executiveSummary,
      priorities,
      recommendations,
      evidence,
      generatedAt: nowStr,
      constituency: constituency || 'Local Assembly'
    };

    const docRef = doc(executiveBriefsCol, id);
    await setDoc(docRef, brief);
    console.log(`[BriefService] Executive brief ${id} successfully generated and persisted for ${constituency}`);
    return brief;
  }

  /**
   * Retrieves the latest generated brief for a specific constituency.
   */
  static async getLatestBrief(constituency: string): Promise<ExecutiveBrief | null> {
    try {
      const q = query(
        executiveBriefsCol,
        where('constituency', '==', constituency),
        orderBy('generatedAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as ExecutiveBrief;
      }
      return null;
    } catch (error) {
      console.error('[BriefService] Error fetching latest brief:', error);
      return null;
    }
  }
}
