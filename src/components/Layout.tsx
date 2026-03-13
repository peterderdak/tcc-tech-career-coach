import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../app/AppContext';
import { questions } from '../data';

export function Layout() {
  const {
    state: { answers }
  } = useAppContext();

  const hasProgress = Object.keys(answers).length > 0 && Object.keys(answers).length < questions.length;

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <NavLink className="brand" to="/">
            <span className="brand__eyebrow">TCC</span>
            <span className="brand__name">Tech Career Coach</span>
          </NavLink>
          <nav aria-label="Primary navigation" className="site-nav">
            <NavLink to="/" className="site-nav__link">
              Home
            </NavLink>
            <NavLink to="/roles" className="site-nav__link">
              Role Library
            </NavLink>
            <NavLink to="/methodology" className="site-nav__link">
              Methodology
            </NavLink>
            <NavLink to="/quiz" className="site-nav__link site-nav__link--cta">
              {hasProgress ? 'Resume Quiz' : 'Start Quiz'}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <a href="https://star-track.net" target="_blank" rel="noreferrer">
            Need help organizing your stories in STAR format?
          </a>
        </div>
      </footer>
    </div>
  );
}
