export class NodeMailerConfig {
    MAIL_ADDRESS: string;
    MAIL_PASSWORD: string;
    MAIL_SERVICE: string;
    MAIL_HOST: string;
    MAIL_PORT: number;
    public constructor(mailaddress: string, mailPassword: string, mailService: string, mailHost: string, mailPort: number){
        this.MAIL_ADDRESS = mailaddress;
        this.MAIL_PASSWORD = mailPassword;
        this.MAIL_SERVICE = mailService;
        this.MAIL_HOST = mailHost;
        this.MAIL_PORT = mailPort;
    }
}