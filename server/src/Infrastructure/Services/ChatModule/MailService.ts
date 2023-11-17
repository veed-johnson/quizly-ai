import { EmailType } from "../../../Application/Common/ApplicationEnums/EmailType";
import { IMailService } from "../../../Application/Contracts/Services/ChatModule/IMailService";
import {Transporter, createTransport} from 'nodemailer';
import { NodeMailerConfig } from "../../../Infrastructure/Config/NodeMailerConfig";
import { EmailTemplate } from "../../../Infrastructure/Common/EmailTemplate";

export class MailService implements IMailService {
    private readonly transporter: Transporter;
    private readonly senderEmail: string;
    public constructor(mailConfig: NodeMailerConfig){
        const transporter: Transporter = createTransport({
            service: mailConfig.MAIL_SERVICE,
            host: mailConfig.MAIL_HOST,
            port: mailConfig.MAIL_PORT,
            auth: {
                user: mailConfig.MAIL_ADDRESS,
                pass: mailConfig.MAIL_PASSWORD,
            }
          });
        
        this.transporter = transporter;
        this.senderEmail = mailConfig.MAIL_ADDRESS;
    }
    sendMail = async(to: string, title: string, message: string, type: EmailType = EmailType.html): Promise<boolean> => {
        try{
            let mailDetails = {
                from: this.senderEmail, // sender address
                to: to, // list of receivers
                subject: title, // Subject line
                text: message, // plain text body
                html: message, // html body
              }
            switch(type){
                case EmailType.html:
                    mailDetails.html = EmailTemplate.getHTMLTemplateForEmail(title, message)
                    break;
                }
                
            const info = await this.transporter.sendMail(mailDetails);
            return true;
        }
        catch(ex){
            return false;
        }
    }
    sendMailToMultipleRecipients = async (recipients: string[], title: string, message: string, type: EmailType = EmailType.html): Promise<boolean> => {
        try{
            const emailRecipients = recipients.join(", ");
            return await this.sendMail(emailRecipients, title, message, type);
        }
        catch(ex){
            return false;
        }
    }
    
}