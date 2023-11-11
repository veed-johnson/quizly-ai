import { IQuizRepository } from "../DataAccess/QuizModule/IQuizRepository";

export interface IPersistenceFactory {
    QuizRepository(): IQuizRepository;
}