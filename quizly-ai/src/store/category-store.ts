import QUESTIONS from "@/data/questions.json";
import { create } from "zustand";

export enum QuizCategory {
  SPORTS = "sports",
  MUSIC = "music",
  HISTORY = "history",
  SCIENCE = "science",
  MOVIES = "movies",
  GEOGRAPHY = "geography",
}

export enum QuizProgress {
  CORRECT = "correct",
  CORRECT_CLUE = "correct_clue",
  INCORRECT = "incorrect",
  PENDING = "pending",
}

export type ICategoryStats = {
  category: QuizCategory;
  completed: boolean;
  score: QuizProgress[];
};

type ILocalStore = {
  currentCategory: QuizCategory;
  categories: QuizCategory[];
  isCompleted: boolean;
  progress: ICategoryStats[];
};

interface ICategoryStore {
  currentCategory: QuizCategory | undefined;
  currentCategoryScore: QuizProgress[];
  isCompleted: boolean;

  selectCategory: (selectedCategory: QuizCategory) => void;
  setCurrentScore: (score: QuizProgress[]) => void;
  setIsCompleted: (val: boolean) => void;
  categoryStats: ICategoryStats[];
  setCategoryStats: (stats: ICategoryStats[]) => void;
  storeCategoryStats: (data: ICategoryStats) => void;
  fetchPersistedStats: () => ILocalStore | null;
  clearPersistedStats: () => void;
}

export const useCategoryStore = create<ICategoryStore>((set, get) => ({
  currentCategory: QuizCategory.SPORTS,
  currentCategoryScore: Array(3).fill(QuizProgress.PENDING),
  categoryStats: [],
  isCompleted: false,
  selectCategory: (selectedCategory) => {
    set({ currentCategory: selectedCategory });
  },
  setCurrentScore: (score) => {
    set({ currentCategoryScore: score });
  },
  setIsCompleted: (val) => {
    set({ isCompleted: val });
  },
  setCategoryStats: (stats) => {
    set({ categoryStats: stats });
  },
  storeCategoryStats: function (data: ICategoryStats) {
    const categoryStatsCopy = get().categoryStats || [];
    const updateIndex = categoryStatsCopy.findIndex(
      (stats) => stats.category === data.category
    );

    if (updateIndex !== -1) {
      categoryStatsCopy[updateIndex] = data;
    } else {
      categoryStatsCopy.push(data);
    }

    const setCategoryStats = get().setCategoryStats;
    setCategoryStats(categoryStatsCopy);

    let isCompletedValue = false;
    if (
      categoryStatsCopy.length === 3 &&
      categoryStatsCopy[2].score[2] !== QuizProgress.PENDING
    ) {
      const isCompleted = get().isCompleted;
      isCompletedValue = true;
    }

    const dataToStore: ILocalStore = {
      currentCategory: get().currentCategory!,
      categories: QUESTIONS.map(
        (question) => question.category as QuizCategory
      ),
      isCompleted: isCompletedValue,
      progress: categoryStatsCopy,
    };

    localStorage.setItem(STORE.STATS, JSON.stringify(dataToStore));
  },
  fetchPersistedStats: () => {
    const data = localStorage.getItem(STORE.STATS);
    if (data) {
      const persistedStats: ILocalStore = JSON.parse(data);
      set({
        currentCategory: persistedStats.currentCategory,
        isCompleted: persistedStats.isCompleted,
        categoryStats: persistedStats.progress,
      });

      return persistedStats;
    }
    return null;
  },
  clearPersistedStats: () => {
    set({ categoryStats: [], isCompleted: false, currentCategory: undefined });
    localStorage.removeItem(STORE.STATS);
  },
}));

const STORE = {
  STATS: "@QUIZLY-STATS",
};
