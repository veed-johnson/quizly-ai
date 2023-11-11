import { ObjectId } from "mongoose";
import { AggregateRoot } from "../../../Domain/Aggregates/AggregateRoot";
import { QuizStatus } from "../../../Domain/Enums/QuizModule/QuizStatus";
import { QuizCategory } from "./QuizCategory";

// This is the entry class to all items in the quiz module
export class Quiz extends AggregateRoot{
    public _id: string | ObjectId;
    public categories: string[];
    public status : QuizStatus;
    public questionsList: QuizCategory[];
    public date: Date;

    public constructor(categories: string[] = [], status: QuizStatus = QuizStatus.upcoming, questionsList: QuizCategory[] = [], date: Date = new Date()){
        super();
        this.categories = categories;
        this.status = status;
        this.questionsList = questionsList;
        this.date = date;
    }
}