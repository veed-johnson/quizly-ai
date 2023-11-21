import { IQuizFeatures } from "Application/Contracts/Features/QuizModule/IQuizFeatures";
import { NextFunction, Request, Response } from "express";
import { GetQuizByStatusQueryParams } from "../../Application/DTO/Requests/QuizRequests/GetQuizByStatusQueryParams";
import { AddNewQuizRequest } from "../../Application/DTO/Requests/QuizRequests/AddNewQuizRequest";
import { PaginatedQueryParamsRequest } from "../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { EditSingleQuizQuestionRequest } from "../../Application/DTO/Requests/QuizRequests/EditSingleQuizQuestionRequest";
import { QuizIdParam } from "../../Application/DTO/Requests/QuizRequests/QuizIdParam";
import { DeleteQuizByStatusRequest } from "../../Application/DTO/Requests/QuizRequests/DeleteQuizByStatusRequest";


export class QuizController {
    private readonly _quizFeatures: IQuizFeatures;
   
    public constructor(quizFeatures: IQuizFeatures){
        this._quizFeatures = quizFeatures;
    }

    public AddNewQuizzes = async (request: Request<{}, {}, AddNewQuizRequest, {}>, response: Response, next: NextFunction)=> {
        try{
            // done to set default value for categories
            let {quizSize, categories} = new AddNewQuizRequest(request.body.quizSize, request.body.categories);
            await this._quizFeatures.AddNewQuizzes(quizSize, categories)
            return response.status(200).json({});
        }
        catch(ex){
            next(ex)
        }
    }

    public GetCurrentQuiz  = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const currentQuiz =  await this._quizFeatures.GetCurrentQuiz();
            return response.status(200).json(currentQuiz);
        }
        catch(ex){
            next(ex);
        }
    }

    public GetQuizzesByStatus = async (request: Request<{}, {}, {}, GetQuizByStatusQueryParams>, response: Response, next: NextFunction) => {
        try{
            const {page, pageSize, status} = new GetQuizByStatusQueryParams(request.query.page, request.query.pageSize, request.query.status)
            const quizResponse = await this._quizFeatures.GetQuizzesByStatus(status, page, pageSize);

            return response.status(200).json(quizResponse);
        }
        catch(ex){
            next(ex);
        }
    }

    public GetAllQuizzes = async (request: Request<{}, {}, {}, PaginatedQueryParamsRequest>, response: Response, next: NextFunction) => {
        try{
            const {page, pageSize} = new PaginatedQueryParamsRequest(request.query.page, request.query.pageSize);
            const currentPageQuizzes = await this._quizFeatures.GetAllQuizzes(page, pageSize);
            return response.status(200).json(currentPageQuizzes);
        }
        catch(ex){
            next(ex);
        }
    }

    public EditSingleQuizQuestion = async (request: Request<{}, {}, EditSingleQuizQuestionRequest, {}>, response: Response, next: NextFunction) => {
        try{
            const editedQuizQuestion = await this._quizFeatures.EditSingleQuizQuestion(request.body);
            return response.status(200).json(editedQuizQuestion);
        }
        catch(ex){
            next(ex)
        }
    } 

    public UpdateQuizStatusToLive = async (request: Request<QuizIdParam, {}, {}, {}>, response: Response, next: NextFunction) => {
        try{
            const {id} = request.params;
            const quizUpdatedToLive = await this._quizFeatures.UpdateQuizStatusToLive(id);
            return response.status(200).json(quizUpdatedToLive);
        }
        catch(ex){
            next(ex);
        }
    }

    public DeleteQuizByStatus = async (request: Request< {}, {}, DeleteQuizByStatusRequest>, response: Response, next: NextFunction) => {
        try{
            // necessary to set default values in case user doesn't include them
            const deleteQuizByStatusRequest = new DeleteQuizByStatusRequest(request.body.status, request.body.softDelete, request.body.referenceDate);
            
            const deletedQuizCount = await this._quizFeatures.DeleteQuizByStatusRequest(deleteQuizByStatusRequest);
            return response.status(200).json({deletedQuizCount});
        }
        catch(ex){
            next(ex);
        }
    }
}