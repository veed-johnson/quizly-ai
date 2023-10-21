import {
  ICategoryStats,
  QuizCategory,
  QuizProgress,
  useCategoryStore,
} from "@/store/category-store";
import classNames from "classnames";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  category: QuizCategory;
  stats: ICategoryStats | undefined;
  width?: string;
  noMargin?: boolean;
  useIcon?: boolean;
}

function ScoreGrid({ category, stats, width, noMargin, useIcon }: Props) {
  const { currentCategory } = useCategoryStore();
  const gameScore: QuizProgress[] = useMemo(() => {
    return stats?.score || Array(3).fill(QuizProgress.PENDING);
  }, [stats]);

  const activeIndex = useMemo(
    () => gameScore.findIndex((score) => score === QuizProgress.PENDING),
    [gameScore]
  );

  const scoreClassName = useCallback(
    (score: QuizProgress, index: number) => ({
      "green-icon": QuizProgress.CORRECT === score,
      "yellow-icon": QuizProgress.CORRECT_CLUE === score,
      "red-icon": QuizProgress.INCORRECT === score,
      "pending-icon": QuizProgress.PENDING === score,
      "border-[#FFF200]": category === currentCategory && index === activeIndex,
      "border-[8px]": category === currentCategory && index === activeIndex,
    }),
    [activeIndex, currentCategory, category]
  );

  return (
    <div
      className={classNames(
        "grid grid-cols-4 gap-3 lg:gap-5",
        noMargin ? "mb-0 lg:mb-0" : "mb-3 lg:mb-5"
      )}
    >
      <div
        className={classNames(
          width ? `w-10` : "w-[50px]",
          "relative lg:w-16 xl:w-20 2xl:w-28 aspect-square grid place-items-center"
        )}
      >
        <Image
          src={`/${category}-icon.svg`}
          alt={category}
          className={"h-[auto] w-full ml-6"}
          width={0}
          height={0}
          priority
        />
      </div>
      {gameScore.map((score, index) => (
        <div
          key={score + index}
          className={classNames(
            width ? "w-11" : "w-[50px]",
            "relative aspect-square grid place-items-center rounded-lg border lg:w-16 xl:w-20 2xl:w-28",
            scoreClassName(score, index)
          )}
        ></div>
      ))}
    </div>
  );
}

export default ScoreGrid;
