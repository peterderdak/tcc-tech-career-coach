import { roles } from '../data';
import { getRoleWeightConfig } from '../lib/content';
import {
  buildRoleResult,
  calculateRoleBaseScore,
  createEmptyDimensionRecord,
  normalizeDimensionScores
} from '../lib/scoring';

describe('scoring utilities', () => {
  it('normalizes raw dimension scores against the max possible score', () => {
    const raw = createEmptyDimensionRecord();
    const max = createEmptyDimensionRecord();

    raw.communication = 13;
    raw.persuasion = 7;
    max.communication = 20;
    max.persuasion = 10;

    const normalized = normalizeDimensionScores(raw, max);

    expect(normalized.communication).toBe(65);
    expect(normalized.persuasion).toBe(70);
    expect(normalized.technical_comfort).toBe(0);
  });

  it('calculates a weighted role base score', () => {
    const normalized = createEmptyDimensionRecord(0);
    normalized.communication = 80;
    normalized.persuasion = 60;
    normalized.initiative_ownership = 40;

    const config = {
      ...getRoleWeightConfig('sales'),
      weights: {
        ...createEmptyDimensionRecord(0),
        communication: 4,
        persuasion: 2,
        initiative_ownership: 2
      }
    };

    expect(calculateRoleBaseScore(normalized, config)).toBe(65);
  });

  it('keeps product management as stretch when evidence is thin', () => {
    const normalized = createEmptyDimensionRecord(55);
    normalized.customer_empathy = 82;
    normalized.analytical_reasoning = 84;
    normalized.ambiguity_tolerance = 78;
    normalized.cross_functional_collaboration = 81;
    normalized.initiative_ownership = 80;
    normalized.communication = 79;

    const role = roles.find((candidate) => candidate.id === 'product_management');
    const config = getRoleWeightConfig('product_management');

    if (!role) {
      throw new Error('Missing product management role fixture');
    }

    const result = buildRoleResult(role, config, normalized, ['customer_discovery']);

    expect(result.classification).toBe('stretch');
    expect(result.missingEvidence).toEqual(
      expect.arrayContaining(['roadmap_tradeoffs', 'cross_functional_facilitation', 'owns_outcomes'])
    );
  });

  it('recommends product management only when thresholds and evidence are both present', () => {
    const normalized = createEmptyDimensionRecord(65);
    normalized.customer_empathy = 82;
    normalized.analytical_reasoning = 86;
    normalized.ambiguity_tolerance = 79;
    normalized.cross_functional_collaboration = 84;
    normalized.initiative_ownership = 80;
    normalized.communication = 82;

    const role = roles.find((candidate) => candidate.id === 'product_management');
    const config = getRoleWeightConfig('product_management');

    if (!role) {
      throw new Error('Missing product management role fixture');
    }

    const result = buildRoleResult(role, config, normalized, [
      'customer_discovery',
      'roadmap_tradeoffs',
      'cross_functional_facilitation',
      'owns_outcomes'
    ]);

    expect(result.classification).toBe('recommended');
  });
});
