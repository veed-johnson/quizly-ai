import { IPersistenceFactory } from "../../Application/Contracts/Factories/IPersistenceFactory";
import { IApplicationServiceFactory } from "../../Application/Contracts/Factories/IApplicationServiceFactory";
import { persistenceFactory } from "./PersistenceFactory";
import { IChatService } from "../../Application/Contracts/Services/ChatModule/IChatService";
import { ChatService } from "../../Infrastructure/Services/ChatModule/ChatService";
import { IPromptService } from "../../Application/Contracts/Services/ChatModule/IPromptService";
import { PromptService } from "../../Application/Services/ChatModule/PromptService";
import { IQuizService } from "../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { QuizService } from "../../Application/Services/QuizServiceModule/QuizService";
import { infrastructureClientFactory } from "./InfrastructureClientFactory";
import { IInfrastructureClientFactory } from "../../Application/Contracts/Factories/IInfrastructureClientFactory";
import { IUserService } from "../../Application/Contracts/Services/AuthenticationServiceModule/IUserService";
import { UserService } from "../../Application/Services/AuthenticationServiceModule/UserSevice";
import { HashConfig } from "../../Application/Common/Config/HashConfig";
import { appSettings } from "../../Api/appSettings";
import { ISubscriptionService } from "../../Application/Contracts/Services/SubscriberService/ISubscriptionService";
import { SubscriptionService } from "../../Application/Services/SubscriptionService/SubscriptionService";



class ApplicationServiceFactory implements IApplicationServiceFactory{
    private readonly _persistenceFactory: IPersistenceFactory;
    private readonly _infrastructureClientFactory: IInfrastructureClientFactory;
    private readonly _hashConfig: HashConfig

    private _promptService: IPromptService | undefined;
    private _chatService: IChatService | undefined;
    private _quizService: IQuizService | undefined;
    private _userService: IUserService | undefined;
    private _subscriptionService: ISubscriptionService | undefined;

    public constructor(persistenceFactory: IPersistenceFactory, infrastructureClientFactory: IInfrastructureClientFactory, hashConfig: HashConfig){
        this._persistenceFactory = persistenceFactory;
        this._infrastructureClientFactory = infrastructureClientFactory;
        this._hashConfig = hashConfig;
    }

    public ChatService = (): IChatService => {
        if(!this._chatService){
            this._chatService = new ChatService(this._infrastructureClientFactory.ChatClient());
        }
        return this._chatService;
    }

    public PromptService = (): IPromptService => {
        if(!this._promptService){
            this._promptService = new PromptService();
        }
        return this._promptService;
    }

    public QuizService = (): IQuizService => {
        if(!this._quizService ){
            this._quizService = new QuizService(this.PromptService(), this.ChatService(), this._persistenceFactory.QuizRepository());
        }

        return this._quizService;
    }

    public UserService = (): IUserService => {
        if(!this._userService){
            this._userService = new UserService(this._persistenceFactory.UserRepository(), this._hashConfig)
        }
        return this._userService;
    }

    public SubscriptionService = (): ISubscriptionService => {
        if(!this._subscriptionService){
            this._subscriptionService = new SubscriptionService(this._persistenceFactory.SubscriberRepository());
        }
        return this._subscriptionService;
    }
}

const HashConfigOptions = {
    HASH_SECRET: appSettings.HASH_SECRET
}

const hashConfig = new HashConfig(HashConfigOptions.HASH_SECRET);

export const applicationServiceFactory = new ApplicationServiceFactory(persistenceFactory, infrastructureClientFactory, hashConfig);