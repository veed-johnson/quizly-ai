import { ObjectId } from "mongoose";
import { Question } from "./Question";

export class QuizCategory {
    public _id?: string | ObjectId;
    public category: string;
    public questionsList: Question[];

    public constructor(category: string = "", questionsList : Question[] = []){
        this.category = category;
        this.questionsList = questionsList;
    }
}