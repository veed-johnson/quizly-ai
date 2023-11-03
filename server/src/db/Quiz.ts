import mongoose from "mongoose";

interface IQuestionSchema {
  _id?: string;
  question: string;
  clue: string;
  answer: string;
}

interface ICategorySchema {
  _id?: string;
  category: string;
  questions: IQuestionSchema[];
}

export interface IQuizSchema {
  _id?: string;
  date: Date;
  status: "past" | "live" | "upcoming";
  categories: string[];
  questionsList: ICategorySchema[];
}

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  clue: {
    type: String,
  },
  answer: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
});

const QuizSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "upcoming",
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  questionsList: [categorySchema],
});

export const QuizModel = mongoose.model<IQuizSchema>("Quiz", QuizSchema);

//Quiz actions
export const getAllQuiz = () => QuizModel.find();

export const getAllQuizWithPagination = (
  filter: object,
  skip: number,
  pageSize: number
) => QuizModel.find(filter).skip(skip).limit(pageSize).exec();

export const getLiveQuiz = () => QuizModel.findOne({ status: "live" });

export const addMultipleQuiz = (dataToSave: IQuizSchema[]) =>
  QuizModel.insertMany(dataToSave);

export const updateQuizById = (id: string, values: Record<string, any>) =>
  QuizModel.findByIdAndUpdate(id, values);

export const deleteQuizzes = (filter: Record<string, any>) =>
  QuizModel.deleteMany(filter);
