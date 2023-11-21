import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";

export class QuizQuestionsRequest{
    questions: Partial<Quiz>[]
}