import { GetCurrentQuizResponse } from "../../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";
import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";

export interface IQuizFeatures {
    AddNewQuizzes(quiz_size?: number, categories?: string): Promise<Quiz[]>;
    GetQuizzesByStatus(status: string, page: number, pageSize: number): Promise<PaginationResponse<Quiz>>;
    GetCurrentQuiz(): Promise<GetCurrentQuizResponse[]>
}