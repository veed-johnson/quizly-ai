
export class PromptUtilities{
    public static GetQuizQuestionsResponseFormat(): {[key: string]: any}[]{
        return [
            {
              categories:
                "should be an array of the 3 categories that have been selected. e.g. [sports, history, music]",
              questionsList: [
                {
                  category: "category1",
                  questions: [
                    {
                      question: "...",
                      clue: "...",
                      answer: "...",
                    },
                  ],
                },
                {
                  category: "category2",
                  questions: [
                    {
                      question: "...",
                      clue: "...",
                      answer: "...",
                    },
                  ],
                },
                {
                  category: "category3",
                  questions: [
                    {
                      question: "...",
                      clue: "...",
                      answer: "...",
                    },
                  ],
                },
              ],
            },
          ]
    }
    public static GenerateGetQuizQuestionsPrompt(totalNoOfQuestions: number, categories: string, RESPONSE_FORMAT: string, questionsToExclude: string): string{
        const NoOfQuestionsPerCategory = 3;
        const promptMessage = `Randomly pick 3 categories out of these 6 categories: ${categories}. Generate ${NoOfQuestionsPerCategory} very engaging trivia questions each on the picked categories. Do this for ${totalNoOfQuestions} sets of questions. Do not include questions related to these questions here "${questionsToExclude}", Format the response as json array in the shape of ${JSON.stringify(
            RESPONSE_FORMAT
          )}.
          This means your JSON array will contain the ${totalNoOfQuestions} sets of questions`;
        return promptMessage;
    }
}