import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { IQuizService } from "../../../Application/Contracts/Services/QuizServiceModule/IQuizService";
import { GetCurrentQuizResponse } from "../../../Application/DTO/Responses/QuizResponses/GetCurrentQuizResponse";
import { QuestionResponse } from "../../../Application/DTO/Responses/QuizResponses/Aggregates/QuestionResponse";
import { IGetCurrentQuiz } from "../../../Application/Contracts/Features/QuizModule/IGetCurrentQuiz";

export class GetCurrentQuiz implements IGetCurrentQuiz{
    private readonly _quizService: IQuizService;

    public constructor(quizService: IQuizService){
        this._quizService = quizService;
    }

    public execute = async (): Promise<GetCurrentQuizResponse[]> => {
        const currentQuiz: Quiz | null =  await this._quizService.GetCurrentQuiz();
        if(currentQuiz){
            return this.TransformToQuizResponse(currentQuiz);
        }
        return [];
    }

    private TransformToQuizResponse = (quiz: Quiz): GetCurrentQuizResponse[] => {

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