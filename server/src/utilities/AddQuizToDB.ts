import express from "express";
import { IQuizSchema, addMultipleQuiz } from "../db/Quiz";
import { DUMMY_QUESTIONS } from "../dump";
import { DateTime } from "luxon";

export const addQuizToDB = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const updatedQuestions: IQuizSchema[] = [...DUMMY_QUESTIONS].map(
      (question, i) => {
        // const currentDate = new Date();
        // currentDate.setDate(currentDate.getDate() + i);
        // currentDate.setHours(0, 0, 0, 0);
        const currentDate = DateTime.fromObject(
          {
            year: new Date().getUTCFullYear(),
            month: new Date().getUTCMonth() + 1,
            day: new Date().getUTCDate() + i,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          },
          { zone: "utc" }
        );
        return {
          ...question,
          date: currentDate.toJSDate(),
          status: "upcoming",
        };
      }
    );

    await addMultipleQuiz(updatedQuestions);
    return res
      .status(200)
      .json({
        success: true,
        message: `Added successfully`,
      })
      .end();
  } catch (err) {
    res.status(401).json(err);
    console.log(err);
  }
};
