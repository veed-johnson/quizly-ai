import { IChatClient } from "Application/Contracts/ApiClients/ChatModule/IChatClient";
import { IChatService } from "Application/Contracts/Services/ChatModule/IChatService";

export class ChatService implements IChatService {
    private readonly _chatClient: IChatClient;
    
    public constructor (chatClient: IChatClient){
        this._chatClient = chatClient;
    }
    GetResponseForPrompt = async (prompt: string): Promise<string> => {
        const promptResponse: string = await this._chatClient.PostPromptQuery(prompt);
        return promptResponse;
    }

}