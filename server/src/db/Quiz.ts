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

export const QuizModelTest = mongoose.model<IQuizSchema>("Quiz", QuizSchema);

//Quiz actions
export const getAllQuiz = () => QuizModelTest.find();

export const getAllQuizWithPagination = (
  filter: object,
  skip: number,
  pageSize: number
) => QuizModelTest.find(filter).skip(skip).limit(pageSize).exec();

export const getLiveQuiz = () => QuizModelTest.findOne({ status: "live" });

export const addMultipleQuiz = (dataToSave: IQuizSchema[]) =>
  QuizModelTest.insertMany(dataToSave);

export const updateQuizById = (id: string, values: Record<string, any>) =>
  QuizModelTest.findByIdAndUpdate(id, values);

export const deleteQuizzes = (filter: Record<string, any>) =>
  QuizModelTest.deleteMany(filter);
