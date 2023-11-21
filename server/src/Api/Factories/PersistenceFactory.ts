import { IQuizRepository } from "Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { QuizRepository } from "../../Persistence/DataAccess/QuizModule/QuizRepository";
import { IPersistenceFactory } from "Application/Contracts/Factories/IPersistenceFactory";
import { ISubscriberRepository } from "../../Application/Contracts/DataAccess/SubscriptionDataAccess/ISubscriberRepository";
import { SubscriberRepository } from "../../Persistence/DataAccess/SubscriptionModule/SubscriberRepository";
import { IUserRepository } from "../../Application/Contracts/DataAccess/AuthenticationDataAccess/IUserRepository";
import { UserRepository } from "../../Persistence/DataAccess/AuthenticationModule/UserRepository";


export class PersistenceFactory implements IPersistenceFactory {
    private _quizRepository: IQuizRepository | undefined;
    private _subscriberRepository: ISubscriberRepository | undefined;
    private _userRepository: IUserRepository | undefined;

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

    public UserRepository = (): IUserRepository => {
        if(!this._userRepository){
            this._userRepository = new UserRepository();
        }
        return this._userRepository;
    }
}

export const persistenceFactory = new PersistenceFactory();