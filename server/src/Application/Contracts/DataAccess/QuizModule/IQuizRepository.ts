import { Quiz } from "Domain/Entities/QuizModule/Quiz";
import { IBaseRepository } from "../Common/IBaseRepository";
import { ObjectId } from "mongoose";

export interface IQuizRepository extends IBaseRepository<Quiz, ObjectId> {
    getLatestScheduledQuiz(): Promise<Quiz | null>;
    insertMany(entities: Quiz[]): Promise<Quiz[]>;
    getLastAddedQuizzes(numberOfLastAddedQuizzes: number): Promise<Quiz[]>;
    firstOrDefault(query: {[k: string]: any}): Promise<Quiz | null>;
}