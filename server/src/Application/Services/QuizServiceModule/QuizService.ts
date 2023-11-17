import { PaginationResponse } from "Application/DTO/Models/PaginationResponse";
import { IQuizRepository } from "../../../Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { IChatService } from "../../../Application/Contracts/Services/ChatModule/IChatService";
import { IPromptService } from "../../../Application/Contracts/Services/ChatModule/IPromptService";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { DateAndTimeUtilities } from "../../../Application/Utilities/DateAndTimeUtilities";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { QuizStatus } from "../../../Domain/Enums/QuizModule/QuizStatus";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";


export class QuizService implements IQuizService{
    private _promptService: IPromptService;
    private _chatService: IChatService;
    private _quizRepository: IQuizRepository;

    public constructor(promptService: IPromptService, chatService: IChatService, quizRepository: IQuizRepository){
        this._promptService = promptService;
        this._chatService = chatService;
        this._quizRepository = quizRepository;
    }

    public GetCurrentQuiz = async (): Promise<Quiz | null> => {
        // get today's date
        const todaysStartDate = DateAndTimeUtilities.GetCurrentDate();
        const tomorrowsStartDate = DateAndTimeUtilities.AddDays(todaysStartDate, 1);

        let query ={
            date: {
              $gte: todaysStartDate, // Greater than or equal to the start of the day
              $lt: tomorrowsStartDate, // Less than the start of the next day
            }
          }
          const currentQuiz =  await this._quizRepository.firstOrDefault(query);
          
          console.log({currentQuiz})
        return currentQuiz;
    }

    public GetQuizzesByStatus = async (status: string, page: number, pageSize: number) : Promise<PaginationResponse<Quiz>> => {
        let quizzesResponse: PaginationResponse<Quiz>;
        switch(status){
            case QuizStatus.past:
                quizzesResponse = await this.GetPastQuizzes(page, pageSize);
                break;
            case QuizStatus.live:
                quizzesResponse = await this.GetCurrentQuizzes(page, pageSize);
                break;
            case QuizStatus.upcoming:
                quizzesResponse = await this.GetUpcomingQuizzes(page, pageSize);
                break;
            default:
                quizzesResponse = await this.GetAllQuizzes(page, pageSize);
                break;
        }

        return quizzesResponse;
    }

    public GetPastQuizzes = async (page: number, pageSize: number, date?: Date): Promise<PaginationResponse<Quiz>> => {
        const startDate = date ?? DateAndTimeUtilities.GetCurrentDate();
        const pastQuizzesQuery = {
            date: {
                $lt: startDate,
            },
            recordStatus: RecordStatus.active
        };
        return await this._quizRepository.ToPagedAsync(pastQuizzesQuery, page, pageSize);
    }

    public GetCurrentQuizzes = async (page: number, pageSize: number, date?: Date ): Promise<PaginationResponse<Quiz>> => {
        // get today's date
        const startDate = date ?? DateAndTimeUtilities.GetCurrentDate();
        const nextDayDate = DateAndTimeUtilities.AddDays(startDate, 1);

        let query ={
            date: {
              $gte: startDate, // Greater than or equal to the start of the day
              $lt: nextDayDate, // Less than the start of the next day
            },
            recordStatus: RecordStatus.active
          }
          return await this._quizRepository.ToPagedAsync(query, page, pageSize);
    }

    public GetAllQuizzes = async (page: number, pageSize: number, date?: Date ): Promise<PaginationResponse<Quiz>> => {
        // get today's date

        let query ={
            recordStatus: RecordStatus.active
        }
        return await this._quizRepository.ToPagedAsync(query, page, pageSize);
    }

    public GetUpcomingQuizzes = async (page: number, pageSize: number, date?: Date): Promise<PaginationResponse<Quiz>> => {
        const startDate = date ?? DateAndTimeUtilities.GetCurrentDate();
        const pastQuizzesQuery = {
            date: {
                $gt: startDate
            },
            recordStatus: RecordStatus.active
        };
        return await this._quizRepository.ToPagedAsync(pastQuizzesQuery, page, pageSize);
    }


    public GenerateQuizQuestions = async (size: number, categories: string, questionsToExcludeFromGeneratedQuestions: Partial<Quiz>[] = []): Promise<Partial<Quiz>[]> => {

        const quizQuestionsPrompt: string = this._promptService.GenerateGetQuizQuestionsPrompt(size, categories, questionsToExcludeFromGeneratedQuestions)

        const quizQuestionsPromptResponse: string = await this._chatService.GetResponseForPrompt(quizQuestionsPrompt);
        // const quizQuestionsPromptResponse: string = '[{"categories":["movies", "geography", "music"],"questionsList":[{"category":"movies","questions":[{"question":"Which actor played Iron Man in the Marvel Cinematic Universe movies?","clue":"He also played Sherlock Holmes in the movie franchise of the same name.","answer":"Robert Downey Jr."}]},{"category":"geography","questions":[{"question":"What is the capital city of Australia?","clue":"","answer":"Canberra"}]},{"category":"music","questions":[{"question":"Who is the lead vocalist of the rock band Queen?","clue":"","answer":"Freddie Mercury"}]}]}]'
        console.log({quizQuestionsPromptResponse})
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
    
    public GetQuestionsToExcludeFromGeneratedQuizQuestions = async (numberOfQuestionsNotToRepeat: number): Promise<Partial<Quiz[]>> => {

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
        var curentDate = DateAndTimeUtilities.GetCurrentTime();
        return DateAndTimeUtilities.AddDays(curentDate, PREVIOUS_DAY_POSITION);
    }

    public InsertManyQuizAsync = async (quizList: Quiz[] ): Promise<Quiz[]> => {
        return await this._quizRepository.insertMany(quizList);
    }


    private TransformPartialQuizToEntity = (quiz: Partial<Quiz>, date: Date): Quiz => {
        const quizEntity = new Quiz();

        quiz.questionsList.forEach(questionList => {
            questionList.questions.forEach(question => {
                delete question._id; // we want the database to create the id by itself
            })
        })
        quizEntity.categories = quiz.categories ?? [];
        quizEntity.questionsList = quiz.questionsList ?? [];
        quizEntity.date = date;
        return quizEntity;
    }

    public AddQuizStatusToQuizBasedOnReferenceDate = (quiz: Quiz, referenceDate: Date): Quiz => {
        quiz.status = this.GetQuizStatusBasedOnReferenceDate(quiz.date, referenceDate);
        return quiz;
    }

    private GetQuizStatusBasedOnReferenceDate = (quizDate: Date, referenceDate: Date): QuizStatus => {
        if(quizDate < referenceDate){
            return QuizStatus.past;
        }
        else if(quizDate ==  referenceDate){
            return QuizStatus.live;
        }
        else{
            return QuizStatus.upcoming
        }
    }
    private GetQuizStatusBasedOnDate = (date: Date): QuizStatus => {
        if(date < DateAndTimeUtilities.GetCurrentTime()){
            return QuizStatus.past;
        }
        else if(date ==  DateAndTimeUtilities.GetCurrentTime()){
            return QuizStatus.live;
        }
        else{
            return QuizStatus.upcoming
        }
    }
}