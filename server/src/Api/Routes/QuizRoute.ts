import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { QuizController } from "../Controllers/QuizController";
import { Router } from "express";


export const quizController = new QuizController(applicationFeatureFactory.QuizFeatures());

const QuizRoute = Router();

QuizRoute.post("/addquizzes", quizController.AddNewQuizzes);
QuizRoute.get("/currentquiz", quizController.GetCurrentQuiz)
QuizRoute.get("/get", quizController.GetQuizzesByStatus);
export {QuizRoute};