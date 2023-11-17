import { IChatClient } from "../ApiClients/ChatModule/IChatClient";
import { IMessageService } from "../Services/ChatModule/IMessageService";

export interface IInfrastructureClientFactory{

    ChatClient (): IChatClient;
    MessageService(): IMessageService;
}