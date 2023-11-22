import { QuestionResponse } from "./Aggregates/QuestionResponse";
export class GetCurrentQuizResponse {
        public category: string;
        public questions: QuestionResponse[];
        public date?: Date
}