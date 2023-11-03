import {
  IQuizSchema,
  QuizModel,
  deleteQuizzes,
  getAllQuiz,
  getAllQuizWithPagination,
} from "../db/Quiz";
import express from "express";

import { DateTime } from "luxon";

const sortCriteria = {
  date: (a: IQuizSchema, b: IQuizSchema): number =>
    new Date(a.date).getTime() - new Date(b.date).getTime(),
};

export const getAllQuizes = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const statusFilter = req.query.status as string | undefined;

    const query = statusFilter ? { status: statusFilter } : {};

    const skip = (page - 1) * pageSize;

    const [quizzes, totalItems] = await Promise.all([
      (
        await getAllQuizWithPagination(query, skip, pageSize)
      ).sort(sortCriteria.date),
      QuizModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(Number(totalItems) / Number(pageSize));

    return res.status(200).json({
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems,
      totalPages,
      quizzes,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(err);
  }
};

export const editSingleQuizQuestion = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const { quizId } = req.params;

    const { categoryId, questionId, question, clue, answer } = req.body;

    const updatedQuiz = await updateQuestionInCategory(
      quizId,
      categoryId,
      questionId,
      { question, clue, answer }
    );

    return res.status(200).json(updatedQuiz).end();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(err);
  }
};

export const updateQuizStatusToLive = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    // Get the current UTC date
    const currentUTCDate = DateTime.utc();
    // console.log("UTC", currentUTCDate.startOf("day").toJSDate());
    const newCurrentDate = currentUTCDate.startOf("day").toJSDate();

    // // Convert the UTC date to Sydney time zone
    // const currentSydneyDate = currentUTCDate.setZone("Australia/Sydney");

    // console.log("SYDNEY", currentSydneyDate);

    // const currentSydneyDate2 = DateTime.now()
    //   .setZone("Australia/Sydney")
    //   .startOf("day");
    // console.log("SYDNEY II", currentSydneyDate2.toJSDate());

    // Find and update the quiz with a matching Sydney date and "upcoming" status
    const updatedQuiz = await updateQuizStatus(newCurrentDate);

    return res.status(200).json(updatedQuiz).end();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(err);
  }
};

export const deleteQuizzesByStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { status } = req.query;

    const statusFilter = status ? { status } : {};

    const { deletedCount } = await deleteQuizzes(statusFilter);
    if (deletedCount < 1) {
      return res.status(404).json({
        message: `No quiz found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `Quizzes deleted successfully`,
    });
  } catch (err) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

// Abstracting the functions
export const updateQuestionInCategory = async (
  quizId: string,
  categoryId: string,
  questionId: string,
  updatedData: {
    question: string;
    clue: string;
    answer: string;
  }
) => {
  try {
    const quiz = await QuizModel.findOne({ _id: quizId });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const category = quiz.questionsList.find((cat) => cat._id == categoryId);

    if (!category) {
      throw new Error("Category not found");
    }

    const question = category.questions.find((q) => q._id == questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.question = updatedData.question || question.question;
    question.clue = updatedData.clue || question.clue;
    question.answer = updatedData.answer || question.answer;

    const updatedQuiz = await quiz.save();

    return updatedQuiz;
  } catch (error) {
    throw error;
  }
};

export const updateQuizStatus = async (currentSydneyDate: Date) => {
  try {
    // Find a quiz with the "live" status
    const liveQuiz = await QuizModel.findOne({
      status: "upcoming",
    });

    console.log(liveQuiz);

    // If a live quiz is found, change its status to "past"
    if (liveQuiz) {
      liveQuiz.status = "past";
      await liveQuiz.save();
    }

    console.log(currentSydneyDate);

    // console.log("JS DATE", currentSydneyDate.toJSDate());
    // Find a quiz with the matching Sydney date and "upcoming" status
    const quizToUpdate = await QuizModel.findOne({
      date: currentSydneyDate,
      status: "upcoming",
    });

    if (quizToUpdate) {
      quizToUpdate.status = "live";
      await quizToUpdate.save();
    }

    return quizToUpdate;
  } catch (error) {
    throw error;
  }
};
