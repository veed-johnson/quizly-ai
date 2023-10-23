import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { QuizProgress, useCategoryStore } from "@/store/category-store";
import ScoreGrid from "../ScoreGrid/ScoreGrid";
import ShareEmojis from "@/components/ShareButtons/ShareButtons";
import toast from "react-hot-toast";
import { getCategoryIcon, getScoreEmoji } from "@/utils/GetScoreEmoji";
import Link from "next/link";
import { motion } from "framer-motion";

const URL = "https://quizly-ai.vercel.app/";

function GameStats({ onPlayAgain }: { onPlayAgain: () => void }) {
  const { categoryStats } = useCategoryStore();
  const [value, setValue] = useState(0);

  const avgScore = useMemo(() => Math.floor(Math.random() * 8) + 1, []);

  const userScore = useMemo(() => {
    let scores: QuizProgress[] = [];

    for (const i of categoryStats) {
      scores.push(...i.score);
    }

    return scores.filter(
      (score) =>
        score === QuizProgress.CORRECT || score === QuizProgress.CORRECT_CLUE
    ).length;
  }, [categoryStats]);

  const emojiScore = useMemo(() => {
    let emoji = "";

    for (const category of categoryStats) {
      let emojiForCategory = getCategoryIcon(category.category);

      for (const i of category.score) {
        emojiForCategory += getScoreEmoji(i);
      }
      emoji += emojiForCategory + "\n";
    }

    const stringToReturn = `I scored ${userScore}/9\n\n${emoji}\nCan you beat my score?\nPlay here\n`;

    return stringToReturn;
  }, [userScore, categoryStats]);

  const handleShare = useCallback(async () => {
    const dataToShare = {
      text: `${emojiScore}\n${URL}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(dataToShare);
      } catch (error) {}
    } else {
      // Fallback for desktop or unsupported browsers
      try {
        await navigator.clipboard.writeText(`${emojiScore}\n${URL}`);

        toast.success("Copied to clipboard!");
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  }, [emojiScore]);

  useEffect(() => {
    const animationStartTime = Date.now();
    const animationDuration = 500;
    let animationFrameId: number;

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min(
        1,
        (currentTime - animationStartTime) / animationDuration
      );
      const animatedValue = Math.ceil(progress * userScore);

      setValue(animatedValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      className="flex flex-col align-center justify-center w-full h-auto"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-xl md:text-3xl 2xl:5xl text-center mt-2 lg:mt-6 mb-4 font-semibold">
        Your total score
      </h1>

      {/* Score result starts here */}
      <div className="flex flex-col-reverse md:flex-row w-full mt-10">
        <div className="md:w-1/2 border-t md:border-t-0 md:border-r md:pr-4 md:py-5 grid items-center justify-center md:justify-end">
          <div className="grid items-center w-fit md:justify-end p-4 md:p-0 mr-5 md:ml-0">
            {categoryStats.map((category, idx) => (
              <ScoreGrid
                key={category.category}
                category={category.category}
                stats={category}
                noMargin={idx === categoryStats.length - 1}
                width="20px"
                useIcon
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 grid items-center md:pl-5 md:py-5">
          <div className="grid place-items-center w-fit mx-auto md:mx-0 relative">
            <div className="w-[150px] aspect-square lg:w-[200px] xl:w-[250px] 2xl:w-[300px]">
              <CircularProgressbarWithChildren
                value={value}
                maxValue={9}
                styles={{
                  path: {
                    stroke: value < 4 ? "#da0000" : "#0576FB",
                    strokeLinecap: "round",
                    transition: "stroke-dashoffset 0.5s ease 0s",
                  },
                  trail: {
                    stroke: "#E5E5FF",
                  },
                }}
              >
                <p className="font-semibold text-6xl xl:text-8xl">
                  {value}
                  <span className="text-5xl xl:text-7xl">/</span>
                  <span className="text-3xl xl:text-5xl">9</span>
                </p>
              </CircularProgressbarWithChildren>
            </div>
            <h2 className="font-bold mt-4 text-center mb-3 md:mb-0 xl:text-lg 2xl:text-xl">
              Today's average score is {avgScore} points
            </h2>
          </div>
        </div>
      </div>

      {/* Share your score starts here  */}
      <button
        className="flex justify-center bg-[#D0FFDD] border-black border-2 rounded-md px-3 pl-4 py-2 xl:px-6 xl:py-4 xl:text-lg mx-auto mt-10 2xl:mt-16 xl:mb-4 2xl:mb-6 group"
        onClick={handleShare}
      >
        Share your score{" "}
        <Image
          src={"/share.svg"}
          alt="share to media"
          width={20}
          height={20}
          className="ml-2 transition-transform transform translate-x-0 group-hover:translate-x-2 xl:mt-[1px] xl:w-6 xl:h-6"
        />
      </button>

      <ShareEmojis shareUrl={URL} content={emojiScore || ""} />

      <button
        className="flex place-items-center mx-auto w-fit border-b-2 border-black my-7 xl:text-lg 2xl:mt-10 2xl:text-xl tracking-wide group"
        onClick={onPlayAgain}
      >
        Play again
        <span>
          <Image
            src={"/arrow-right.svg"}
            alt="play again"
            width={20}
            height={20}
            className="ml-2 transition-transform transform translate-x-0 group-hover:translate-x-2"
          />
        </span>
      </button>
    </motion.div>
  );
}

export default GameStats;
