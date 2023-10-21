import QUESTIONS from "./questions.json";

enum QuizCategory {
  SPORTS = "sports",
  MUSIC = "music",
  HISTORY = "history",
  SCIENCE = "science",
  MOVIES = "movies",
  GEOGRAPHY = "geography",
}

export const CATEGORIES: QuizCategory[] = QUESTIONS.map(
  (question) => question.category as QuizCategory
);
