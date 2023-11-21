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
import { IUserFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IUserFeatures";
import { UserFeatures } from "../../Application/Features/AuthenticationModule/UserFeatures";
import { IAuthFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IAuthFeatures";
import { AuthFeatures } from "../../Application/Features/AuthenticationModule/AuthFeatures";
import { ISubscriptionFeatures } from "../../Application/Contracts/Features/SubscriptionFeature/ISubscriptionFeatures";
import { SubscriptionFeatures } from "../../Application/Features/SubscriptionFeature/SubscriptionFeatures";


class ApplicationFeatureFactory implements IApplicationFeatureFactory{
    private readonly _applicationServiceFactory: IApplicationServiceFactory;
    private readonly _infrastructureClientFactory : IInfrastructureClientFactory;
    private readonly _persistenceFactory: IPersistenceFactory;
    

    private _messageAllSubscribers: IMessageAllSubscribers | undefined;
    private _addNewQuizzes: IAddNewQuizzes | undefined;
    private _getCurrentQuiz: IGetCurrentQuiz | undefined;
    private _quizFeatures: IQuizFeatures | undefined;
    private _userFeatures: IUserFeatures | undefined;
    private _authFeatures: IAuthFeatures | undefined;
    private _subscriptionFeatures: ISubscriptionFeatures | undefined;

    public constructor(applicationServiceFactory: IApplicationServiceFactory,
        infrastructureClientFactory : IInfrastructureClientFactory, 
        persistenceFactory: IPersistenceFactory){
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

    public UserFeatures = (): IUserFeatures => {
        if(!this._userFeatures){
            this._userFeatures = new UserFeatures(this._applicationServiceFactory.UserService());
        }
        return this._userFeatures;
    }

    public AuthFeatures = (): IAuthFeatures => {
        if(!this._authFeatures){
            this._authFeatures = new AuthFeatures(this._infrastructureClientFactory.AuthService(), 
            this._applicationServiceFactory.UserService(), 
            this._infrastructureClientFactory.MailService())
        }
        return this._authFeatures;
    }

    public SubscriptionFeatures = (): ISubscriptionFeatures => {
        if(!this._subscriptionFeatures){
            this._subscriptionFeatures = new SubscriptionFeatures(this._applicationServiceFactory.SubscriptionService(), this._infrastructureClientFactory.MessageService());
        }

        return this._subscriptionFeatures;
    }
}

export const applicationFeatureFactory = new ApplicationFeatureFactory(applicationServiceFactory, infrastructureClientFactory, persistenceFactory);