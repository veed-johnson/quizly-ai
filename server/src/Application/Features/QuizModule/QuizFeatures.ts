import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";
import { GetCurrentQuizResponse } from "../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { IQuizFeatures } from "../../../Application/Contracts/Features/QuizModule/IQuizFeatures";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { DateAndTimeUtilities } from "../../../Application/Utilities/DateAndTimeUtilities";
import { QuestionResponse } from "../../../Application/DTO/Responses/QuizResponses/Aggregates/QuestionResponse";

export class QuizFeatures implements IQuizFeatures {
    private readonly _quizService: IQuizService;

    public constructor(quizService: IQuizService){
        this._quizService = quizService;
    }
    
    AddNewQuizzes = async (quiz_size?: number, categories?: string): Promise<Quiz[]> => {
        
        // Add Quiz in batches because generated questions at a time cannot exceed a certain limit
        let quizzesAdded: Quiz[] = [];
        let totalQuizItemsLeftToAdd = quiz_size;
        while(totalQuizItemsLeftToAdd > 0){
            const batchSizeOfQuizToAdd = this.calculateBatchSize(totalQuizItemsLeftToAdd);
            console.log({totalQuizItemsLeftToAdd, batchSizeOfQuizToAdd})
            if(batchSizeOfQuizToAdd > 0){
                const createdQuizzes = await this.addNewQuizzes(batchSizeOfQuizToAdd, categories);
                quizzesAdded.push(...createdQuizzes);
            }
            totalQuizItemsLeftToAdd -= batchSizeOfQuizToAdd;
        }

        return quizzesAdded;
        
    }
    GetQuizzesByStatus = async (status: string, page: number, pageSize: number): Promise<PaginationResponse<Quiz>> => {
        const quizzes: PaginationResponse<Quiz> = await this._quizService.GetQuizzesByStatus(status, page, pageSize);
        const referenceDateStatusIsBasedOn = DateAndTimeUtilities.GetCurrentDate();
        quizzes.items = quizzes.items.map(quiz => {
            return this._quizService.AddQuizStatusToQuizBasedOnReferenceDate(quiz, referenceDateStatusIsBasedOn)
        })
        return quizzes;
    }
    GetCurrentQuiz = async (): Promise<GetCurrentQuizResponse[]> => {
        const currentQuiz: Quiz | null =  await this._quizService.GetCurrentQuiz();
        if(currentQuiz){
            return this.transformToQuizResponse(currentQuiz);
        }
        return [];
    }

    private addNewQuizzes = async (quiz_size: number, categories: string): Promise<Quiz[]> => {
        
        const lastAddedQuizDate: Date = await this._quizService.GetLatestScheduledQuizDate();
        const newQuizStartDate: Date = DateAndTimeUtilities.AddDays(lastAddedQuizDate, 1);
        
        const questionsToExclude  = await this._quizService.GetQuestionsToExcludeFromGeneratedQuizQuestions(quiz_size);

        const generatedQuizQuestions: Partial<Quiz>[] = await this._quizService.GenerateQuizQuestions(quiz_size, categories, questionsToExclude);
        console.log("Quiz Questions => ", JSON.stringify(generatedQuizQuestions));

        const quizEntities = this._quizService.TransformQuizQuestionsToQuizEntities(generatedQuizQuestions, newQuizStartDate);
        
        return await this._quizService.InsertManyQuizAsync(quizEntities);
        
    }

    private calculateBatchSize = (totalQuizLeftToAdd: number): number => {
        const PERMITTED_BATCH_SIZE = 3; // no of quiz we can get from ai prompt at a time
        if(totalQuizLeftToAdd <= 0){
            return 0;
        }
        if(totalQuizLeftToAdd >= PERMITTED_BATCH_SIZE){
            return PERMITTED_BATCH_SIZE;
        }
        return totalQuizLeftToAdd;
    }

    private transformToQuizResponse = (quiz: Quiz): GetCurrentQuizResponse[] => {

        const currentQuizQuestionsResponse: GetCurrentQuizResponse[] = [];
        for(let question of quiz.questionsList){
            const currentQuizResponseForCategory = new GetCurrentQuizResponse()
            currentQuizResponseForCategory.category = question.category;
            currentQuizResponseForCategory.questions = question.questions.map(question => new QuestionResponse(question.question, question.clue));

            currentQuizQuestionsResponse.push(currentQuizResponseForCategory);
        }
        
        return currentQuizQuestionsResponse;
    }
   
}