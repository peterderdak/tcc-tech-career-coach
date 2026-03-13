import { DIMENSION_KEYS, DIMENSIONS } from '../config/dimensions';

export function MethodologyPage() {
  return (
    <div className="container page">
      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Methodology</p>
          <h1>How TCC scores role fit</h1>
        </div>
        <div className="detail-grid">
          <article>
            <h2>Scoring flow</h2>
            <ol className="number-list">
              <li>Each answer adds raw points to one or more career-fit dimensions.</li>
              <li>Some answers also add evidence tags used for credibility and gating checks.</li>
              <li>Each dimension is normalized against the maximum achievable score across the quiz.</li>
              <li>Each role gets a weighted base score from the normalized dimensions.</li>
              <li>Thresholds and evidence rules classify each role as recommended, stretch, or lower signal.</li>
            </ol>
          </article>
          <article>
            <h2>Normalization</h2>
            <p>
              Raw points are not compared directly because some dimensions appear in more questions than
              others. TCC calculates the highest possible contribution for each dimension question by
              question, sums that maximum, and then converts your raw score into a 0 to 100 normalized
              score.
            </p>
          </article>
          <article>
            <h2>Stretch logic</h2>
            <p>
              Stretch roles still show promise, but they are missing a threshold, a credibility signal,
              or both. That is why the results page separates best-fit roles from stretch roles instead
              of flattening everything into one ranked list.
            </p>
          </article>
        </div>
      </section>

      <section className="panel">
        <h2>Transparency note</h2>
        <p>
          Product Management, Sales Engineering, and TPM-leaning variants inside Project / Program
          Management are deliberately guarded. TCC will not recommend them just because they are popular;
          it requires stronger customer, analytical, technical, ambiguity, collaboration, and evidence
          signals first.
        </p>
        <p>
          This is browser-only guidance. No answers leave your device. The output is directional coaching,
          not a hiring guarantee.
        </p>
      </section>

      <section className="panel">
        <h2>Dimension definitions</h2>
        <div className="detail-grid">
          {DIMENSION_KEYS.map((dimension) => (
            <article key={dimension}>
              <h3>{DIMENSIONS[dimension].label}</h3>
              <p>{DIMENSIONS[dimension].description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
