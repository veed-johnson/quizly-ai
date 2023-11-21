import { ObjectId } from "mongoose";
import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";
import { DeleteQuizByStatusRequest } from "../../../../Application/DTO/Requests/QuizRequests/DeleteQuizByStatusRequest";

export interface IQuizService{
    InsertManyQuizAsync (quizList: Quiz[] ): Promise<Quiz[]>;
    GenerateQuizQuestions(size: number, categories: string, questionsToExcludeFromGeneratedQuestions: Partial<Quiz>[]): Promise<Partial<Quiz>[]> 

    GetQuizzesByStatus(status: string, page: number, pageSize: number) : Promise<PaginationResponse<Quiz>>
    GetLatestScheduledQuizDate(): Promise<Date>;
    GetQuestionsToExcludeFromGeneratedQuizQuestions(numberOfQuestionsNotToRepeat: number): Promise<Partial<Quiz>[]>;
    GetCurrentQuiz(): Promise<Quiz | null>
    GetQuizById(id: ObjectId): Promise<Quiz | null>;
    GetAllQuizzes(page: number, pageSize: number, sort?: {[key in keyof Partial<Quiz>]: number} ): Promise<PaginationResponse<Quiz>>
    
    UpdateQuiz(quiz: Quiz): Promise<Quiz>;
    UpdateAllCurrentQuizToArchived(): Promise<number>;
    UpdateQuizStatusToLive (quiz: Quiz): Promise<Quiz>;
    UpdateQuizToLiveUsingId(id: ObjectId): Promise<Quiz>

    AddQuizStatusToQuizBasedOnReferenceDate(quiz: Quiz, referenceDate: Date): Quiz;
    TransformQuizQuestionsToQuizEntities(quizQuestions: Partial<Quiz>[], startDateForQuiz: Date): Quiz[];

    DeleteQuizByStatus(deleteQuizByStatusRequest: DeleteQuizByStatusRequest): Promise<number>
    
}