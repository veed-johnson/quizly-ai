import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService"
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { DateAndTimeUtilities } from "../../Common/Utilities/DateAndTimeUtilities";
import { IGetQuizzesByStatus } from "../../../Application/Contracts/Features/QuizModule/IGetQuizzesByStatus";

export class GetQuizzesByStatus implements IGetQuizzesByStatus{
    private readonly _quizService: IQuizService;
    public constructor(quizService: IQuizService){
        this._quizService = quizService;
    }

    public execute = async (status: string, page: number, pageSize: number): Promise<PaginationResponse<Quiz>> => {
        const quizzes: PaginationResponse<Quiz> = await this._quizService.GetQuizzesByStatus(status, page, pageSize);
        const referenceDateStatusIsBasedOn = DateAndTimeUtilities.GetCurrentSydneyDayStartTime();
        quizzes.items = quizzes.items.map(quiz => {
            return this._quizService.AddQuizStatusToQuizBasedOnReferenceDate(quiz, referenceDateStatusIsBasedOn)
        })
        return quizzes;
    }


}