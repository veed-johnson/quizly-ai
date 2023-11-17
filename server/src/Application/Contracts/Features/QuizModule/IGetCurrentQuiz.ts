import { GetCurrentQuizResponse } from "../../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";

export interface IGetCurrentQuiz{
    execute(): Promise<GetCurrentQuizResponse[]>
}