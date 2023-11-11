import { IApplicationFeatureFactory } from "../../Application/Contracts/Factories/IApplicationFeatureFactory";
import { IApplicationServiceFactory } from "../../Application/Contracts/Factories/IApplicationServiceFactory";
import { applicationServiceFactory } from "./ApplicationServiceFactory";
import { IAddNewQuizzes } from "../../Application/Contracts/Features/QuizModule/IAddNewQuizzes";
import { AddNewQuizzes } from "../../Application/Features/QuizModule/AddNewQuizzes";


class ApplicationFeatureFactory implements IApplicationFeatureFactory{
    private readonly _applicationServiceFactory: IApplicationServiceFactory;

    private _addNewQuizzes: IAddNewQuizzes;
    public constructor(applicationServiceFactory: IApplicationServiceFactory){
        this._applicationServiceFactory = applicationServiceFactory;
    }

    public AddNewQuizzes = (): IAddNewQuizzes => {
        if(!this._addNewQuizzes){
            this._addNewQuizzes = new AddNewQuizzes(this._applicationServiceFactory.QuizService())
        }
        return this._addNewQuizzes;
    }
}

export const applicationFeatureFactory = new ApplicationFeatureFactory(applicationServiceFactory);