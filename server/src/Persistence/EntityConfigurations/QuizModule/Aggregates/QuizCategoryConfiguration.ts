import { Schema, model, connect } from 'mongoose';
import { QuizCategory } from '../../../../Domain/Entities/QuizModule/QuizCategory';
import { QuestionSchema } from './QuestionSchema';

export const QuizCategorySchema = new Schema<QuizCategory>({
    category: {type: String, required: true},
    questionsList: {type: [QuestionSchema], required: true}
})