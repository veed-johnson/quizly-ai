import axios from 'axios';
import { ChatgptRequest } from '../RequestDTO/ChatModule/ChatGPTRequest';
import { ChatGPTConfig } from 'Infrastructure/Config/ChatGPTConfig';
import { ChatGPTPromptMessage } from '../RequestDTO/ChatModule/Aggregates/ChatGPTPromptMessage';
import { ChatGPTApiResponseDTO } from '../DTO/ChatModule/ChatGPTApiResponseDTO';
import { IChatClient } from 'Application/Contracts/ApiClients/ChatModule/IChatClient';

export class ChatGPTClient implements IChatClient {
    
    private readonly _token: string;
    private readonly _baseUrl: string;
    public constructor(chatGPTConfig: ChatGPTConfig){
        this._token = chatGPTConfig.token;
        this._baseUrl = chatGPTConfig.baseUrl;
    }

    public PostPromptQuery = async (prompt: string): Promise<string> => {
        // transform prompt to a valid gpt body
        const chatGptRequest = new ChatgptRequest();
        var chatGptMessage = new ChatGPTPromptMessage()
        chatGptMessage.content = prompt;
        const messages = [chatGptMessage];
        chatGptRequest.messages = messages;

        // make post request to chatgpt
        const chatGptResponse = await axios.post<ChatGPTApiResponseDTO>(`${this._baseUrl}/chat/completions`, 
            chatGptRequest, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this._token}`
                }
            });
        const responseData = chatGptResponse.data;
        
        const choices = responseData?.choices ?? [];

        if(choices.length > 0){
            return choices[0].message?.content ?? "";
        }
        
        return "";
    }
}