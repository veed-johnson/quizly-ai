import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { ISubscriberRepository } from "../../Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { ISubscriptionService } from "../../../Application/Contracts/Services/SubscriberService/ISubscriptionService";

export class SubscriptionService implements ISubscriptionService {
    private readonly _subscriberRepository: ISubscriberRepository; 

    public constructor(subscriberRepository: ISubscriberRepository){
        this._subscriberRepository = subscriberRepository;
    }
    public AddSubscriber = async (addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber> => {
        // validate subscriber details

        // transform AddSubscriberRequest to Subscriber
        let subscriber = new Subscriber();
        subscriber.phoneNumber = addSubscriberRequest.phoneNumber,
        subscriber.countryCode = addSubscriberRequest.countryCode;
        
        // check if subscriber already exists
        const doesSubscriberExist = await this._subscriberRepository.SubscriberExists(subscriber.phoneNumber);
        if(doesSubscriberExist){
            return subscriber;
        }
        
        return await this._subscriberRepository.AddAsync(subscriber);
    }
}