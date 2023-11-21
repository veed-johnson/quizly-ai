import { IAddNewQuizzes } from "../../../Application/Contracts/Features/QuizModule/IAddNewQuizzes";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService"
import { DateAndTimeUtilities } from "../../Common/Utilities/DateAndTimeUtilities";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";


export class AddNewQuizzes implements IAddNewQuizzes{
    private readonly _quizService: IQuizService;

    public constructor(quizService: IQuizService){
        this._quizService = quizService;
    }



    public execute = async (quiz_size: number = 5, categories: string = "sports, music, history, geography, movies, and science"): Promise<Quiz[]> => {
        try{
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
        catch(ex){
            // handle logs
            console.log(ex)
            return [];
        }
    }

    private addNewQuizzes = async (quiz_size: number, categories: string): Promise<Quiz[]> => {
        try{
            console.log("Here");
            const lastAddedQuizDate: Date = await this._quizService.GetLatestScheduledQuizDate();
            const newQuizStartDate: Date = DateAndTimeUtilities.AddDays(lastAddedQuizDate, 1);
            
            const questionsToExclude  = await this._quizService.GetQuestionsToExcludeFromGeneratedQuizQuestions(quiz_size);

            const generatedQuizQuestions: Partial<Quiz>[] = await this._quizService.GenerateQuizQuestions(quiz_size, categories, questionsToExclude);
            console.log("Quiz Questions => ", JSON.stringify(generatedQuizQuestions));

            const quizEntities = this._quizService.TransformQuizQuestionsToQuizEntities(generatedQuizQuestions, newQuizStartDate);
            
            return await this._quizService.InsertManyQuizAsync(quizEntities);
        }
        catch(ex){
            // handle logs
            console.log(ex)
            return [];
        }
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
}