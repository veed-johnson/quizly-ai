import { ObjectId } from "mongoose";
import { Question } from "./Question";

export class QuizCategory {
    public _id?: string | ObjectId;
    public category: string;
    public questions: Question[];

    public constructor(category: string = "", questionsList : Question[] = []){
        this.category = category;
        this.questions = questionsList;
    }
}