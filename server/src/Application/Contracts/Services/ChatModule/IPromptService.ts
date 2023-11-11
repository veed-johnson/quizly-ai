
export interface IPromptService {
    GenerateGetQuizQuestionsPrompt(noOfQuestions: number, categories: string , questionsToExclude: any[] | string ): string;
}