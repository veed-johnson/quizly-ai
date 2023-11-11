import { IAddNewQuizzes } from "../../../Application/Contracts/Features/QuizModule/IAddNewQuizzes";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService"
import { DateAndTimeUtilities } from "../../../Application/Utilities/DateAndTimeUtilities";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";


export class AddNewQuizzes implements IAddNewQuizzes{
    private readonly _quizService: IQuizService;

    public constructor(quizService: IQuizService){
        this._quizService = quizService;
    }

    public execute = async (quiz_size: number = 5, categories: string = "sports, music, history, geography, movies, and science"): Promise<Quiz[]> => {
        // get last added quiz date and add 1 day to it
        const lastAddedQuizDate: Date = await this._quizService.GetLatestScheduledQuizDate();
        const newQuizStartDate: Date = DateAndTimeUtilities.AddDays(lastAddedQuizDate, 1);
        
        // get quiz questions to be excluded from newly genereated quiz questions
        const questionsToExclude = await this._quizService.GetQuestionsToExcludeFromGeneratedQuizQuestions(quiz_size);
        // get new quiz questions
        const generatedQuizQuestions: Partial<Quiz>[] = await this._quizService.GenerateQuizQuestions(quiz_size, categories, questionsToExclude);
        // transform them to quiz entities from their raw form
        const quizEntities = this._quizService.TransformQuizQuestionsToQuizEntities(generatedQuizQuestions, newQuizStartDate);
        // save in database
        return await this._quizService.InsertManyQuizAsync(quizEntities);
    }
}