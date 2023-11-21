import { GetCurrentQuizResponse } from "../../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";
import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";
import { EditSingleQuizQuestionRequest } from "../../../../Application/DTO/Requests/QuizRequests/EditSingleQuizQuestionRequest";
import { DeleteQuizByStatusRequest } from "../../../../Application/DTO/Requests/QuizRequests/DeleteQuizByStatusRequest";

export interface IQuizFeatures {
    AddNewQuizzes(quiz_size?: number, categories?: string): Promise<Quiz[]>;

    GetQuizzesByStatus(status: string, page: number, pageSize: number): Promise<PaginationResponse<Quiz>>;
    GetCurrentQuiz(): Promise<GetCurrentQuizResponse[]>;
    GetAllQuizzes(page: number, pageSize: number, sort?: {[key in keyof Partial<Quiz>]: number}) : Promise<PaginationResponse<Quiz>>

    EditSingleQuizQuestion(editQuestionRequest: EditSingleQuizQuestionRequest): Promise<Quiz> 
    UpdateQuizStatusToLive(id: string): Promise<Quiz>;

    DeleteQuizByStatusRequest(deleteQuizByStatusRequest: DeleteQuizByStatusRequest): Promise<number> 
}