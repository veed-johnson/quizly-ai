import { Quiz } from "Domain/Entities/QuizModule/Quiz";

export interface IAddNewQuizzes {
    execute(quiz_size?: number, categories?: string): Promise<Quiz[]>
}