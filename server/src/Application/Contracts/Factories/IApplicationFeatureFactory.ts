import { IAuthFeatures } from "../Features/AuthenticationModule/IAuthFeatures";
import { IUserFeatures } from "../Features/AuthenticationModule/IUserFeatures";
import { IAddNewQuizzes } from "../Features/QuizModule/IAddNewQuizzes";
import { IGetCurrentQuiz } from "../Features/QuizModule/IGetCurrentQuiz";
import { IQuizFeatures } from "../Features/QuizModule/IQuizFeatures";
import { IMessageAllSubscribers } from "../Features/SubscriptionFeature/IMessageAllSubscribers";
import { ISubscriptionFeatures } from "../Features/SubscriptionFeature/ISubscriptionFeatures";


export interface IApplicationFeatureFactory {
    AddNewQuizzes(): IAddNewQuizzes;
    GetCurrentQuiz(): IGetCurrentQuiz;
    MessageAllSubscribers(): IMessageAllSubscribers;
    QuizFeatures(): IQuizFeatures;
    UserFeatures(): IUserFeatures;
    AuthFeatures(): IAuthFeatures;
    SubscriptionFeatures(): ISubscriptionFeatures;
}