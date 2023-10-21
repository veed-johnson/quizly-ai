import { QuizCategory, QuizProgress } from "@/store/category-store";

export function getScoreEmoji(score: QuizProgress) {
  switch (score) {
    case QuizProgress.CORRECT:
      return "🟩";
    case QuizProgress.CORRECT_CLUE:
      return "🟨";
    default:
      return "🟥";
  }
}

export function getCategoryIcon(category: QuizCategory) {
  switch (category) {
    case QuizCategory.SPORTS:
      return "⚽";
    case QuizCategory.GEOGRAPHY:
      return "🌎";
    case QuizCategory.MOVIES:
      return "🎥";
    case QuizCategory.MUSIC:
      return "🎵";
    case QuizCategory.HISTORY:
      return "🕰️";
    case QuizCategory.SCIENCE:
      return "🔬";
  }
}
