
export interface IChatService{
    GetResponseForPrompt(prompt: string): Promise<string>;
}