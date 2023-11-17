import { Schema, model } from "mongoose";
import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";


const SubscriberSchema = new Schema<Subscriber>({
    createdAt: { type: Date, required: true },
    updatedAt : { type: Date, required: true },
    recordStatus: {type: String, required: true},
    
    countryCode: {type: String, required: true},
    phoneNumber: {type: String, required: true}
});

export const SubscriberModel = model<Subscriber>("AppSubscriber", SubscriberSchema)