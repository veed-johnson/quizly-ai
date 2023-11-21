import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";
import { ISubscriberRepository } from "../../../Application/Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { BaseRepository } from "../Common/BaseRepository";
import { ObjectId } from "mongoose";
import { SubscriberModel } from "../../../Persistence/EntityConfigurations/SubscriptionModule/SubscriberConfiguration";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";

export class SubscriberRepository extends BaseRepository<Subscriber, ObjectId> implements ISubscriberRepository{
    public constructor(){
        super(SubscriberModel);
    }
    SubscriberExists = async (countryCode: string, phoneNumber: string): Promise<boolean> => {
        const subscriber = await this._model.findOne({phoneNumber: phoneNumber, countryCode: countryCode});
        if(subscriber && subscriber.recordStatus != RecordStatus.deleted){
            return true;
        }
        
        return false;
    }

}