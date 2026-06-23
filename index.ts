export type AdminLevel = 'national' | 'state' | 'district' | 'subdistrict' | 'city' | 'ward' | 'constituency';

export interface AdminRegion {
  id: string;
  name: string;
  level: AdminLevel;
  parentId?: string;
  lat: number;
  lng: number;
  zoom: number;
  population: number;
  area: number; // sq km
}

export interface DevelopmentPriority {
  id: string;
  title: string;
  category: 'water' | 'roads' | 'education' | 'health' | 'electricity' | 'sanitation' | 'housing' | 'agriculture';
  priorityScore: number;
  impactScore: number;
  urgencyScore: number;
  confidenceScore: number;
  affectedPopulation: number;
  regionId: string;
  reasoning: string;
  evidence: string[];
  expectedBenefits: string[];
  lat: number;
  lng: number;
}

export interface InfrastructureGap {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedArea: string;
  affectedPopulation: number;
  currentStatus: string;
  regionId: string;
}

export interface CitizenSignal {
  id: string;
  text: string;
  category?: string;
  sentiment: 'urgent' | 'moderate' | 'informational';
  regionId: string;
  timestamp: Date;
  processed: boolean;
  themes: string[];
}

export interface DemographicIndicator {
  regionId: string;
  literacyRate: number;
  accessToWater: number;
  accessToElectricity: number;
  roadConnectivity: number;
  healthcareAccess: number;
  povertyIndex: number;
  populationDensity: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
}

export interface ExecutiveBrief {
  regionName: string;
  generatedAt: Date;
  summary: string;
  topPriorities: DevelopmentPriority[];
  keyFindings: string[];
  recommendedActions: string[];
  criticalGaps: string[];
  populationImpact: number;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AppState {
  selectedRegion: AdminRegion;
  activeModule: 'dashboard' | 'map' | 'copilot' | 'intake' | 'brief';
  priorities: DevelopmentPriority[];
  gaps: InfrastructureGap[];
  signals: CitizenSignal[];
  demographics: DemographicIndicator | null;
  isLoading: boolean;
  briefGenerating: boolean;
  currentBrief: ExecutiveBrief | null;
}
