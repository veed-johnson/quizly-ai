import { Subscriber } from "../../../../Domain/Entities/SubscriptionModule/Subscriber";
import { AddSubscriberRequest } from "../../../DTO/Requests/SubscriberRequests/AddSubscriberRequest";

export interface ISubscriptionService {
    AddSubscriber(addSubscriberRequest: AddSubscriberRequest): Promise<Subscriber>;
}