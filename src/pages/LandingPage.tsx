import { Link } from 'react-router-dom';
import { roles } from '../data';

export function LandingPage() {
  return (
    <div className="page">
      <section className="hero container">
        <div className="hero__content">
          <p className="eyebrow">Deterministic career fit guidance for business-side tech roles</p>
          <h1>TCC helps early-career talent find credible paths into tech without overhyping glamorous jobs.</h1>
          <p className="hero__lede">
            Take a 24-question browser-only quiz to see which business-side roles in tech fit your
            current strengths, where your signals are still thin, and what prompts you can paste into
            your own AI tool to tighten your positioning.
          </p>
          <div className="hero__actions">
            <Link className="button" to="/quiz">
              Start quiz
            </Link>
            <Link className="button button--ghost" to="/roles">
              Explore roles
            </Link>
            <Link className="button button--ghost" to="/methodology">
              Methodology
            </Link>
          </div>
        </div>
        <aside className="panel hero__aside">
          <h2>How it works</h2>
          <ol className="number-list">
            <li>Answer one question at a time across 24 work-style scenarios.</li>
            <li>See normalized dimension scores, guarded role logic, and full ranking transparency.</li>
            <li>Use the generated prompts to improve resumes, STAR stories, and interview prep.</li>
          </ol>
          <p className="callout">
            Product Management, Sales Engineering, and TPM-leaning paths are intentionally guarded.
            The app does not default to recommending them without stronger evidence.
          </p>
          <p className="privacy-note">Privacy note: everything stays in your browser. Nothing is sent anywhere.</p>
        </aside>
      </section>

      <section className="container section-grid">
        <article className="panel">
          <h2>Supported roles</h2>
          <div className="chip-grid">
            {roles.map((role) => (
              <span key={role.id} className="chip">
                {role.name}
              </span>
            ))}
          </div>
        </article>
        <article className="panel">
          <h2>Honest by design</h2>
          <p>
            This app is meant to be useful, not flattering. If a role needs technical proof,
            customer discovery evidence, or unusually strong ambiguity tolerance, the results say so.
          </p>
          <p>
            That makes the guidance more practical for recent graduates and early-career people who
            need a believable first target role, not a fantasy title.
          </p>
        </article>
      </section>

      <section className="container">
        <div className="section-heading">
          <p className="eyebrow">Role preview</p>
          <h2>Business-side paths the app evaluates</h2>
        </div>
        <div className="card-grid">
          {roles.map((role) => (
            <article key={role.id} className="panel role-preview">
              <h3>{role.name}</h3>
              <p>{role.shortSummary}</p>
              <p className="role-preview__meta">
                <strong>Entry titles:</strong> {role.commonEntryTitles.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
