import express from "express";
import { addQuizToDB } from "../utilities/AddQuizToDB";
import {
  deleteQuizzesByStatus,
  editSingleQuizQuestion,
  getAllQuizes,
  updateQuizStatusToLive,
} from "../Api/controllers/quizes";

export default (router: express.Router) => {
  router.get("/quiz/all", getAllQuizes);
  router.post("/quiz/add", addQuizToDB);
  router.patch("/quiz/goLive", updateQuizStatusToLive);
  router.patch("/quiz/:quizId", editSingleQuizQuestion);
  router.delete("/quiz/all", deleteQuizzesByStatus);
};
