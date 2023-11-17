import { IQuizFeatures } from "Application/Contracts/Features/QuizModule/IQuizFeatures";
import { Request, Response } from "express";
import { GetQuizByStatusQueryParams } from "../../Application/DTO/Requests/QuizRequests/GetQuizByStatusQueryParams";


export class QuizController {
    private readonly _quizFeatures: IQuizFeatures;
   
    public constructor(quizFeatures: IQuizFeatures){
        this._quizFeatures = quizFeatures;
    }

    public AddNewQuizzes = async (request: Request, response: Response): Promise<Response> => {
        await this._quizFeatures.AddNewQuizzes(2)
        return response.status(200).json({});
    }

    public GetCurrentQuiz  = async (request: Request, response: Response): Promise<Response> => {
        const currentQuiz =  await this._quizFeatures.GetCurrentQuiz();
        return response.status(200).json(currentQuiz);
    }

    public GetQuizzesByStatus = async (request: Request<{}, {}, {}, GetQuizByStatusQueryParams>, response: Response) => {
        const page = Number(request.query.page) ?? 0;
        const pageSize = Number(request.query.pageSize) ?? 0;
        const status = request.query.status ?? "";

        const quizResponse = await this._quizFeatures.GetQuizzesByStatus(status, page, pageSize);

        return response.status(200).json(quizResponse);
    }

}