import { ObjectId } from "mongoose";
import { IQuizRepository } from "../../../Application/Contracts/DataAccess/QuizModule/IQuizRepository";
import { Quiz } from "../../../Domain/Entities/QuizModule/Quiz";
import { QuizModel } from "../../../Persistence/EntityConfigurations/QuizModule/QuizModel";
import { BaseRepository } from "../Common/BaseRepository";

export class QuizRepository extends BaseRepository<Quiz, ObjectId> implements IQuizRepository{
    public constructor(){
        super(QuizModel);
    }

    getLatestScheduledQuiz = async (): Promise<Quiz | null> => {
        const quiz = await this._model.findOne({}).sort({date : -1});
        return quiz;
    }
    getLastAddedQuizzes = async (numberOfLastAddedQuizzes: number): Promise<Quiz[]> => {
        return await this._model.find({}).sort({date : -1}).limit(numberOfLastAddedQuizzes);
    }
    insertMany = async (entities: Quiz[]): Promise<Quiz[]> => {
        var savedEntities = await this.AddManyAsync(entities);
        return savedEntities;
    }

    firstOrDefault = async (query: {[k: string]: any}): Promise<Quiz | null> => {
        return await this._model.findOne(query) ?? null;
    }
    

}