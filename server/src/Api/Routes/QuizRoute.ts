import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { QuizController } from "../Controllers/QuizController";
import { Router } from "express";
import { authenticationMiddleware } from "../../Api/Middlewares/AuthenticationMiddleware";



const QuizRoute = Router();

const quizController = new QuizController(applicationFeatureFactory.QuizFeatures());

QuizRoute.post("/addquizzes", authenticationMiddleware.adminPermissionRequired, quizController.AddNewQuizzes);

QuizRoute.post("/addquizquestions", quizController.AddQuizQuestions);

QuizRoute.get("/currentquiz", quizController.GetCurrentQuiz);
QuizRoute.get("/get", quizController.GetQuizzesByStatus);
QuizRoute.get("/all", quizController.GetAllQuizzes);

QuizRoute.patch("/editquizquestion", quizController.EditSingleQuizQuestion);
QuizRoute.patch("/updatetolive/:id", quizController.UpdateQuizStatusToLive);
QuizRoute.delete("/deletebystatus", quizController.DeleteQuizByStatus);

export {QuizRoute, quizController};