import { Question } from "../../../../Domain/Entities/QuizModule/Question";
import { Schema } from "mongoose";

export const QuestionSchema = new Schema<Question>({
    question: {type: String, required: true},
    clue: {type: String, default: ""},
    answer: {type: String, rquired: true}
})