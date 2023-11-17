import { ObjectId } from "mongoose";
import { AggregateRoot } from "../../../Domain/Aggregates/AggregateRoot";
import { QuizCategory } from "./QuizCategory";
import { BaseEntity } from "../Common/BaseEntity";
import { QuizStatus } from "Domain/Enums/QuizModule/QuizStatus";

// This is the entry class to all items in the quiz module
export class Quiz extends BaseEntity<ObjectId> implements AggregateRoot{
    public categories: string[];
    public questionsList: QuizCategory[];
    public date: Date;
    public status?: QuizStatus 
    public constructor(categories: string[] = [], questionsList: QuizCategory[] = [], date: Date = new Date()){
        super();
        this.categories = categories;
        this.questionsList = questionsList;
        this.date = date;
    }
}