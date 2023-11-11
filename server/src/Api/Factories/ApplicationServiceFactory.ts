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



class ApplicationServiceFactory implements IApplicationServiceFactory{
    private readonly _persistenceFactory: IPersistenceFactory;
    private readonly _infrastructureClientFactory: IInfrastructureClientFactory;
    private _promptService: IPromptService;
    private _chatService: IChatService;
    private _quizService: IQuizService;

    public constructor(persistenceFactory: IPersistenceFactory, infrastructureClientFactory: IInfrastructureClientFactory){
        this._persistenceFactory = persistenceFactory;
        this._infrastructureClientFactory = infrastructureClientFactory;
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
}

export const applicationServiceFactory = new ApplicationServiceFactory(persistenceFactory, infrastructureClientFactory);