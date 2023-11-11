import {ChatGPTResponseChoice} from "./Aggregates/ChatGPTResponseChoice"

export class ChatGPTApiResponseDTO {
    public id: string;
    public object: string;
    public created: number;
    public model: string;
    public choices : ChatGPTResponseChoice[];
    
}