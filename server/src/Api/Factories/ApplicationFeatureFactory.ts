import { IApplicationFeatureFactory } from "../../Application/Contracts/Factories/IApplicationFeatureFactory";
import { IApplicationServiceFactory } from "../../Application/Contracts/Factories/IApplicationServiceFactory";
import { applicationServiceFactory } from "./ApplicationServiceFactory";
import { IAddNewQuizzes } from "../../Application/Contracts/Features/QuizModule/IAddNewQuizzes";
import { AddNewQuizzes } from "../../Application/Features/QuizModule/AddNewQuizzes";
import { IMessageAllSubscribers } from "../../Application/Contracts/Features/SubscriptionFeature/IMessageAllSubscribers";
import { MessageAllSubscribers } from "../../Application/Features/SubscriptionFeature/MessageAllSubscribers";
import { IPersistenceFactory } from "../../Application/Contracts/Factories/IPersistenceFactory";
import { IInfrastructureClientFactory } from "../../Application/Contracts/Factories/IInfrastructureClientFactory";
import { infrastructureClientFactory } from "./InfrastructureClientFactory";
import { persistenceFactory } from "./PersistenceFactory";
import { IGetCurrentQuiz } from "../../Application/Contracts/Features/QuizModule/IGetCurrentQuiz";
import { GetCurrentQuiz } from "../../Application/Features/QuizModule/GetCurrentQuiz";
import { IQuizFeatures } from "../../Application/Contracts/Features/QuizModule/IQuizFeatures";
import { QuizFeatures } from "../../Application/Features/QuizModule/QuizFeatures";


class ApplicationFeatureFactory implements IApplicationFeatureFactory{
    private readonly _applicationServiceFactory: IApplicationServiceFactory;
    private readonly _infrastructureClientFactory : IInfrastructureClientFactory;
    private readonly _persistenceFactory: IPersistenceFactory;
    

    private _messageAllSubscribers: IMessageAllSubscribers;
    private _addNewQuizzes: IAddNewQuizzes;
    private _getCurrentQuiz: IGetCurrentQuiz;
    private _quizFeatures: IQuizFeatures;

    public constructor(applicationServiceFactory: IApplicationServiceFactory, infrastructureClientFactory : IInfrastructureClientFactory, persistenceFactory: IPersistenceFactory){
        this._applicationServiceFactory = applicationServiceFactory;
        this._infrastructureClientFactory = infrastructureClientFactory;
        this._persistenceFactory = persistenceFactory;
    }

    public AddNewQuizzes = (): IAddNewQuizzes => {
        if(!this._addNewQuizzes){
            this._addNewQuizzes = new AddNewQuizzes(this._applicationServiceFactory.QuizService())
        }
        return this._addNewQuizzes;
    }

    public MessageAllSubscribers = (): IMessageAllSubscribers => {
        if(!this._messageAllSubscribers){
            this._messageAllSubscribers = new MessageAllSubscribers(this._persistenceFactory.SubscriberRepository(), this._infrastructureClientFactory.MessageService())
        }
        console.log({msubscriber: this._messageAllSubscribers})
        return this._messageAllSubscribers;
    }

    public GetCurrentQuiz = (): IGetCurrentQuiz => {
        if(!this._getCurrentQuiz){
            this._getCurrentQuiz = new GetCurrentQuiz(this._applicationServiceFactory.QuizService());
        }
        return this._getCurrentQuiz;
    }

    public QuizFeatures = (): IQuizFeatures => {
        if(!this._quizFeatures){
            this._quizFeatures = new QuizFeatures(this._applicationServiceFactory.QuizService());
        }
        return this._quizFeatures;
    }
}

export const applicationFeatureFactory = new ApplicationFeatureFactory(applicationServiceFactory, infrastructureClientFactory, persistenceFactory);