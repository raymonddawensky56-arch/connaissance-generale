import type { QuizQuestion } from "../types";

const modules = import.meta.glob("./categories/**/*.json", {
  eager: true,
  import: "default",
});

export const allQuestions = Object.values(modules).flat() as QuizQuestion[];

export function getQuestionsByCategory(categoryId: string): QuizQuestion[] {
  return allQuestions.filter((question) => question.categoryId === categoryId);
}

export function getQuestionsBySeries(seriesId: string): QuizQuestion[] {
  return allQuestions.filter((question) => question.seriesId === seriesId);
}
