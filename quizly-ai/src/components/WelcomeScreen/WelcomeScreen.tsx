"use client";
import { DateTime } from "luxon";
import { CATEGORIES } from "@/data/Questions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { formatInTimeZone } from "date-fns-tz";

export const WelcomeScreen = function WelcomeScreen() {
  const [localTime, setLocalTime] = useState("");

  const currentDate = useMemo(() => {
    const dateFormat = "d MMMM, yyyy";

    return format(new Date(), dateFormat);
  }, []);

  useEffect(() => {
    const sydneyTime = DateTime.fromObject(
      {
        hour: 0,
        minute: 0,
        second: 0,
      },
      { zone: "Australia/Sydney" }
    );
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const userTime = sydneyTime.setZone(localTimeZone).toFormat("h:mm a");
    setLocalTime(userTime);
  }, []);

  return (
    <main className="w-full h-full grid items-center justify-center px-5">
      <motion.div
        className="grid place-items-center pt-5"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="logo h-[100px] lg:h-[140px] xl:h-[180px] min-w-[100px] logo-bounce logo-blink">
          <div className="logo-img logo-eye-open">
            <img src="/logo.svg" className="h-full w-auto" />
          </div>

          <div className="logo-img logo-eye-closed">
            <img src="/logo-eye-closed.svg" className="h-full w-auto" />
          </div>
        </div>

        <Image
          src={"/logo-text.svg"}
          alt="Quizly AI"
          className="w-32 md:w-36 lg:w-52 my-4 2xl:my-7"
          width={0}
          height={0}
          priority
        />

        <h2 className="font-bold mt-10 text-lg lg:text-2xl">Today's Game:</h2>

        <div className="flex justify-between my-2 ml-[10px] 2xl:my-6">
          {CATEGORIES.map((category) => (
            <Image
              key={category}
              src={`/${category}-icon.svg`}
              alt="Quizly AI"
              className="w-10 mx-1 md:w-14 lg:w-16"
              width={24}
              height={24}
              priority
            />
          ))}
        </div>

        <Link
          role="button"
          aria-roledescription="Play"
          href={"/game"}
          className="flex place-items-center mx-auto border-2 border-black bg-[#D0FFDD] my-7 rounded-md font-semibold py-3 px-24 transition duration-500 hover:scale-110 lg:px-28 lg:py-4 lg:text-lg"
        >
          Play
        </Link>

        <p>{currentDate}.</p>

        <p className="mt-5 underline underline-offset-4 text-center">
          New games daily at {localTime} (12:00 AM - AEST)
        </p>
      </motion.div>
    </main>
  );
};
