import { Subscriber } from "../../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";

export interface IAddSubscriber{
    execute(addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber>
}