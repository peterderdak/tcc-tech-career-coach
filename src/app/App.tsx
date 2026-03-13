import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LandingPage } from '../pages/LandingPage';
import { QuizPage } from '../pages/QuizPage';
import { ResultsPage } from '../pages/ResultsPage';
import { RoleLibraryPage } from '../pages/RoleLibraryPage';
import { MethodologyPage } from '../pages/MethodologyPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/roles" element={<RoleLibraryPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
      </Route>
    </Routes>
  );
}
