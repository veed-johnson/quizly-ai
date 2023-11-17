import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";

export interface IGetQuizzesByStatus{
    execute(status: string, page: number, pageSize: number): Promise<PaginationResponse<Quiz>>
}