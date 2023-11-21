import { AddSubscriberRequest } from "../../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { ISubscriptionService } from "../../../Application/Contracts/Services/SubscriberService/ISubscriptionService";
import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";
import { ISubscriberRepository } from "../../../Application/Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { IMessageService } from "../../../Application/Contracts/Services/ChatModule/IMessageService";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { ISubscriptionFeatures } from "../../../Application/Contracts/Features/SubscriptionFeature/ISubscriptionFeatures";
import { PaginatedQueryParamsRequest } from "../../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";
import mongoose, { ObjectId, Schema, Types, mongo } from "mongoose";
import { AddSubscriberRequestValidator } from "./Validations/AddSubscriberRequestValidator";
import { ObjectUtilities } from "../../../Application/Common/Utilities/ObjectUtilties";
import { ValidationException } from "../../../Application/Common/Exceptions/ValidationException";

export class SubscriptionFeatures implements ISubscriptionFeatures{
    private readonly _subscriptionService: ISubscriptionService;
    private readonly _messageService: IMessageService;

    public constructor(subscriptionService: ISubscriptionService, messageService: IMessageService){
        this._subscriptionService = subscriptionService;
        this._messageService = messageService;
    }
    
    public AddSubscriber = async (addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber> => {
        // TODO: validate subscriber details
        const addSubscriberRequestValidator = new AddSubscriberRequestValidator();
        const validationResult = await addSubscriberRequestValidator.validateAsync(addSubscriberRequest);
        if(!ObjectUtilities.IsEmptyObject(validationResult)){
            throw new ValidationException("AddSubscriber: Validation errors", validationResult);
        }
        
        return await this._subscriptionService.AddSubscriber(addSubscriberRequest);
    }

    /**
     * messages subscribers in batches
     */
    public MessageAllSubscribers = async (message: string): Promise<void> => {
        // get users in batchers 

        let lastItemId = null;
        const BatchSizeForMessages = 1;
        // while there are still users
        do{
            // pick the selected users
            const currentSubscribersToMessage: Subscriber[] = await this._subscriptionService.GetSubscribersUsingKeyPagination(lastItemId, BatchSizeForMessages);
            const lastCurrentSubscribersToMessageIndex = currentSubscribersToMessage?.length ?? 0;

            if(lastCurrentSubscribersToMessageIndex === 0){
                return 
            }
            // send message to the selected users
            const subscriberPhoneNumber : (subscriber: Subscriber) => string =  (subscriber: Subscriber) => subscriber.countryCode + subscriber.phoneNumber;
            await this._messageService.SendSMSToMultipleUsersAsync(currentSubscribersToMessage.map(this.GetSubscriberPhoneNumber), message);

            // update lastItemId
            lastItemId = currentSubscribersToMessage[lastCurrentSubscribersToMessageIndex - 1]._id;
        }
        while(lastItemId !== null)
        
    }

    public GetAllSubscribers = async (pageDetails: PaginatedQueryParamsRequest): Promise<PaginationResponse<Subscriber>> => {
        return await this._subscriptionService.GetAllSubscribers(pageDetails)
    }
    
    public DeleteSubscriber = async (id: string): Promise<void> => {
        const objectId: ObjectId = new mongo.ObjectId(id) as unknown as ObjectId;
        
        // please revisit
        await this._subscriptionService.DeleteSubscriber(objectId);
    }

    private GetSubscriberPhoneNumber: (subscriber: Subscriber) => string =  (subscriber: Subscriber) => {
        const INTERNATIONAL_DESIGNATOR = "+"
        let countryCode: string = subscriber.countryCode;

        if(subscriber.countryCode[0] !== INTERNATIONAL_DESIGNATOR){
            countryCode = `${INTERNATIONAL_DESIGNATOR}${countryCode}`;
        }
        return countryCode + subscriber.phoneNumber;
    }

    public MessageSubscriber = async (subscriber: Subscriber, message: string): Promise<void> => {
        // get subscriber phone number;
        const userPhoneNumber: string = this.GetSubscriberPhoneNumber(subscriber);
        console.log({userPhoneNumber})
        // message subscriber
        await this._messageService.SendSMSToSingleUserAsync(userPhoneNumber, message)
    }


}