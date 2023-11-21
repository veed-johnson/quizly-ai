import { ObjectId } from "mongoose";
import { PaginatedQueryParamsRequest } from "../../../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Subscriber } from "../../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../../DTO/Requests/SubscriberRequests/AddSubscriberRequest";

export interface ISubscriptionService {
    AddSubscriber(addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber>;
    GetAllSubscribers(pageDetails: PaginatedQueryParamsRequest): Promise<PaginationResponse<Subscriber>>
    GetSubscribersUsingKeyPagination(lastItemId: ObjectId, pageSize: number): Promise<Subscriber[]> 
    DeleteSubscriber(id: ObjectId): Promise<void>;
}