import { ChatGPTPromptMessage } from "./Aggregates/ChatGPTPromptMessage";

export class ChatgptRequest{
    public model: string = "gpt-3.5-turbo";
    public messages: ChatGPTPromptMessage[]
    
}