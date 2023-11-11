import { appSettings } from "../../Api/appSettings";
import { IChatClient } from "../../Application/Contracts/ApiClients/ChatModule/IChatClient";
import { IInfrastructureClientFactory } from "../../Application/Contracts/Factories/IInfrastructureClientFactory";
import { ChatGPTClient } from "../../Infrastructure/ApiClient/ChatModule/ChatGPTClient";
import { ChatGPTConfig } from "../../Infrastructure/Config/ChatGPTConfig";

 class InfrastructureClientFactory implements IInfrastructureClientFactory{
    private _chatGptConfig: ChatGPTConfig;

    private _chatClient:  IChatClient;
    public constructor(chatGPTConfig: ChatGPTConfig){
        this._chatGptConfig = chatGPTConfig;
    }

    public ChatClient =  (): IChatClient => {
        if(!this._chatClient){
            this._chatClient = new ChatGPTClient(this._chatGptConfig);
        }
        return this._chatClient;
    }
}


const chatGptConfig = {
    chatGptBaseUrl: appSettings.CHATGPT_BASE_URL,
    chatGptToken: appSettings.CHATGPT_TOKEN
}
const chatGPTConfig : ChatGPTConfig = new ChatGPTConfig(chatGptConfig.chatGptBaseUrl, chatGptConfig.chatGptToken)

export const infrastructureClientFactory = new InfrastructureClientFactory(chatGPTConfig);


