import { careerPaths, promptTemplates, questions, roles, weights } from '../data';
import { DIMENSION_KEYS } from '../config/dimensions';

const SUPPORTED_ROLE_IDS = [
  'sales',
  'sales_engineering',
  'project_program_management',
  'product_management',
  'finance',
  'accounting',
  'customer_success',
  'business_systems_analyst'
];

describe('data integrity', () => {
  it('keeps the supported role ids stable', () => {
    expect(roles.map((role) => role.id)).toEqual(SUPPORTED_ROLE_IDS);
    expect(weights.map((config) => config.roleId)).toEqual(SUPPORTED_ROLE_IDS);
    expect(careerPaths.map((guide) => guide.roleId)).toEqual(SUPPORTED_ROLE_IDS);
  });

  it('keeps exactly 24 questions with 5 options each', () => {
    expect(questions).toHaveLength(24);
    questions.forEach((question) => {
      expect(question.options).toHaveLength(5);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(5);
    });
  });

  it('uses only supported dimension keys in weights and question mappings', () => {
    const dimensionSet = new Set(DIMENSION_KEYS);

    weights.forEach((config) => {
      expect(Object.keys(config.weights).sort()).toEqual([...DIMENSION_KEYS].sort());
      Object.keys(config.targetThresholds).forEach((dimension) => {
        expect(dimensionSet.has(dimension as (typeof DIMENSION_KEYS)[number])).toBe(true);
      });
    });

    questions.forEach((question) => {
      question.options.forEach((option) => {
        Object.keys(option.dimensionPoints).forEach((dimension) => {
          expect(dimensionSet.has(dimension as (typeof DIMENSION_KEYS)[number])).toBe(true);
        });
      });
    });
  });

  it('keeps required prompt templates intact', () => {
    expect(promptTemplates.map((template) => template.id)).toEqual([
      'resume_rewrite',
      'linkedin_summary_rewrite',
      'star_story_generation',
      'interview_prep',
      'skill_development_roadmap'
    ]);
  });
});
