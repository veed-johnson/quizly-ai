import { IAddNewQuizzes } from "../Features/QuizModule/IAddNewQuizzes";
import { IGetCurrentQuiz } from "../Features/QuizModule/IGetCurrentQuiz";
import { IQuizFeatures } from "../Features/QuizModule/IQuizFeatures";
import { IMessageAllSubscribers } from "../Features/SubscriptionFeature/IMessageAllSubscribers";


export interface IApplicationFeatureFactory {
    AddNewQuizzes(): IAddNewQuizzes;
    GetCurrentQuiz(): IGetCurrentQuiz;
    MessageAllSubscribers(): IMessageAllSubscribers;
    QuizFeatures(): IQuizFeatures;
}