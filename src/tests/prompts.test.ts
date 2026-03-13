import { promptTemplates, questions, roles, weights } from '../data';
import { getCareerPathGuide, getRoleById } from '../lib/content';
import { buildPromptContext, buildPromptSet, interpolatePrompt } from '../lib/prompts';
import { computeQuizResults } from '../lib/scoring';
import { answersFromLetters } from './helpers';

describe('prompt interpolation', () => {
  it('replaces placeholders with selected role context', () => {
    const answers = answersFromLetters([
      'a',
      'b',
      'e',
      'e',
      'a',
      'a',
      'a',
      'e',
      'a',
      'a',
      'c',
      'b',
      'a',
      'd',
      'a',
      'a',
      'a',
      'a',
      'a',
      'a',
      'c',
      'a',
      'a',
      'a'
    ]);

    const results = computeQuizResults({
      answers,
      questions,
      roles,
      weights
    });

    const selectedRole = results.bestFitRoles[0];
    const role = getRoleById(selectedRole.roleId);
    const guide = getCareerPathGuide(selectedRole.roleId);
    const template = promptTemplates[0];
    const context = buildPromptContext(selectedRole, role, guide);
    const output = interpolatePrompt(template, context);

    expect(output).toContain(selectedRole.displayName);
    expect(output).toContain(guide.whatTheRoleDoes);
    expect(output).not.toContain('{{displayRoleName}}');
  });

  it('builds all required prompt types', () => {
    const answers = answersFromLetters(new Array(24).fill('b'));
    const results = computeQuizResults({
      answers,
      questions,
      roles,
      weights
    });

    const selectedRole = results.ranking[0];
    const promptSet = buildPromptSet({
      templates: promptTemplates,
      roleResult: selectedRole,
      role: getRoleById(selectedRole.roleId),
      guide: getCareerPathGuide(selectedRole.roleId)
    });

    expect(promptSet).toHaveLength(5);
    expect(promptSet.map((item) => item.id)).toEqual([
      'resume_rewrite',
      'linkedin_summary_rewrite',
      'star_story_generation',
      'interview_prep',
      'skill_development_roadmap'
    ]);
  });
});
