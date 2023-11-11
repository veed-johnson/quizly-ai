import { ObjectId } from "mongoose";

export class Question {
    public question: string;
    public clue: string;
    public answer: string;
    public _id?: string | ObjectId;
    
    public constructor(question: string = "", clue: string = "", answer: string = ""){
        this.question = question;
        this.clue = clue;
        this.answer = answer;
    }
}