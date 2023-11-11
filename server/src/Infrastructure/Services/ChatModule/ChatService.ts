import { IChatClient } from "Application/Contracts/ApiClients/ChatModule/IChatClient";
import { IChatService } from "Application/Contracts/Services/ChatModule/IChatService";

export class ChatService implements IChatService{
    private _chatClient: IChatClient;
    public constructor(chatClient: IChatClient){
        this._chatClient = chatClient;
    }

    GetResponseForPrompt = async (prompt: string): Promise<string> => {
       return await this._chatClient.PostPromptQuery(prompt);
    }

    private GetMockPromptResponse(): string{
        return "";
    }
}