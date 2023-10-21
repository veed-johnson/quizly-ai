import { QuizCategory } from "@/store/category-store";

export function getCategoryBgColor(category: QuizCategory): string {
  switch (category) {
    case QuizCategory.SCIENCE:
      return "bg-[#FFE9D0]";
    case QuizCategory.MUSIC:
      return "bg-[#D0FFF9]";
    case QuizCategory.HISTORY:
      return "bg-[#FFD0D0]";
    case QuizCategory.SPORTS:
      return "bg-[#D0FFDD]";
    default:
      return "bg-[#D0FFDD]";
  }
}
