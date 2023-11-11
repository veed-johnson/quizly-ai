import { IChatClient } from "../ApiClients/ChatModule/IChatClient";

export interface IInfrastructureClientFactory{

    ChatClient (): IChatClient;
}