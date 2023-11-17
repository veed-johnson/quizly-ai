import { EmailType } from "../../../Common/ApplicationEnums/EmailType";

export interface IMailService {
    sendMail(to: string, title: string, message: string, type?: EmailType): Promise<boolean>;
    sendMailToMultipleRecipients(recipients: string[], title: string, message: string, type?: EmailType): Promise<boolean>;
}