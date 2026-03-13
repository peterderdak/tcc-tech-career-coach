import { questions } from '../data';

export function answersFromLetters(letters: string[]): Record<string, string> {
  if (letters.length !== questions.length) {
    throw new Error(`Expected ${questions.length} answers, received ${letters.length}`);
  }

  return Object.fromEntries(questions.map((question, index) => [question.id, letters[index]]));
}
