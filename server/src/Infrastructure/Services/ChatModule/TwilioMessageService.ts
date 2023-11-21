import { TwilioConfig } from "Infrastructure/Config/TwilioConfig";
import { IMessageService } from "../../../Application/Contracts/Services/ChatModule/IMessageService";
import twilio, { Twilio } from "twilio";

export class TwilioMessageService implements IMessageService{
    private readonly _twillio: Twilio;
    private readonly _twillioPhoneNumber: string;

    public constructor(twilioConfig: TwilioConfig){

        this._twillio = twilio(twilioConfig.TWILIO_SID, twilioConfig.TWILIO_AUTH_TOKEN);
        this._twillioPhoneNumber = twilioConfig.TWILIO_NUMBER;
    }

    SendSMSToMultipleUsersAsync = async (users: string[], message: string): Promise<boolean> => {
        console.log({users})
        let notSentPhoneNumbers = [];
        let sendMessageResponse = null;
        for(let userPhone of users){
            try{
                sendMessageResponse = await this._twillio.messages.create({
                    body: message,
                    from: this._twillioPhoneNumber,
                    to: userPhone
                  })
                  
            }
            catch(ex){
                console.log({ex})
                notSentPhoneNumbers.push(userPhone);
            }
        }
        console.log({sendMessageResponse})
        return notSentPhoneNumbers.length === 0;
    }

    SendSMSToSingleUserAsync = async (user: string, message: string): Promise<boolean> => {
        try{
            const sendMessageResponse = await this._twillio.messages.create({
                body: message,
                from: this._twillioPhoneNumber,
                to: user
            })
            console.log({sendMessageResponse})
            return true;
        }
        catch(ex){
            return false;
        }
    }

}