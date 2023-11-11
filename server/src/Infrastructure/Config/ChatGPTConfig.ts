export class ChatGPTConfig {
    public baseUrl: string;
    public token: string;

    public constructor(baseUrl: string, token: string){
        this.baseUrl = baseUrl;
        this.token = token;
    }
}