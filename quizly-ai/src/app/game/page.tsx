"use client";

import GameStats from "@/components/GameStats/GameStats";
import ScoreGrid from "@/components/ScoreGrid/ScoreGrid";
import QUESTIONS from "@/data/questions.json";
import { Tooltip } from "react-tooltip";
import { CATEGORIES } from "@/data/Questions";
import {
  QuizCategory,
  QuizProgress,
  useCategoryStore,
} from "@/store/category-store";
import { useModalStore } from "@/store/modal-store";
import axios, { CancelTokenSource, isCancel } from "axios";
import { format } from "date-fns";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThreeDots } from "react-loader-spinner";
import { Typewriter } from "react-simple-typewriter";
import Header from "@/components/Header/Header";
import { motion } from "framer-motion";
import useDateComparison from "@/utils/useDate.hook";
import toast from "react-hot-toast";
import Image from "next/image";
import { useIsMobile } from "@/utils/IsMobile.hook";
import { arraysAreEqual } from "@/utils/Arrays";
import PlayAgain from "@/components/PlayAgain/PlayAgain";

interface IQuizeQuestionProps {
  onSubmit: (answer: string, usedClue: boolean) => void;
  onSkip: () => void;
  question: string;
  currentNumber: number;
  isSubmitting: boolean;
}

export interface IAnswerResponse {
  verdict: string;
  notes: string;
}

export default function Game() {
  const {
    currentCategory,
    currentCategoryScore,
    setCurrentScore,
    setIsCompleted,
    selectCategory,
    isCompleted,
    fetchPersistedStats,
    storeCategoryStats,
    clearPersistedStats,
  } = useCategoryStore();
  const { showModal } = useModalStore();
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayAgain, setIsPlayAgain] = useState(false);
  const { isDateExpired, saveCurrentDate } = useDateComparison();

  const cancelSource = useRef<CancelTokenSource>();

  const currentQuestion = useMemo(() => {
    return (
      QUESTIONS.find((QUESTION) => QUESTION.category === currentCategory)
        ?.questions[currentNumber - 1].question || ""
    );
  }, [currentNumber, currentCategory]);

  const currentDate = useMemo(() => {
    const dateFormat = "d MMMM, yyyy";

    const formattedDate = format(new Date(), dateFormat);
    return formattedDate;
  }, []);

  const handleSubmit = useCallback(
    async (answer: string, usedClue: boolean) => {
      // e.preventDefault();

      try {
        if (isSubmitting) {
          return;
        }

        if (cancelSource.current) {
          cancelSource.current.cancel();
        }

        cancelSource.current = axios.CancelToken.source();

        setIsSubmitting(true);

        const response = await axios.post(
          "/api/answer",
          {
            message: {
              question: currentQuestion,
              answer,
            },
          },
          {
            cancelToken: cancelSource.current.token,
          }
        );

        const formattedResponse: IAnswerResponse = JSON.parse(response.data);

        const updatedScore = [...currentCategoryScore];
        updatedScore[currentNumber - 1] =
          formattedResponse.verdict === "correct" && !usedClue
            ? QuizProgress.CORRECT
            : formattedResponse.verdict === "correct" && usedClue
            ? QuizProgress.CORRECT_CLUE
            : QuizProgress.INCORRECT;

        storeCategoryStats({
          category: currentCategory!,
          completed: currentNumber === 3 ? true : false,
          score: updatedScore,
        });

        setCurrentScore(updatedScore);

        const isFinalQuestion = () => {
          const currentCategoryIndex = CATEGORIES.findIndex(
            (category) => category === currentCategory
          );
          if (
            currentCategoryIndex === CATEGORIES.length - 1 &&
            currentNumber == 3
          ) {
            return true;
          }
        };

        showModal({
          mode:
            formattedResponse.verdict === "correct" ? "correct" : "incorrect",
          message: formattedResponse.notes,
          buttonText: isFinalQuestion() && "See Stats",
          onPress: () => {
            if (currentNumber === 3) {
              const currentCategoryIndex = CATEGORIES.findIndex(
                (category) => category === currentCategory
              );
              if (currentCategoryIndex === CATEGORIES.length - 1) {
                setTimeout(() => setIsCompleted(true), 500);

                return;
              }
              const nextCategory = CATEGORIES[currentCategoryIndex + 1];
              selectCategory(nextCategory);
              setCurrentScore(Array(3).fill(QuizProgress.PENDING));
            }
            setCurrentNumber((state) => (state >= 3 ? 1 : state + 1));
          },
        });
      } catch (err: any) {
        if (isCancel(err)) {
          console.log("canceled request");
        } else {
          toast.error("Something went wrong, try again");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      showModal,
      currentCategory,
      currentNumber,
      currentCategoryScore,
      setCurrentScore,
      setIsCompleted,
      selectCategory,
      storeCategoryStats,
    ]
  );

  const handleSkip = useCallback(() => {
    if (cancelSource.current) {
      cancelSource.current.cancel();
      cancelSource.current = undefined;
      setIsSubmitting(false);
    }

    const updatedScore = [...currentCategoryScore];
    updatedScore[currentNumber - 1] = QuizProgress.INCORRECT;

    storeCategoryStats({
      category: currentCategory!,
      completed: currentNumber === 3 ? true : false,
      score: updatedScore,
    });

    setCurrentScore(updatedScore);

    if (currentNumber === 3) {
      const currentCategoryIndex = CATEGORIES.findIndex(
        (category) => category === currentCategory
      );
      if (currentCategoryIndex === CATEGORIES.length - 1) {
        setTimeout(() => setIsCompleted(true), 200);

        return;
      }
      const nextCategory = CATEGORIES[currentCategoryIndex + 1];
      selectCategory(nextCategory);
      setCurrentScore(Array(3).fill(QuizProgress.PENDING));
    }
    setCurrentNumber((state) => (state >= 3 ? 1 : state + 1));
  }, [
    currentCategory,
    currentNumber,
    currentCategoryScore,
    setCurrentScore,
    setIsCompleted,
    selectCategory,
    storeCategoryStats,
  ]);

  const PrepareGame = useCallback(() => {
    setIsPreparing(true);

    const data = fetchPersistedStats();
    if (!data) {
      selectCategory(CATEGORIES[0]);
    }
    if (data) {
      const isExpired = isDateExpired();
      if (isExpired) {
        clearPersistedStats();
        window.location.reload();
        return;
      }

      if (data.isCompleted) {
        setIsPreparing(false);
        return;
      }

      //if categories don't match current category, clear
      console.log(data);
      const newCategories = QUESTIONS.map((question) => question.category);

      if (!arraysAreEqual(newCategories, data.categories)) {
        clearPersistedStats();
        window.location.reload();
        return;
      }

      const categoryIndex = data.progress.findIndex(
        (prog) => prog.category === data.currentCategory
      );

      if (categoryIndex === -1) {
        clearPersistedStats();
        selectCategory(CATEGORIES[0]);
        window.location.reload();
        return;
      }

      const selectedCategory = data.progress[categoryIndex].completed
        ? CATEGORIES[categoryIndex + 1]
        : data.currentCategory;

      selectCategory(selectedCategory);
      setCurrentScore(
        data.progress.find((progress) => progress.category === selectedCategory)
          ?.score || Array(3).fill(QuizProgress.PENDING)
      );
      setCurrentNumber(() => {
        const currentProgressId = data.progress
          .find((progress) => progress.category === data.currentCategory)
          ?.score.findIndex((score) => score === QuizProgress.PENDING);
        return currentProgressId && currentProgressId >= 0
          ? currentProgressId + 1
          : 1;
      });
    }

    saveCurrentDate();
    setIsPreparing(false);
  }, [fetchPersistedStats, selectCategory, setCurrentScore]);

  useEffect(() => {
    PrepareGame();

    return () => {
      if (cancelSource.current) {
        cancelSource.current.cancel();
      }
    };
  }, []);

  if (isPreparing) {
    return;
  }

  return (
    <>
      <Header />
      {!isCompleted && (
        <div className="w-[90%] max-w-[1800px] mx-auto border-t border-gray-300 mb-2">
          <p className="py-1 px-2 text-center">{currentDate}</p>
        </div>
      )}
      {isPlayAgain ? (
        <PlayAgain />
      ) : (
        <main className="w-full max-w-[1800px] mx-auto min-h-[calc(90%-7%+32px)] px-10 flex flex-col justify-center">
          {isCompleted ? (
            <GameStats onPlayAgain={() => setIsPlayAgain(true)} />
          ) : (
            <motion.div
              className="grid lg:flex items-center h-full pt-4 pb-8 lg:pb-5 xl:pb-8 lg:px-12"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <QuizQuestion
                onSubmit={handleSubmit}
                onSkip={handleSkip}
                question={currentQuestion}
                currentNumber={currentNumber}
                isSubmitting={isSubmitting}
              />

              <div className="lg:w-[40%] my-5 lg:my-0">
                <InGameProgress />
              </div>
            </motion.div>
          )}
        </main>
      )}
    </>
  );
}

function InGameProgress() {
  const { categoryStats } = useCategoryStore();

  return (
    <div className="mt-5 grid place-items-center w-auto lg:justify-end -ml-4 lg:ml-0">
      {QUESTIONS.map((question) => (
        <ScoreGrid
          key={question.category}
          category={question.category as QuizCategory}
          stats={categoryStats.find(
            (category) => category.category === question.category
          )}
        />
      ))}
    </div>
  );
}

function QuizQuestion({
  onSubmit,
  onSkip,
  question,
  currentNumber,
  isSubmitting,
}: IQuizeQuestionProps) {
  const [hasUsedClue, setHasUsedClue] = useState(false);
  const { currentCategory } = useCategoryStore();
  const { showModal, hideModal } = useModalStore();
  const [inputValue, setInputValue] = useState("");
  const isMobile = useIsMobile();
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const number = useMemo(() => {
    const categoryIndex = CATEGORIES.findIndex(
      (category) => category === currentCategory
    );
    let numberToReturn = currentNumber;

    if (categoryIndex === 1) {
      numberToReturn = currentNumber + 3;
    }
    if (categoryIndex === 2) {
      numberToReturn = currentNumber + 6;
    }

    return numberToReturn;
  }, [currentCategory, currentNumber]);

  const revealHint = useCallback(() => {
    const currentQuestion = QUESTIONS.find(
      (QUESTION) => QUESTION.category === currentCategory
    )?.questions[currentNumber - 1];

    showModal({
      mode: "custom",
      image: "/clue.png",
      message: `${currentQuestion?.clue.replace("Hint: ", "") || ""}`,
      buttonText: "Dismiss",
      onPress: hideModal,
    });
  }, [currentNumber, currentCategory]);

  useEffect(() => {
    setInputValue("");
    setHasUsedClue(false);
  }, [currentNumber]);

  return (
    <div className="md:px-5 lg:px-0 lg:pr-3 lg:w-[60%]">
      <h3 className="font-semibold text-xl md:text-3xl xl:text-5xl 2xl:text-6xl capitalize">
        Question {number}
      </h3>
      <p className="capitalize mt-1 mb-6 xl:text-3xl lg:mt-5 lg:mb-8">
        {currentCategory}
      </p>

      <h1
        className={`font-semibold text-4xl md:text-[54px] xl:text-6xl 2xl:text-8xl leading-[1.3em] xl:leading-[1.33em] 2xl:leading-[1.37em] mb-12 min-h-[200px] lg:min-h-[250px]`}
      >
        <Typewriter
          key={question}
          words={[question]}
          loop={1}
          typeSpeed={25}
          delaySpeed={50}
        />
      </h1>

      <form
        className="flex w-full flex-col md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(inputValue, hasUsedClue);
        }}
      >
        <input
          type="text"
          placeholder="Type in your answer..."
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-500 placeholder:italic rounded-[10px] w-full md:w-[65%] max-w-3xl h-12 p-3 mb-5 xl:h-14 2xl:h-20 xl:text-lg xl:p-6"
        />
        <div className="w-full md:w-[35%] md:grid md:grid-cols-2">
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="border-[2px] border-black w-full md:w-auto text-black bg-[#D0FFDD] hover:bg-[#efdac1] transition-all duration-300 focus:ring-2 focus:outline-none focus:ring-black rounded-[10px] text-sm px-5 py-2.5 text-center h-12 xl:h-14 2xl:h-20 md:ml-2 mb-4 flex justify-center items-center cursor-pointer disabled:cursor-not-allowed font-semibold xl:text-base 2xl:text-lg"
          >
            {!isSubmitting ? (
              "Submit"
            ) : (
              <ThreeDots
                height="60"
                width="60"
                radius="9"
                color="black"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              !hasUsedClue ? revealHint() : onSkip();
              setHasUsedClue(true);
            }}
            className="border-[2px] w-full md:w-auto border-black text-black bg-[transparent] hover:bg-[#D0FFDD] transition-all duration-300 focus:ring-2 focus:outline-none focus:ring-black focus:bg-transparent rounded-[10px] text-sm px-5 py-2.5 text-center h-12 xl:h-14 2xl:h-20 md:ml-2 flex justify-center items-center cursor-pointer font-semibold relative group xl:text-base 2xl:text-lg"
          >
            {hasUsedClue ? (
              <>
                <span className="md:mr-1">Skip</span>
                <Image
                  src="/arrow-right.svg"
                  alt={"next question"}
                  className="hidden md:block md:ml-1 h-auto transition-transform transform translate-x-0 group-hover:translate-x-2 group-focus:translate-x-0"
                  width={20}
                  height={20}
                  priority
                />
              </>
            ) : (
              "Clue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
