import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../app/AppContext';
import { questions, roles, weights } from '../data';
import { QuestionCard } from '../components/QuestionCard';
import { computeQuizResults } from '../lib/scoring';

export function QuizPage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const totalQuestions = questions.length;
  const currentIndex = Math.min(state.currentQuestionIndex, totalQuestions - 1);
  const currentQuestion = questions[currentIndex];
  const selectedOptionId = state.answers[currentQuestion.id];
  const progressValue = Math.round((Object.keys(state.answers).length / totalQuestions) * 100);

  function handleSelect(optionId: string) {
    dispatch({
      type: 'answer',
      questionId: currentQuestion.id,
      optionId
    });
  }

  function handleBack() {
    dispatch({
      type: 'go_to',
      index: Math.max(0, currentIndex - 1)
    });
  }

  function handleNext() {
    if (!selectedOptionId) {
      return;
    }

    if (currentIndex === totalQuestions - 1) {
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
      navigate('/results');
      return;
    }

    dispatch({
      type: 'go_to',
      index: currentIndex + 1
    });
  }

  function handleReset() {
    dispatch({ type: 'reset' });
  }

  return (
    <div className="container page page--narrow">
      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Quiz</p>
          <h1>Find your strongest business-side role signals in tech</h1>
        </div>
        <p>
          Progress saves automatically in your browser, so you can stop and resume later on the same
          device.
        </p>
        <div className="progress">
          <div
            className="progress__bar"
            role="progressbar"
            aria-valuenow={progressValue}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progressValue}%` }} />
          </div>
          <span className="progress__label">{progressValue}% complete</span>
        </div>
      </section>

      <QuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        onSelect={handleSelect}
      />

      <section className="quiz-actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={handleReset}
          disabled={Object.keys(state.answers).length === 0}
        >
          Reset quiz
        </button>
        <button type="button" className="button" onClick={handleNext} disabled={!selectedOptionId}>
          {currentIndex === totalQuestions - 1 ? 'See results' : 'Next'}
        </button>
      </section>
    </div>
  );
}
