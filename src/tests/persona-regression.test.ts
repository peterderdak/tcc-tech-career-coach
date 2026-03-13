import { questions, roles, weights } from '../data';
import { computeQuizResults, getRoleResultById } from '../lib/scoring';
import { answersFromLetters } from './helpers';

function runPersona(letters: string[]) {
  return computeQuizResults({
    answers: answersFromLetters(letters),
    questions,
    roles,
    weights
  });
}

describe('persona regressions', () => {
  it('relationship driver persona ranks Sales or Customer Success highly', () => {
    const results = runPersona([
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

    const topTwo = results.ranking.slice(0, 2).map((role) => role.roleId);
    expect(topTwo).toEqual(expect.arrayContaining(['sales']));
  });

  it('process and execution persona ranks Project / Program Management highly', () => {
    const results = runPersona([
      'b',
      'd',
      'b',
      'c',
      'e',
      'c',
      'c',
      'a',
      'a',
      'b',
      'a',
      'a',
      'b',
      'b',
      'b',
      'd',
      'c',
      'b',
      'b',
      'b',
      'c',
      'b',
      'b',
      'c'
    ]);

    expect(results.bestFitRoles[0].roleId).toBe('project_program_management');
  });

  it('quant and detail persona ranks Finance or Accounting highly', () => {
    const results = runPersona([
      'd',
      'c',
      'd',
      'c',
      'd',
      'd',
      'b',
      'd',
      'e',
      'c',
      'd',
      'd',
      'c',
      'e',
      'b',
      'c',
      'd',
      'e',
      'd',
      'd',
      'd',
      'c',
      'd',
      'd'
    ]);

    const topTwo = results.ranking.slice(0, 2).map((role) => role.roleId);
    expect(topTwo.some((roleId) => roleId === 'finance' || roleId === 'accounting')).toBe(true);
  });

  it('systems translator persona ranks Business Systems Analyst highly', () => {
    const results = runPersona([
      'e',
      'e',
      'c',
      'b',
      'c',
      'e',
      'c',
      'c',
      'd',
      'd',
      'b',
      'e',
      'd',
      'c',
      'd',
      'e',
      'e',
      'd',
      'e',
      'e',
      'e',
      'd',
      'e',
      'e'
    ]);

    expect(results.bestFitRoles[0].roleId).toBe('business_systems_analyst');
  });

  it('generalist with PM appeal but thin evidence keeps Product Management as stretch', () => {
    const results = runPersona([
      'c',
      'b',
      'a',
      'd',
      'a',
      'b',
      'c',
      'c',
      'c',
      'c',
      'e',
      'b',
      'e',
      'a',
      'c',
      'b',
      'b',
      'c',
      'c',
      'c',
      'c',
      'e',
      'c',
      'b'
    ]);

    const pmResult = getRoleResultById(results, 'product_management');

    expect(pmResult?.classification).toBe('stretch');
    expect(results.recommendedRoles.some((role) => role.roleId === 'product_management')).toBe(false);
  });
});
