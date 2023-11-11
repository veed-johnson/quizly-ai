import { IPromptService } from "../../../Application/Contracts/Services/ChatModule/IPromptService";
import { PromptUtilities } from "../../../Application/Utilities/PromptUtilities";


export class PromptService implements IPromptService{
    GenerateGetQuizQuestionsPrompt(noOfQuestions: number, categories: string = "sports, music, history, geography, movies, and science", questionsToExclude: any[] | string= []): string {

        const quizQuestionsResponseFormat = JSON.stringify(PromptUtilities.GetQuizQuestionsResponseFormat());
        const questionsToExcludeString = typeof questionsToExclude == "string" ? questionsToExclude : JSON.stringify(questionsToExclude);
        const quizQuestionsPrompt = PromptUtilities.GenerateGetQuizQuestionsPrompt(noOfQuestions, categories, quizQuestionsResponseFormat, questionsToExcludeString);
        
        return quizQuestionsPrompt;
    }

}