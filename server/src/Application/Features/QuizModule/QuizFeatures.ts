import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";
import { GetCurrentQuizResponse } from "../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { IQuizFeatures } from "../../../Application/Contracts/Features/QuizModule/IQuizFeatures";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { DateAndTimeUtilities } from "../../Common/Utilities/DateAndTimeUtilities";
import { QuestionResponse } from "../../../Application/DTO/Responses/QuizResponses/Aggregates/QuestionResponse";
import { EditSingleQuizQuestionRequest } from "../../../Application/DTO/Requests/QuizRequests/EditSingleQuizQuestionRequest";
import mongoose, { ObjectId, mongo } from "mongoose";
import { QuizNotFoundException } from "../../../Application/Common/Exceptions/QuizNotFoundException";
import { DeleteQuizByStatusRequest } from "../../../Application/DTO/Requests/QuizRequests/DeleteQuizByStatusRequest";

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
            console.log({totalQuizItemsLeftToAdd, batchSizeOfQuizToAdd});

            const DELAY = 60 * 1000; // tim
            if(batchSizeOfQuizToAdd > 0){
                setTimeout(async () => {
                    const createdQuizzes = await this.addNewQuizzes(batchSizeOfQuizToAdd, categories);
                    quizzesAdded.push(...createdQuizzes);
                }, DELAY)
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
        quizzes.items.sort((quizA, quizB) => {
            return quizA.status.localeCompare(quizB.status);
          });
        return quizzes;
        }
    
    GetAllQuizzes = async (page: number, pageSize: number, sort: {[key in keyof Partial<Quiz>]: number} = {date: 1}) : Promise<PaginationResponse<Quiz>> => {
        const referenceDateStatusIsBasedOn = DateAndTimeUtilities.GetCurrentDate();
        const quizzes: PaginationResponse<Quiz> = await this._quizService.GetAllQuizzes(page, pageSize, sort);
        quizzes.items = quizzes.items.map(quiz => {
            return this._quizService.AddQuizStatusToQuizBasedOnReferenceDate(quiz, referenceDateStatusIsBasedOn)
        })
        quizzes.items.sort((quizA, quizB) => {
            return quizA.status.localeCompare(quizB.status);
          });
        return quizzes;
    }

    GetCurrentQuiz = async (): Promise<GetCurrentQuizResponse[]> => {
        const currentQuiz: Quiz | null =  await this._quizService.GetCurrentQuiz();
        if(currentQuiz){
            return this.transformToQuizResponse(currentQuiz);
        }
        return [];
    }

    EditSingleQuizQuestion = async (editQuestionRequest: EditSingleQuizQuestionRequest): Promise<Quiz> => {
        const {quizId, categoryId, questionId, question, clue, answer} = editQuestionRequest;
        const quizObjectId: ObjectId = new mongo.ObjectId(quizId) as unknown as ObjectId;
        const quiz = await this._quizService.GetQuizById(quizObjectId);
        if(!quiz){
            throw new QuizNotFoundException(`quiz with id ${quizId} not found`);
        }

        const matchingCategory = quiz.questionsList.find(questionList => questionList._id.toString() == categoryId);
        if(!matchingCategory){
            throw new QuizNotFoundException(`category with id ${categoryId} not found`);
        }

        const matchingQuestion = matchingCategory.questions.find(question => question._id.toString() == questionId); 
        if(!matchingQuestion){
            throw new QuizNotFoundException(`question with id ${questionId} not found in category ${categoryId}`);
        }

        if(question){
            matchingQuestion.question = question;
        }
        if(clue){
            matchingQuestion.clue = clue;
        }
        if(answer){
            matchingQuestion.answer = answer;
        }

        return await this._quizService.UpdateQuiz(quiz);

    }

    UpdateQuizStatusToLive = async (id: string): Promise<Quiz> => {
        const quizId: ObjectId = new mongo.ObjectId(id) as unknown as ObjectId;
        const quiz = await this._quizService.GetQuizById(quizId);
        if(!quiz){
            throw new QuizNotFoundException(`Quiz with Id ${id} not found`);
        }

        await this._quizService.UpdateAllCurrentQuizToArchived();

        return await this._quizService.UpdateQuizStatusToLive(quiz);
    }

    DeleteQuizByStatusRequest = async (deleteQuizByStatusRequest: DeleteQuizByStatusRequest): Promise<number> => {
        return await this._quizService.DeleteQuizByStatus(deleteQuizByStatusRequest);
    }

    AddQuizQuestions = async(questions: Partial<Quiz>[] ): Promise<Quiz[]> => {
        const lastAddedQuizDate: Date = await this._quizService.GetLatestScheduledQuizDate();
        const newQuizStartDate: Date = DateAndTimeUtilities.AddDays(lastAddedQuizDate, 1);
        const quizEntities = this._quizService.TransformQuizQuestionsToQuizEntities(questions, newQuizStartDate);
        
        return await this._quizService.InsertManyQuizAsync(quizEntities);
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