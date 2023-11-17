import { IQuizRepository } from "Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { QuizRepository } from "../../Persistence/DataAccess/QuizModule/QuizRepository";
import { IPersistenceFactory } from "Application/Contracts/Factories/IPersistenceFactory";
import { ISubscriberRepository } from "../../Application/Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { SubscriberRepository } from "../../Persistence/DataAccess/SubscriptionModule/SubscriberRepository";


export class PersistenceFactory implements IPersistenceFactory {
    private _quizRepository: IQuizRepository;
    private _subscriberRepository: ISubscriberRepository;
    public QuizRepository = (): IQuizRepository => {
        if(!this._quizRepository){
            this._quizRepository = new QuizRepository();
        }
        return this._quizRepository;
    }


    public SubscriberRepository = (): ISubscriberRepository => {
        if(!this._subscriberRepository){
            this._subscriberRepository = new SubscriberRepository();
        }
        return this._subscriberRepository;
    }
}

export const persistenceFactory = new PersistenceFactory();