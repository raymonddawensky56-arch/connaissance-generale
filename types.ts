export type Language = "fr" | "en" | "es" | "pt" | "ht" | "de" | "ar" | "zh-CN";
export type CategoryId = "history" | "economy" | "world" | "arts" | "science" | "people" | "flags" | "capitals";
export type Localized = Record<Language, string>;
export interface Category {
  id: CategoryId;
  icon: string;
  title: Localized;
  description: Localized;
}
export interface QuizQuestion {
  id: string;
  categoryId: CategoryId;
  seriesId: string;
  correctOptionId: string;
  translations: Record<Language, {
    question: string;
    options: Record<string, string>;
    explanation: string;
  }>;
}