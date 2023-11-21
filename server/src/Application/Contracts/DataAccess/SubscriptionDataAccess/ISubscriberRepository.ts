import { ObjectId } from "mongoose";
import { Subscriber } from "../../../../Domain/Entities/SubscriptionModule/Subscriber";
import { IBaseRepository } from "../Common/IBaseRepository";


export interface ISubscriberRepository extends IBaseRepository<Subscriber, ObjectId>{
    SubscriberExists(countryCode: string, phoneNumber: string): Promise<boolean>;
}