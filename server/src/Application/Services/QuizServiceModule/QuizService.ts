import { IQuizRepository } from "../../../Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { IChatService } from "../../../Application/Contracts/Services/ChatModule/IChatService";
import { IPromptService } from "../../../Application/Contracts/Services/ChatModule/IPromptService";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { DateAndTimeUtilities } from "../../../Application/Utilities/DateAndTimeUtilities";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { QuizStatus } from "../../../Domain/Enums/QuizModule/QuizStatus";


export class QuizService implements IQuizService{
    private _promptService: IPromptService;
    private _chatService: IChatService;
    private _quizRepository: IQuizRepository;

    public constructor(promptService: IPromptService, chatService: IChatService, quizRepository: IQuizRepository){
        this._promptService = promptService;
        this._chatService = chatService;
        this._quizRepository = quizRepository;
    }

    public GenerateQuizQuestions = async (size: number, categories: string, questionsToExcludeFromGeneratedQuestions: Quiz[] = []): Promise<Partial<Quiz>[]> => {

        // build prompt
        const quizQuestionsPrompt: string = this._promptService.GenerateGetQuizQuestionsPrompt(size, categories, questionsToExcludeFromGeneratedQuestions)

        // get answer to prompt
        const quizQuestionsPromptResponse: string = await this._chatService.GetResponseForPrompt(quizQuestionsPrompt);

        // clean answer to match quiz format
        const startIdxOfActualQuizQuestions: number = quizQuestionsPromptResponse.indexOf("[");
        const endIdxOfActualQuizQuestions: number = quizQuestionsPromptResponse.lastIndexOf("]");

        let cleanedQuizQuestionsResponse = JSON.stringify([]);
        if(startIdxOfActualQuizQuestions >= 0 && endIdxOfActualQuizQuestions < quizQuestionsPromptResponse.length){
             cleanedQuizQuestionsResponse = quizQuestionsPromptResponse.slice(startIdxOfActualQuizQuestions, endIdxOfActualQuizQuestions + 1);
        }

        // convert response to quiz type list
        const quizQuestions: Partial<Quiz>[] = JSON.parse(cleanedQuizQuestionsResponse);

        // return converted response
        return quizQuestions;
    } 

    public TransformQuizQuestionsToQuizEntities = (quizQuestions: Partial<Quiz>[], startDateForQuiz: Date): Quiz[] => {

        let currentDate = startDateForQuiz;
        const quizList: Quiz[] = []

        for(const quiz of quizQuestions){
            const quizEntity = this.TransformPartialQuizToEntity(quiz, currentDate);
            currentDate = DateAndTimeUtilities.AddDays(currentDate, 1);
            quizList.push(quizEntity);
        }

        return quizList;
    }
    
    public GetQuestionsToExcludeFromGeneratedQuizQuestions = async (numberOfQuestionsNotToRepeat: number): Promise<Quiz[]> => {

        // get last added set of questions that amount to numberOfQuestionsNotToRepeat ** These are questions we want to exclude
        const lastAddedQuizzes: Quiz[] = await this._quizRepository.getLastAddedQuizzes(numberOfQuestionsNotToRepeat);
        return lastAddedQuizzes;
    }

    public GetLatestScheduledQuizDate = async (): Promise<Date> => {
        const latestScheduledQuiz = await this._quizRepository.getLatestScheduledQuiz();
        if(latestScheduledQuiz){
            return latestScheduledQuiz.date;
        }
        // get current time and remove one day from it (Not sure this is the best idea)
        
        const PREVIOUS_DAY_POSITION = -1;
        var curentDate = DateAndTimeUtilities.GetCurrentUTCTime();
        return DateAndTimeUtilities.AddDays(curentDate, PREVIOUS_DAY_POSITION);
    }

    public InsertManyQuizAsync = async (quizList: Quiz[] ): Promise<Quiz[]> => {
        return await this._quizRepository.insertMany(quizList);
    }


    private TransformPartialQuizToEntity = (quiz: Partial<Quiz>, date: Date): Quiz => {
        const quizEntity = new Quiz();
        quizEntity.categories = quiz.categories ?? [];
        quizEntity.questionsList = quiz.questionsList ?? [];
        quizEntity.date = date;
        quizEntity.status = this.GetQuizStatusBasedOnDate(date);
        return quizEntity;
    }

    private GetQuizStatusBasedOnDate = (date: Date): QuizStatus => {
        if(date < DateAndTimeUtilities.GetCurrentUTCTime()){
            return QuizStatus.past;
        }
        else if(date ==  DateAndTimeUtilities.GetCurrentUTCTime()){
            return QuizStatus.live;
        }
        else{
            return QuizStatus.upcoming
        }
    }
}