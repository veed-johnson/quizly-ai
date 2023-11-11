import { Quiz } from '../../../Domain/Entities/QuizModule/Quiz';
import { Schema, model, connect } from 'mongoose';
import { QuizCategorySchema } from './Aggregates/QuizCategoryConfiguration';

const QuizSchema = new Schema<Quiz>({
    categories: { type: [String], required: true },
    status : { type: String, required: true },
    questionsList: {type: [QuizCategorySchema], required: true},
    date: {type: Date, required: true}
});

export const QuizModel = model<Quiz>("QuizTest", QuizSchema)

