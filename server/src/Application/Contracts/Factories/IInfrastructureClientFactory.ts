import { IChatClient } from "../ApiClients/ChatModule/IChatClient";
import { IAuthService } from "../Services/AuthenticationServiceModule/IAuthService";
import { IMailService } from "../Services/ChatModule/IMailService";
import { IMessageService } from "../Services/ChatModule/IMessageService";

export interface IInfrastructureClientFactory{

    ChatClient (): IChatClient;
    MessageService(): IMessageService;
    MailService(): IMailService;
    AuthService(): IAuthService;
}