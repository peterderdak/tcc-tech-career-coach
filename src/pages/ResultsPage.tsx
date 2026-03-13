import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../app/AppContext';
import { promptTemplates, questions, roles, weights } from '../data';
import { BarMeter } from '../components/BarMeter';
import { PromptCard } from '../components/PromptCard';
import { RoleSummaryCard } from '../components/RoleSummaryCard';
import { DIMENSION_KEYS, DIMENSIONS } from '../config/dimensions';
import { buildPromptSet } from '../lib/prompts';
import { getCareerPathGuide, getRoleById } from '../lib/content';
import { computeQuizResults, getRoleResultById } from '../lib/scoring';

export function ResultsPage() {
  const { state, dispatch } = useAppContext();
  const answersComplete = Object.keys(state.answers).length === questions.length;

  useEffect(() => {
    if (!state.latestResults && answersComplete) {
      const results = computeQuizResults({
        answers: state.answers,
        questions,
        roles,
        weights
      });

      dispatch({
        type: 'set_results',
        results
      });
    }
  }, [answersComplete, dispatch, state.answers, state.latestResults]);

  if (!state.latestResults && !answersComplete) {
    return <Navigate to="/quiz" replace />;
  }

  const results =
    state.latestResults ??
    computeQuizResults({
      answers: state.answers,
      questions,
      roles,
      weights
    });

  const stretchShowcase = results.stretchRoles
    .filter((roleResult) => !results.bestFitRoles.some((candidate) => candidate.roleId === roleResult.roleId))
    .slice(0, 2);

  const selectableRoles = results.displayedRoleIds
    .map((roleId) => getRoleResultById(results, roleId))
    .filter((roleResult): roleResult is NonNullable<typeof roleResult> => Boolean(roleResult));

  const selectedRole =
    getRoleResultById(results, results.selectedRoleId) ??
    selectableRoles[0] ??
    results.ranking[0];

  const selectedRoleMetadata = getRoleById(selectedRole.roleId);
  const selectedGuide = getCareerPathGuide(selectedRole.roleId);
  const prompts = buildPromptSet({
    templates: promptTemplates,
    roleResult: selectedRole,
    role: selectedRoleMetadata,
    guide: selectedGuide
  });

  return (
    <div className="container page">
      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Results summary</p>
          <h1>Your strongest current-fit signals</h1>
        </div>
        <p>
          These results are directional, transparent, and intentionally conservative for guarded roles.
          They are designed to help you target believable entry points, not guarantee hiring outcomes.
        </p>
      </section>

      <section className="results-grid">
        <div className="results-grid__main">
          <section>
            <div className="section-heading">
              <h2>Best-fit roles</h2>
            </div>
            <div className="card-grid">
              {results.bestFitRoles.map((roleResult) => (
                <RoleSummaryCard
                  key={roleResult.roleId}
                  roleResult={roleResult}
                  active={selectedRole.roleId === roleResult.roleId}
                  onSelect={() =>
                    dispatch({
                      type: 'set_selected_role',
                      roleId: roleResult.roleId
                    })
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <div className="section-heading">
              <h2>Stretch roles</h2>
            </div>
            {stretchShowcase.length > 0 ? (
              <div className="card-grid">
                {stretchShowcase.map((roleResult) => (
                  <RoleSummaryCard
                    key={roleResult.roleId}
                    roleResult={roleResult}
                    active={selectedRole.roleId === roleResult.roleId}
                    onSelect={() =>
                      dispatch({
                        type: 'set_selected_role',
                        roleId: roleResult.roleId
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <article className="panel">
                <p>
                  No additional stretch roles rose above the current threshold. That usually means your
                  profile is already more focused than broad.
                </p>
              </article>
            )}
          </section>

          <section className="panel">
            <div className="section-heading">
              <h2>Selected role detail</h2>
            </div>
            <div className="tab-row" role="tablist" aria-label="Displayed roles">
              {selectableRoles.map((roleResult) => (
                <button
                  key={roleResult.roleId}
                  type="button"
                  role="tab"
                  aria-selected={selectedRole.roleId === roleResult.roleId}
                  className={`tab-row__tab ${
                    selectedRole.roleId === roleResult.roleId ? 'tab-row__tab--active' : ''
                  }`}
                  onClick={() =>
                    dispatch({
                      type: 'set_selected_role',
                      roleId: roleResult.roleId
                    })
                  }
                >
                  {roleResult.displayName}
                </button>
              ))}
            </div>
            <div className="detail-grid">
              <article>
                <h3>Top strengths</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.strengths.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}:</strong> {item.reason}
                    </li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Missing signals</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.missingSignals.length > 0 ? (
                    selectedRole.gapAnalysis.missingSignals.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}:</strong> {item.reason}
                      </li>
                    ))
                  ) : (
                    <li>No near-threshold signals are currently lagging by 10 to 24 points.</li>
                  )}
                </ul>
              </article>
              <article>
                <h3>Credibility gaps</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.credibilityGaps.length > 0 ? (
                    selectedRole.gapAnalysis.credibilityGaps.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}:</strong> {item.reason}
                      </li>
                    ))
                  ) : (
                    <li>No major credibility gaps surfaced for this role.</li>
                  )}
                </ul>
              </article>
            </div>
            <div className="detail-grid">
              <article>
                <h3>Resume positioning</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.advice.resumePositioning.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Interview story angles</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.advice.interviewStoryAngles.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Skill-development actions</h3>
                <ul className="plain-list">
                  {selectedRole.gapAnalysis.advice.skillDevelopmentActions.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <h2>Career path guide</h2>
            </div>
            <div className="detail-grid">
              <article>
                <h3>What the role actually does</h3>
                <p>{selectedGuide.whatTheRoleDoes}</p>
                <h3>Common entry titles</h3>
                <p>{selectedGuide.commonEntryTitles.join(', ')}</p>
              </article>
              <article>
                <h3>Strengths to emphasize</h3>
                <ul className="plain-list">
                  {selectedGuide.strengthsToEmphasize.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Stories to tell</h3>
                <ul className="plain-list">
                  {selectedGuide.storiesToTell.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Biggest gaps to close</h3>
                <ul className="plain-list">
                  {selectedGuide.biggestGapsToClose.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Key actions</h3>
                <ul className="plain-list">
                  {selectedGuide.keyActions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section>
            <div className="section-heading">
              <h2>AI prompt generator</h2>
            </div>
            <div className="card-grid">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  title={prompt.title}
                  description={prompt.description}
                  text={prompt.text}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="results-grid__side">
          <section className="panel">
            <div className="section-heading">
              <h2>Full role ranking</h2>
            </div>
            <div className="stack">
              {results.ranking.map((roleResult) => (
                <div key={roleResult.roleId}>
                  <BarMeter
                    label={`${roleResult.displayName} (${roleResult.classification.replace('_', ' ')})`}
                    value={roleResult.baseScore}
                    tone={roleResult.classification === 'recommended' ? 'recommended' : roleResult.classification === 'stretch' ? 'stretch' : 'default'}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <h2>Dimension profile</h2>
            </div>
            <div className="stack">
              {DIMENSION_KEYS.map((dimension) => (
                <BarMeter
                  key={dimension}
                  label={DIMENSIONS[dimension].label}
                  value={results.normalizedDimensions[dimension]}
                />
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Next move</h2>
            <p>
              Want to refine your answer pattern or compare a different profile? The quiz keeps your
              progress locally and can be reset anytime.
            </p>
            <div className="stack">
              <Link className="button" to="/quiz">
                Revisit quiz
              </Link>
              <Link className="button button--ghost" to="/methodology">
                Review methodology
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
