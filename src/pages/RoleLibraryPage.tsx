import { roles } from '../data';

export function RoleLibraryPage() {
  return (
    <div className="container page">
      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Role library</p>
          <h1>What each business-side tech role actually asks from you</h1>
        </div>
        <p>
          These summaries are intentionally practical. They are meant to help you compare target roles
          before you force-fit yourself into a title that sounds good but does not match your current
          signal profile.
        </p>
      </section>
      <div className="stack">
        {roles.map((role) => (
          <details key={role.id} className="panel role-library">
            <summary className="role-library__summary">
              <span>
                <strong>{role.name}</strong>
                <span>{role.shortSummary}</span>
              </span>
              <span className="role-library__meta">{role.difficulty}</span>
            </summary>
            <div className="role-library__content">
              <p>
                <strong>Reality check:</strong> {role.realityCheck}
              </p>
              <p>
                <strong>Common entry titles:</strong> {role.commonEntryTitles.join(', ')}
              </p>
              <p>
                <strong>Difficulty / stretch tendency:</strong> {role.stretchTendency}
              </p>
              <p>{role.detail}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
