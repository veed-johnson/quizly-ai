import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { QuizController } from "../controllers/QuizController";
import { Router } from "express";


export const quizController = new QuizController(applicationFeatureFactory.AddNewQuizzes());

const QuizRoute = Router();

QuizRoute.post("/addquizzes", quizController.AddNewQuizzes);

export {QuizRoute};