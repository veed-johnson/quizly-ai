
export class TwilioConfig {
    TWILIO_SID: string
    TWILIO_AUTH_TOKEN: string;
    TWILIO_NUMBER: string;

    public constructor(accountSid: string, authToken: string, twilioPhoneNumber: string){
        this.TWILIO_SID = accountSid;
        this.TWILIO_AUTH_TOKEN = authToken;
        this.TWILIO_NUMBER = twilioPhoneNumber;
    }
}