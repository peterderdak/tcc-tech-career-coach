export type RoleId =
  | 'sales'
  | 'sales_engineering'
  | 'project_program_management'
  | 'product_management'
  | 'finance'
  | 'accounting'
  | 'customer_success'
  | 'business_systems_analyst';

export type DimensionKey =
  | 'communication'
  | 'persuasion'
  | 'analytical_reasoning'
  | 'quantitative_comfort'
  | 'detail_orientation'
  | 'customer_empathy'
  | 'process_thinking'
  | 'execution_discipline'
  | 'cross_functional_collaboration'
  | 'ambiguity_tolerance'
  | 'technical_comfort'
  | 'systems_thinking'
  | 'initiative_ownership'
  | 'presentation_comfort';

export type EvidenceTag =
  | 'client_facing'
  | 'closes_with_confidence'
  | 'owns_outcomes'
  | 'customer_discovery'
  | 'roadmap_tradeoffs'
  | 'cross_functional_facilitation'
  | 'technical_translation'
  | 'technical_debugging'
  | 'builds_process'
  | 'structured_delivery'
  | 'financial_modeling'
  | 'controls_accuracy'
  | 'system_configuration'
  | 'workflow_optimization'
  | 'executive_presentations'
  | 'stakeholder_coordination'
  | 'renewal_expansion';

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  dimensionPoints: Partial<Record<DimensionKey, number>>;
  evidenceTags?: EvidenceTag[];
}

export interface Question {
  id: string;
  prompt: string;
  promptShort: string;
  options: QuestionOption[];
}

export interface Role {
  id: RoleId;
  name: string;
  shortSummary: string;
  realityCheck: string;
  commonEntryTitles: string[];
  difficulty: string;
  stretchTendency: string;
  detail: string;
  emphasisDimensions: DimensionKey[];
}

export interface RoleWeightConfig {
  roleId: RoleId;
  weights: Record<DimensionKey, number>;
  targetThresholds: Partial<Record<DimensionKey, number>>;
  criticalThresholds: Partial<Record<DimensionKey, number>>;
  requiredEvidence: EvidenceTag[];
  recommendedMinScore: number;
  stretchMinScore: number;
  guardedRole?: boolean;
  variantLabel?: string;
  variantThresholds?: Partial<Record<DimensionKey, number>>;
  variantEvidence?: EvidenceTag[];
}

export interface CareerPathGuide {
  roleId: RoleId;
  whatTheRoleDoes: string;
  commonEntryTitles: string[];
  strengthsToEmphasize: string[];
  storiesToTell: string[];
  biggestGapsToClose: string[];
  keyActions: string[];
}

export interface PromptTemplate {
  id:
    | 'resume_rewrite'
    | 'linkedin_summary_rewrite'
    | 'star_story_generation'
    | 'interview_prep'
    | 'skill_development_roadmap';
  title: string;
  description: string;
  template: string;
}

export interface ContributionInsight {
  dimension: DimensionKey;
  score: number;
  weight: number;
  weightedContribution: number;
}

export interface GapItem {
  dimension?: DimensionKey;
  label: string;
  current?: number;
  target?: number;
  gap?: number;
  critical: boolean;
  reason: string;
}

export interface AdviceBundle {
  resumePositioning: string[];
  interviewStoryAngles: string[];
  skillDevelopmentActions: string[];
}

export interface GapAnalysis {
  strengths: GapItem[];
  missingSignals: GapItem[];
  credibilityGaps: GapItem[];
  advice: AdviceBundle;
}

export type RoleClassification = 'recommended' | 'stretch' | 'lower_signal';

export interface RoleResult {
  roleId: RoleId;
  roleName: string;
  displayName: string;
  baseScore: number;
  classification: RoleClassification;
  whyThisFits: string;
  stretchExplanation: string;
  topContributions: ContributionInsight[];
  missedThresholds: GapItem[];
  missingEvidence: EvidenceTag[];
  gapAnalysis: GapAnalysis;
}

export interface QuizResults {
  rawDimensions: Record<DimensionKey, number>;
  maxPossibleDimensions: Record<DimensionKey, number>;
  normalizedDimensions: Record<DimensionKey, number>;
  evidenceTags: EvidenceTag[];
  recommendedRoles: RoleResult[];
  stretchRoles: RoleResult[];
  bestFitRoles: RoleResult[];
  displayedRoleIds: RoleId[];
  ranking: RoleResult[];
  selectedRoleId: RoleId | null;
  answeredCount: number;
  completedAt: string;
}

export interface AppState {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  latestResults: QuizResults | null;
  contentVersion: string;
}

export type AppAction =
  | { type: 'rehydrate'; payload: AppState }
  | { type: 'answer'; questionId: string; optionId: string }
  | { type: 'go_to'; index: number }
  | { type: 'set_results'; results: QuizResults }
  | { type: 'set_selected_role'; roleId: RoleId }
  | { type: 'reset' };
