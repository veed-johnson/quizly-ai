import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { IAddSubscriber } from "../../../Application/Contracts/Features/SubscriptionFeature/IAddSubscriber";
import { ISubscriptionService } from "../../../Application/Contracts/Services/SubscriberService/ISubscriptionService";


export class AddSubscriber implements IAddSubscriber{
    private readonly _subscriptionService: ISubscriptionService;

    public constructor(subscriptionService: ISubscriptionService){
        this._subscriptionService = subscriptionService;
    }
    public execute = async (addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber> => {
        return await this._subscriptionService.AddSubscriber(addSubscriberRequest);
    }
}