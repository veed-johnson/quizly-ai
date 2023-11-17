import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { Quiz } from "../../../../Domain/Entities/QuizModule/Quiz";

export interface IQuizService{
    InsertManyQuizAsync (quizList: Quiz[] ): Promise<Quiz[]>;

    GetQuizzesByStatus(status: string, page: number, pageSize: number) : Promise<PaginationResponse<Quiz>>
    GenerateQuizQuestions(size: number, categories: string, questionsToExcludeFromGeneratedQuestions: Partial<Quiz>[]): Promise<Partial<Quiz>[]> 
    GetLatestScheduledQuizDate(): Promise<Date>;
    GetQuestionsToExcludeFromGeneratedQuizQuestions(numberOfQuestionsNotToRepeat: number): Promise<Partial<Quiz>[]>;
    TransformQuizQuestionsToQuizEntities(quizQuestions: Partial<Quiz>[], startDateForQuiz: Date): Quiz[];
    GetCurrentQuiz(): Promise<Quiz | null>

    AddQuizStatusToQuizBasedOnReferenceDate(quiz: Quiz, referenceDate: Date): Quiz;
}