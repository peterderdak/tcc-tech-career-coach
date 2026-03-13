import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  questionNumber: number;
  totalQuestions: number;
  onSelect: (optionId: string) => void;
}

export function QuestionCard({
  question,
  selectedOptionId,
  questionNumber,
  totalQuestions,
  onSelect
}: QuestionCardProps) {
  return (
    <section className="panel quiz-panel">
      <p className="quiz-panel__eyebrow">
        Question {questionNumber} of {totalQuestions}
      </p>
      <fieldset className="quiz-fieldset">
        <legend className="quiz-fieldset__legend">{question.prompt}</legend>
        <div className="option-list">
          {question.options.map((option) => {
            const checked = selectedOptionId === option.id;
            return (
              <label key={option.id} className={`option-card ${checked ? 'option-card--selected' : ''}`}>
                <input
                  className="sr-only"
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={checked}
                  onChange={() => onSelect(option.id)}
                />
                <span className="option-card__label">{option.label}</span>
                <span className="option-card__description">{option.description}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
