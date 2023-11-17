import { applicationFeatureFactory } from "../../Api/Factories/ApplicationFeatureFactory";
import { infrastructureClientFactory } from "../../Api/Factories/InfrastructureClientFactory";
import { IMessageAllSubscribers } from "../../Application/Contracts/Features/SubscriptionFeature/IMessageAllSubscribers";
import { IScheduler } from "../../Application/Contracts/Schedulers/IScheduler";




class SendMessageToUsersScheduler{
    private readonly _iScheduler: IScheduler;
    private readonly _messageAllSubscribers: IMessageAllSubscribers;

    public constructor(iScheduler: IScheduler, messageAllSubscribers: IMessageAllSubscribers){
        this._iScheduler = iScheduler;
        this._messageAllSubscribers = messageAllSubscribers;
    }
    public execute = () => {
        
        this._iScheduler.Execute("sendMessagesToUsers", '0 0 * * *', this.sendMessagesToUsers, (ex) => console.log(ex));
    }

    private sendMessagesToUsers =async () => {
        console.log("Loading...")
        await this._messageAllSubscribers.execute("testing the microphone");
        console.log("done...")
    }
}

export const sendMessageToUsersScheduler = new SendMessageToUsersScheduler(infrastructureClientFactory.Scheduler(), applicationFeatureFactory.MessageAllSubscribers());


