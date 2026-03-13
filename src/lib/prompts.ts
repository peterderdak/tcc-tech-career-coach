import { EVIDENCE_METADATA } from '../config/evidence';
import type {
  CareerPathGuide,
  PromptTemplate,
  Role,
  RoleResult
} from '../types';

function listOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.join('; ') : fallback;
}

function gapLabels(roleResult: RoleResult): string[] {
  return [
    ...roleResult.gapAnalysis.missingSignals.map((item) => item.label),
    ...roleResult.gapAnalysis.credibilityGaps.map((item) => item.label)
  ];
}

export function buildPromptContext(
  roleResult: RoleResult,
  role: Role,
  guide: CareerPathGuide
): Record<string, string> {
  const missingEvidence = roleResult.missingEvidence.map((tag) => EVIDENCE_METADATA[tag].label);

  return {
    displayRoleName: roleResult.displayName,
    whyThisFits: roleResult.whyThisFits,
    strengths: listOrFallback(
      roleResult.gapAnalysis.strengths.map((item) => item.label),
      'No standout signals identified yet.'
    ),
    missingSignals: listOrFallback(
      roleResult.gapAnalysis.missingSignals.map((item) => item.label),
      'No near-threshold missing signals.'
    ),
    credibilityGaps: listOrFallback(
      [
        ...roleResult.gapAnalysis.credibilityGaps.map((item) => item.label),
        ...missingEvidence
      ],
      'No major credibility gaps detected.'
    ),
    roleSummary: guide.whatTheRoleDoes,
    commonEntryTitles: guide.commonEntryTitles.join(', '),
    storiesToTell: guide.storiesToTell.join('; '),
    keyActions: guide.keyActions.join('; '),
    gapsToClose: listOrFallback(guide.biggestGapsToClose, 'Keep building role-specific evidence.'),
    roleRealityCheck: role.realityCheck
  };
}

export function interpolatePrompt(
  template: PromptTemplate,
  context: Record<string, string>
): string {
  return Object.entries(context).reduce((output, [key, value]) => {
    return output.split(`{{${key}}}`).join(value);
  }, template.template);
}

export function buildPromptSet(input: {
  templates: PromptTemplate[];
  roleResult: RoleResult;
  role: Role;
  guide: CareerPathGuide;
}): Array<{ id: PromptTemplate['id']; title: string; description: string; text: string }> {
  const { templates, roleResult, role, guide } = input;
  const context = buildPromptContext(roleResult, role, guide);

  return templates.map((template) => ({
    id: template.id,
    title: template.title,
    description: template.description,
    text: interpolatePrompt(template, context)
  }));
}
