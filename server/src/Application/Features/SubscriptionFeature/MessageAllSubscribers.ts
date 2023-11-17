import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { ISubscriberRepository } from "../../../Application/Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { IMessageService } from "../../../Application/Contracts/Services/ChatModule/IMessageService";
import { IMessageAllSubscribers } from "../../../Application/Contracts/Features/SubscriptionFeature/IMessageAllSubscribers";
import { Subscriber } from "../../../Domain/Entities/SubscriptionModule/Subscriber";

export class MessageAllSubscribers implements IMessageAllSubscribers{
    private readonly _subscriberRepository: ISubscriberRepository;
    private readonly _messageService: IMessageService

    public constructor(subscriberRepository: ISubscriberRepository, messageService: IMessageService){
        this._subscriberRepository = subscriberRepository;
        this._messageService = messageService;
    }
    /**
     * messages subscribers in batches
     */
    public execute = async (message: string): Promise<void> => {
        // get users in batchers 

        let lastItemId = null;
        const BatchSizeForMessages = 1;
        // while there are still users
        do{
            // pick the selected users
            const currentSubscribersToMessage: Subscriber[] = await this._subscriberRepository.GetPagedAsync({ recordStatus: RecordStatus.active}, lastItemId, BatchSizeForMessages);
            const lastCurrentSubscribersToMessageIndex = currentSubscribersToMessage?.length ?? 0;

            if(lastCurrentSubscribersToMessageIndex === 0){
                return 
            }
            // send message to the selected users
            await this._messageService.SendSMSToMultipleUsersAsync(currentSubscribersToMessage.map(subscriber => subscriber.phoneNumber), message);

            // update lastItemId
            lastItemId = currentSubscribersToMessage[lastCurrentSubscribersToMessageIndex - 1]._id;
        }
        while(lastItemId !== null)
        
    }
}