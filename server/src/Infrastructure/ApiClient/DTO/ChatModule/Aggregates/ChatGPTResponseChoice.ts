

export class ChatGPTResponseChoice{
    public index: number;
    public message: {
        role: string,
        content: string,
        
        [key: string]: any
    };
    finish_reason?: string;
    [key: string]: any;
}