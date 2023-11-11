import { Quiz } from "Domain/Entities/QuizModule/Quiz";

export interface IQuizRepository {
    getLatestScheduledQuiz(): Promise<Quiz | null>;
    insertMany(entities: Quiz[]): Promise<Quiz[]>;
    getLastAddedQuizzes(numberOfLastAddedQuizzes: number): Promise<Quiz[]>
}