import { IQuizRepository } from "../../../Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { QuizModel } from "../../../Persistence/EntityConfigurations/QuizModule/QuizModel";

export class QuizRepository implements IQuizRepository{
    

    getLatestScheduledQuiz = async (): Promise<Quiz | null> => {
        const quiz = await QuizModel.findOne({}).sort({date : -1});
        return quiz;
    }
    getLastAddedQuizzes = async (numberOfLastAddedQuizzes: number): Promise<Quiz[]> => {
        return await QuizModel.find({}).limit(numberOfLastAddedQuizzes);
    }
    insertMany = async (entities: Quiz[]): Promise<Quiz[]> => {
        var savedEntities = await QuizModel.insertMany(entities);
        return entities;
    }
    

}