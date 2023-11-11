export interface IChatClient {
    PostPromptQuery (prompt: string): Promise<string>;
}