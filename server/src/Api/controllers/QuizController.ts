import { IAddNewQuizzes } from "Application/Contracts/Features/QuizModule/IAddNewQuizzes";
import { Request, Response } from "express";


export class QuizController {
    private readonly _addNewQuizzes: IAddNewQuizzes;
    public constructor(addNewQuizzes: IAddNewQuizzes){
        this._addNewQuizzes = addNewQuizzes;
    }

    public AddNewQuizzes = async (request: Request, response: Response): Promise<Response> => {
        await this._addNewQuizzes.execute(2);
        return response.json({"Hello": "hi"});   
    }
}