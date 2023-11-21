import { IUserService } from "../Services/AuthenticationServiceModule/IUserService";
import { IChatService } from "../Services/ChatModule/IChatService";
import { IPromptService } from "../Services/ChatModule/IPromptService";
import { IQuizService } from "../Services/QuizServiceModule/IQuizService";
import { ISubscriptionService } from "../Services/SubscriberService/ISubscriptionService";

export interface IApplicationServiceFactory{
    ChatService(): IChatService;

    PromptService (): IPromptService;

    QuizService(): IQuizService;

    UserService(): IUserService;

    SubscriptionService(): ISubscriptionService
}