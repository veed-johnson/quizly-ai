import { Quiz } from "Domain/Entities/QuizModule/Quiz";

export interface IQuizService{
    GenerateQuizQuestions(size: number, categories: string, questionsToExcludeFromGeneratedQuestions: Quiz[]): Promise<Partial<Quiz>[]>
    GetLatestScheduledQuizDate(): Promise<Date>;
    GetQuestionsToExcludeFromGeneratedQuizQuestions(numberOfQuestionsNotToRepeat: number): Promise<Quiz[]>;
    TransformQuizQuestionsToQuizEntities(quizQuestions: Partial<Quiz>[], startDateForQuiz: Date): Quiz[];
    InsertManyQuizAsync (quizList: Quiz[] ): Promise<Quiz[]>;
}