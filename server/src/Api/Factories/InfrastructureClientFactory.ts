import { IScheduler } from "../../Application/Contracts/Schedulers/IScheduler";
import { appSettings } from "../../Api/appSettings";
import { IChatClient } from "../../Application/Contracts/ApiClients/ChatModule/IChatClient";
import { IInfrastructureClientFactory } from "../../Application/Contracts/Factories/IInfrastructureClientFactory";
import { ChatGPTClient } from "../../Infrastructure/ApiClient/ChatModule/ChatGPTClient";
import { ChatGPTConfig } from "../../Infrastructure/Config/ChatGPTConfig";
import { Scheduler } from "../../Infrastructure/Schedulers/Scheduler";
import { TwilioConfig } from "../../Infrastructure/Config/TwilioConfig";
import { IMessageService } from "../../Application/Contracts/Services/ChatModule/IMessageService";
import { TwilioMessageService } from "../../Infrastructure/Services/ChatModule/TwilioMessageService";
import { NodeMailerConfig } from "../../Infrastructure/Config/NodeMailerConfig";
import { IMailService } from "../../Application/Contracts/Services/ChatModule/IMailService";
import { MailService } from "../../Infrastructure/Services/ChatModule/MailService";
import { IAuthService } from "../../Application/Contracts/Services/AuthenticationServiceModule/IAuthService";
import { JwtService } from "../../Infrastructure/Services/ChatModule/JwtService";
import { JwtConfig } from "../../Infrastructure/Config/JwtConfig";

 class InfrastructureClientFactory implements IInfrastructureClientFactory{
    private readonly _chatGptConfig: ChatGPTConfig;
    private readonly _twilioConfig: TwilioConfig;
    private readonly _nodeMailerConfig: NodeMailerConfig;
    private readonly _jwtConfig: JwtConfig;
    private _chatClient:  IChatClient;
    private _scheduler: IScheduler;
    private _messageService: IMessageService;
    private _mailService: IMailService;
    private _authService: IAuthService;

    public constructor(chatGPTConfig: ChatGPTConfig, twilioConfig: TwilioConfig, nodeMailerConfig: NodeMailerConfig, jwtConfig: JwtConfig){
        this._chatGptConfig = chatGPTConfig;
        this._twilioConfig = twilioConfig;
        this._nodeMailerConfig = nodeMailerConfig;
        this._jwtConfig = jwtConfig;
    }

    public ChatClient =  (): IChatClient => {
        if(!this._chatClient){
            this._chatClient = new ChatGPTClient(this._chatGptConfig);
        }
        return this._chatClient;
    }

    public Scheduler = (): IScheduler => {
        if(!this._scheduler){
            this._scheduler = new Scheduler();
        }
        return this._scheduler;
    }

    public MessageService = (): IMessageService => {
        if(!this._messageService){
            this._messageService = new TwilioMessageService(this._twilioConfig);
        }
        return this._messageService;
    }

    public MailService = (): IMailService => {
        if(!this._mailService){
            this._mailService = new MailService(this._nodeMailerConfig);
        }
        return this._mailService;
    }

    public AuthService = (): IAuthService => {
        if(!this._authService){
            this._authService = new JwtService(this._jwtConfig);
        }

        return this._authService;
    }
}


const chatGptConfigOptions = {
    chatGptBaseUrl: appSettings.CHATGPT_BASE_URL,
    chatGptToken: appSettings.CHATGPT_TOKEN
}
const chatGPTConfig : ChatGPTConfig = new ChatGPTConfig(chatGptConfigOptions.chatGptBaseUrl, chatGptConfigOptions.chatGptToken)

const twilioConfigOptions = {
    TWILIO_SID: appSettings.TWILIO_SID,
    TWILIO_AUTH_TOKEN: appSettings.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER: appSettings.TWILIO_NUMBER
}
const twilioConfig = new TwilioConfig(twilioConfigOptions.TWILIO_SID, twilioConfigOptions.TWILIO_AUTH_TOKEN, twilioConfigOptions.TWILIO_NUMBER);

const nodeMailerConfigOptions = {
    MAIL_ADDRESS : appSettings.MAIL_ADDRESS,
    MAIL_PASSWORD: appSettings.MAIL_PASSWORD,
    MAIL_SERVICE: appSettings.MAIL_SERVICE,
    MAIL_HOST: appSettings.MAIL_HOST,
    MAIL_PORT: Number(appSettings.MAIL_PORT)
}
const nodeMailerConfig = new NodeMailerConfig(nodeMailerConfigOptions.MAIL_ADDRESS, 
    nodeMailerConfigOptions.MAIL_PASSWORD,
    nodeMailerConfigOptions.MAIL_SERVICE, 
    nodeMailerConfigOptions.MAIL_HOST,
    nodeMailerConfigOptions.MAIL_PORT);

const jwtConfigOptions = {
    JWT_KEY: appSettings.JWT_KEY
}

const jwtConfig = new JwtConfig(jwtConfigOptions.JWT_KEY);

export const infrastructureClientFactory = new InfrastructureClientFactory(chatGPTConfig, twilioConfig, nodeMailerConfig, jwtConfig);


