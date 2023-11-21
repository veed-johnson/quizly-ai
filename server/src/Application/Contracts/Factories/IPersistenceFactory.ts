import { IUserRepository } from "../DataAccess/AuthenticationDataAccess/IUserRepository";
import { IQuizRepository } from "../DataAccess/QuizModule/IQuizRepository";
import { ISubscriberRepository } from "../DataAccess/SubscriptionDataAccess/ISubscriberRepository";

export interface IPersistenceFactory {
    QuizRepository(): IQuizRepository;
    SubscriberRepository(): ISubscriberRepository
    UserRepository (): IUserRepository ;
}