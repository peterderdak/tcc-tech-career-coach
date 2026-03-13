import { DIMENSIONS, DIMENSION_KEYS } from '../config/dimensions';
import { EVIDENCE_METADATA } from '../config/evidence';
import type {
  ContributionInsight,
  DimensionKey,
  EvidenceTag,
  GapAnalysis,
  GapItem,
  QuizResults,
  Question,
  Role,
  RoleClassification,
  RoleResult,
  RoleWeightConfig
} from '../types';

const CLASSIFICATION_PRIORITY: Record<RoleClassification, number> = {
  recommended: 0,
  stretch: 1,
  lower_signal: 2
};

export function createEmptyDimensionRecord(initialValue = 0): Record<DimensionKey, number> {
  return DIMENSION_KEYS.reduce(
    (accumulator, key) => ({ ...accumulator, [key]: initialValue }),
    {} as Record<DimensionKey, number>
  );
}

export function calculateRawDimensions(
  answers: Record<string, string>,
  questions: Question[]
): {
  rawDimensions: Record<DimensionKey, number>;
  evidenceTags: EvidenceTag[];
} {
  const rawDimensions = createEmptyDimensionRecord();
  const evidence = new Set<EvidenceTag>();

  questions.forEach((question) => {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) {
      return;
    }

    const option = question.options.find((candidate) => candidate.id === selectedOptionId);
    if (!option) {
      return;
    }

    DIMENSION_KEYS.forEach((dimension) => {
      rawDimensions[dimension] += option.dimensionPoints[dimension] ?? 0;
    });

    option.evidenceTags?.forEach((tag) => evidence.add(tag));
  });

  return {
    rawDimensions,
    evidenceTags: Array.from(evidence)
  };
}

export function calculateMaxPossibleDimensions(
  questions: Question[]
): Record<DimensionKey, number> {
  const maxPossible = createEmptyDimensionRecord();

  questions.forEach((question) => {
    DIMENSION_KEYS.forEach((dimension) => {
      const questionBest = question.options.reduce((highest, option) => {
        return Math.max(highest, option.dimensionPoints[dimension] ?? 0);
      }, 0);
      maxPossible[dimension] += questionBest;
    });
  });

  return maxPossible;
}

export function normalizeDimensionScores(
  rawDimensions: Record<DimensionKey, number>,
  maxPossibleDimensions: Record<DimensionKey, number>
): Record<DimensionKey, number> {
  const normalized = createEmptyDimensionRecord();

  DIMENSION_KEYS.forEach((dimension) => {
    const raw = rawDimensions[dimension];
    const maximum = maxPossibleDimensions[dimension];
    const score = maximum === 0 ? 0 : Math.round((raw / maximum) * 100);
    normalized[dimension] = Math.max(0, Math.min(100, score));
  });

  return normalized;
}

export function calculateRoleBaseScore(
  normalizedDimensions: Record<DimensionKey, number>,
  config: RoleWeightConfig
): number {
  const weightedTotal = DIMENSION_KEYS.reduce((total, dimension) => {
    return total + normalizedDimensions[dimension] * config.weights[dimension];
  }, 0);

  const totalWeight = DIMENSION_KEYS.reduce((total, dimension) => {
    return total + config.weights[dimension];
  }, 0);

  return totalWeight === 0 ? 0 : Math.round(weightedTotal / totalWeight);
}

function calculateTopContributions(
  normalizedDimensions: Record<DimensionKey, number>,
  config: RoleWeightConfig
): ContributionInsight[] {
  return DIMENSION_KEYS.map((dimension) => {
    const score = normalizedDimensions[dimension];
    const weight = config.weights[dimension];
    return {
      dimension,
      score,
      weight,
      weightedContribution: score * weight
    };
  })
    .filter((contribution) => contribution.weight > 0)
    .sort((left, right) => {
      if (right.weightedContribution !== left.weightedContribution) {
        return right.weightedContribution - left.weightedContribution;
      }

      return right.score - left.score;
    })
    .slice(0, 3);
}

function calculateThresholdMisses(
  normalizedDimensions: Record<DimensionKey, number>,
  config: RoleWeightConfig
): GapItem[] {
  const misses: GapItem[] = [];

  Object.entries(config.targetThresholds).forEach(([dimension, target]) => {
      const typedDimension = dimension as DimensionKey;
      const actual = normalizedDimensions[typedDimension];
      const threshold = target ?? 0;
      const gap = threshold - actual;

      if (gap <= 0) {
        return;
      }

      const criticalTarget = config.criticalThresholds[typedDimension];

      misses.push({
        dimension: typedDimension,
        label: DIMENSIONS[typedDimension].label,
        current: actual,
        target: threshold,
        gap,
        critical: criticalTarget !== undefined,
        reason: `${DIMENSIONS[typedDimension].label} is ${gap} point${gap === 1 ? '' : 's'} below the ${threshold} target.`
      });
    });

  return misses.sort((left, right) => (right.gap ?? 0) - (left.gap ?? 0));
}

function classifyRole(
  baseScore: number,
  config: RoleWeightConfig,
  missedThresholds: GapItem[],
  missingEvidence: EvidenceTag[]
): RoleClassification {
  const criticalMisses = missedThresholds.filter((item) => item.critical);
  const majorCriticalMisses = criticalMisses.filter((item) => (item.gap ?? 0) >= 10);
  const severeCriticalMisses = criticalMisses.filter((item) => (item.gap ?? 0) >= 25);
  const hardGapCount = majorCriticalMisses.length + missingEvidence.length;

  const hasMetAllTargets = missedThresholds.length === 0;

  if (baseScore >= config.recommendedMinScore && hasMetAllTargets && missingEvidence.length === 0) {
    return 'recommended';
  }

  const stretchAllowed =
    baseScore >= config.stretchMinScore &&
    severeCriticalMisses.length === 0 &&
    hardGapCount <= (config.guardedRole ? 4 : 3) &&
    missedThresholds.length <= (config.guardedRole ? 7 : 6);

  return stretchAllowed ? 'stretch' : 'lower_signal';
}

function buildWhyThisFits(roleName: string, topContributions: ContributionInsight[]): string {
  const labels = topContributions.map((item) => DIMENSIONS[item.dimension].label);
  const descriptions = topContributions.map((item) => {
    return DIMENSIONS[item.dimension].description.charAt(0).toLowerCase() +
      DIMENSIONS[item.dimension].description.slice(1);
  });

  return `${roleName} scores well because ${labels.join(', ')} carry a lot of weight here. That points to ${descriptions.join(', and ')}.`;
}

function buildStretchExplanation(
  classification: RoleClassification,
  missedThresholds: GapItem[],
  missingEvidence: EvidenceTag[],
  config: RoleWeightConfig
): string {
  if (classification === 'recommended') {
    return 'This role cleared the current scoring guardrails without a major evidence or threshold miss.';
  }

  const priorityMisses = missedThresholds.slice(0, 2).map((item) => item.reason);
  const evidenceReasons = missingEvidence.slice(0, 2).map((tag) => {
    return `Evidence of ${EVIDENCE_METADATA[tag].label.toLowerCase()} is still thin.`;
  });

  const issues = [...priorityMisses, ...evidenceReasons];

  if (issues.length === 0) {
    return `This role is still marked as a stretch because it sits below the full ${config.recommendedMinScore}-point recommendation bar.`;
  }

  return `This role is a stretch mainly because ${issues.join(' ')}`;
}

function buildGapAdvice(gaps: GapItem[], missingEvidence: EvidenceTag[]): GapAnalysis['advice'] {
  const prioritizedDimensions = gaps
    .map((gap) => gap.dimension)
    .filter((dimension): dimension is DimensionKey => Boolean(dimension));

  missingEvidence.forEach((tag) => {
    const fallbackDimension = EVIDENCE_METADATA[tag].relatedDimensions[0];
    if (!prioritizedDimensions.includes(fallbackDimension)) {
      prioritizedDimensions.push(fallbackDimension);
    }
  });

  const topDimensions = prioritizedDimensions.slice(0, 3);

  return {
    resumePositioning: topDimensions.map((dimension) => DIMENSIONS[dimension].resumeAdvice),
    interviewStoryAngles: topDimensions.map((dimension) => DIMENSIONS[dimension].interviewAdvice),
    skillDevelopmentActions: topDimensions.map((dimension) => DIMENSIONS[dimension].developmentAdvice)
  };
}

export function buildGapAnalysis(
  normalizedDimensions: Record<DimensionKey, number>,
  config: RoleWeightConfig,
  missedThresholds: GapItem[],
  missingEvidence: EvidenceTag[]
): GapAnalysis {
  const strengths: GapItem[] = [];

  Object.entries(config.targetThresholds).forEach(([dimension, target]) => {
      const typedDimension = dimension as DimensionKey;
      const actual = normalizedDimensions[typedDimension];
      const threshold = target ?? 0;

      if (actual < threshold) {
        return;
      }

      strengths.push({
        dimension: typedDimension,
        label: DIMENSIONS[typedDimension].label,
        current: actual,
        target: threshold,
        gap: actual - threshold,
        critical: false,
        reason: `${DIMENSIONS[typedDimension].label} is meeting or exceeding the role target.`
      });
    });

  strengths.sort((left, right) => (right.gap ?? 0) - (left.gap ?? 0));

  const missingSignals = missedThresholds
    .filter((item) => {
      const gap = item.gap ?? 0;
      return gap >= 10 && gap <= 24 && !item.critical;
    })
    .slice(0, 3);

  const credibilityGaps = [
    ...missedThresholds.filter((item) => item.critical && (item.gap ?? 0) >= 10),
    ...missingEvidence.map((tag) => {
      const metadata = EVIDENCE_METADATA[tag];
      return {
        label: metadata.label,
        critical: true,
        reason: `Evidence of ${metadata.label.toLowerCase()} is still missing.`
      } satisfies GapItem;
    })
  ].slice(0, 3);

  const advice = buildGapAdvice([...credibilityGaps, ...missingSignals], missingEvidence);

  return {
    strengths: strengths.slice(0, 3),
    missingSignals,
    credibilityGaps,
    advice
  };
}

function resolveRoleDisplayName(
  role: Role,
  config: RoleWeightConfig,
  normalizedDimensions: Record<DimensionKey, number>,
  evidence: Set<EvidenceTag>
): string {
  if (
    role.id === 'project_program_management' &&
    config.variantLabel &&
    config.variantThresholds &&
    Object.entries(config.variantThresholds).every(([dimension, target]) => {
      return normalizedDimensions[dimension as DimensionKey] >= (target ?? 0);
    }) &&
    (config.variantEvidence ?? []).every((tag) => evidence.has(tag))
  ) {
    return config.variantLabel;
  }

  return role.name;
}

export function buildRoleResult(
  role: Role,
  config: RoleWeightConfig,
  normalizedDimensions: Record<DimensionKey, number>,
  evidenceTags: EvidenceTag[]
): RoleResult {
  const evidence = new Set(evidenceTags);
  const baseScore = calculateRoleBaseScore(normalizedDimensions, config);
  const topContributions = calculateTopContributions(normalizedDimensions, config);
  const missedThresholds = calculateThresholdMisses(normalizedDimensions, config);
  const missingEvidence = config.requiredEvidence.filter((tag) => !evidence.has(tag));
  const classification = classifyRole(baseScore, config, missedThresholds, missingEvidence);

  return {
    roleId: role.id,
    roleName: role.name,
    displayName: resolveRoleDisplayName(role, config, normalizedDimensions, evidence),
    baseScore,
    classification,
    whyThisFits: buildWhyThisFits(role.name, topContributions),
    stretchExplanation: buildStretchExplanation(
      classification,
      missedThresholds,
      missingEvidence,
      config
    ),
    topContributions,
    missedThresholds,
    missingEvidence,
    gapAnalysis: buildGapAnalysis(normalizedDimensions, config, missedThresholds, missingEvidence)
  };
}

function sortRoleResults(left: RoleResult, right: RoleResult): number {
  if (CLASSIFICATION_PRIORITY[left.classification] !== CLASSIFICATION_PRIORITY[right.classification]) {
    return CLASSIFICATION_PRIORITY[left.classification] - CLASSIFICATION_PRIORITY[right.classification];
  }

  if (right.baseScore !== left.baseScore) {
    return right.baseScore - left.baseScore;
  }

  return left.roleName.localeCompare(right.roleName);
}

export function computeQuizResults(input: {
  answers: Record<string, string>;
  questions: Question[];
  roles: Role[];
  weights: RoleWeightConfig[];
}): QuizResults {
  const { answers, questions, roles, weights } = input;
  const { rawDimensions, evidenceTags } = calculateRawDimensions(answers, questions);
  const maxPossibleDimensions = calculateMaxPossibleDimensions(questions);
  const normalizedDimensions = normalizeDimensionScores(rawDimensions, maxPossibleDimensions);

  const roleResults = roles
    .map((role) => {
      const config = weights.find((candidate) => candidate.roleId === role.id);
      if (!config) {
        throw new Error(`Missing weight configuration for role ${role.id}`);
      }

      return buildRoleResult(role, config, normalizedDimensions, evidenceTags);
    })
    .sort(sortRoleResults);

  const recommendedRoles = roleResults.filter((role) => role.classification === 'recommended');
  const stretchRoles = roleResults.filter((role) => role.classification === 'stretch');

  const bestFitRoles = recommendedRoles.length >= 2
    ? recommendedRoles.slice(0, 2)
    : [...recommendedRoles, ...stretchRoles.slice(0, 2 - recommendedRoles.length)];

  const displayedRoleIds = [
    ...new Set([
      ...bestFitRoles.map((role) => role.roleId),
      ...stretchRoles
        .filter((role) => !bestFitRoles.some((candidate) => candidate.roleId === role.roleId))
        .slice(0, 2)
        .map((role) => role.roleId)
    ])
  ];

  return {
    rawDimensions,
    maxPossibleDimensions,
    normalizedDimensions,
    evidenceTags,
    recommendedRoles,
    stretchRoles,
    bestFitRoles,
    displayedRoleIds,
    ranking: roleResults,
    selectedRoleId: displayedRoleIds[0] ?? roleResults[0]?.roleId ?? null,
    answeredCount: Object.keys(answers).length,
    completedAt: new Date().toISOString()
  };
}

export function getRoleResultById(results: QuizResults, roleId: string | null): RoleResult | null {
  if (!roleId) {
    return null;
  }

  return results.ranking.find((role) => role.roleId === roleId) ?? null;
}
