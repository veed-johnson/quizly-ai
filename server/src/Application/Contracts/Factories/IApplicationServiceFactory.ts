import { IChatService } from "../Services/ChatModule/IChatService";
import { IPromptService } from "../Services/ChatModule/IPromptService";
import { IQuizService } from "../Services/QuizServiceModule/IQuizService";

export interface IApplicationServiceFactory{
    ChatService(): IChatService;

    PromptService (): IPromptService;

    QuizService(): IQuizService;
}