import { IQuizRepository } from "Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { QuizRepository } from "../../Persistence/DataAccess/QuizModule/QuizRepository";
import { IPersistenceFactory } from "Application/Contracts/Factories/IPersistenceFactory";


export class PersistenceFactory implements IPersistenceFactory {
    private _quizRepository: IQuizRepository;

    public QuizRepository = (): IQuizRepository => {
        if(!this._quizRepository){
            this._quizRepository = new QuizRepository();
        }
        return this._quizRepository;
    }
}

export const persistenceFactory = new PersistenceFactory();