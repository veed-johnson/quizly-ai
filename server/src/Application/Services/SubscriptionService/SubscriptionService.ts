import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { ISubscriberRepository } from "../../Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { ISubscriptionService } from "../../../Application/Contracts/Services/SubscriberService/ISubscriptionService";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { PaginatedQueryParamsRequest } from "../../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";
import { ObjectId } from "mongoose";
import { SubscriberExistsException } from "../../../Application/Common/Exceptions/SubscriberExistsException";

export class SubscriptionService implements ISubscriptionService {
    private readonly _subscriberRepository: ISubscriberRepository; 

    public constructor(subscriberRepository: ISubscriberRepository){
        this._subscriberRepository = subscriberRepository;
    }
    /**
     * Soft deletes a subscriber
     * @param id 
     */
    DeleteSubscriber = async (id: ObjectId ): Promise<void> => {
        const subscriberUpdatedToDeleted = {recordStatus: RecordStatus.deleted};
        const subscriber = await this._subscriberRepository.UpdateByIdAsync(id, subscriberUpdatedToDeleted);

    }
    public AddSubscriber = async (addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber> => {
        
        // check if subscriber already exists
        let subscriber: Subscriber | null = await this.GetSubscriber(addSubscriberRequest.countryCode, addSubscriberRequest.phoneNumber);
        if(subscriber){
            if(subscriber.recordStatus !== RecordStatus.deleted){
                throw new SubscriberExistsException(`user with phone number ${subscriber.countryCode}${subscriber.phoneNumber} already exists`);
            }
        }
        else{
            subscriber = new Subscriber();
            subscriber.phoneNumber = addSubscriberRequest.phoneNumber,
            subscriber.countryCode = addSubscriberRequest.countryCode;
        }
        
        return await this._subscriberRepository.AddAsync(subscriber);
    }

    public GetSubscriber = async (countryCode: string, phoneNumber: string): Promise<Subscriber | null> => {
        return await this._subscriberRepository.FirstOrDefaultAsync({countryCode: countryCode, phoneNumber: phoneNumber});
    }

    public GetAllSubscribers = async (pageDetails: PaginatedQueryParamsRequest): Promise<PaginationResponse<Subscriber>> => {
        const query = {recordStatus: {$ne: RecordStatus.deleted}}
        const queryResponse = await this._subscriberRepository.ToPagedAsync(query, pageDetails.page, pageDetails.pageSize);

        return queryResponse;
    }



    public GetSubscribersUsingKeyPagination = async (lastItemId: ObjectId, pageSize: number): Promise<Subscriber[]>  => {
        const subscribers: Subscriber[] = await this._subscriberRepository.GetPagedAsync({ recordStatus: RecordStatus.active}, lastItemId, pageSize);
        return subscribers;
    }
}