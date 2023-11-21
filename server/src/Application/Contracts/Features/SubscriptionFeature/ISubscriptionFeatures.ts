import { Subscriber } from "../../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { PaginatedQueryParamsRequest } from "../../../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { ObjectId } from "mongoose";

export interface ISubscriptionFeatures {
    
    AddSubscriber(addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber>;
    MessageAllSubscribers (message: string): Promise<void>;
    GetAllSubscribers(pageDetails: PaginatedQueryParamsRequest): Promise<PaginationResponse<Subscriber>>;
    DeleteSubscriber(id: string): Promise<void>
    MessageSubscriber(subscriber: Subscriber, message: string): Promise<void>
    
}