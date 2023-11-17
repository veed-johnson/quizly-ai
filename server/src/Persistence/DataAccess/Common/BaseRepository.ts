import { BaseEntity } from "../../../Domain/Entities/Common/BaseEntity";
import { IBaseRepository } from "../../../Application/Contracts/DataAccess/Common/IBaseRepository";
import { FilterQuery, Model } from "mongoose";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { DateAndTimeUtilities } from "../../../Application/Utilities/DateAndTimeUtilities";
import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";

export class BaseRepository<TEntity extends BaseEntity<TId>, TId> implements IBaseRepository<TEntity,  TId>{
    protected _model: Model<TEntity>
    public constructor(model: Model<TEntity>){
       this._model = model;
    }
    AddAsync =  async (entity: TEntity): Promise<TEntity> => {
        const entityToSave = this.ConvertToEntity(entity);

        const savedEntity = await this._model.create(entityToSave);

        return savedEntity;
    }
    AddManyAsync = async (entities: TEntity[]): Promise<TEntity[]> => {
        const entitiesToSave = entities.map(this.ConvertToEntity);
        await this._model.insertMany(entitiesToSave);

        return entitiesToSave;
    }


    GetByIdAsync = async (id: TId): Promise<TEntity> => {
        return await this._model.findById(id);
    }
    GetAsync = async (query: Partial<{[k in keyof TEntity]: any}>): Promise<TEntity[]> => {
        return await this._model.findById(query);
    }
    UpdateAsync = async (entity: TEntity): Promise<TEntity> => {
        await this._model.findByIdAndUpdate(entity._id, entity);
        return entity;
    }
    DeleteAsync = async (entity: TEntity, soft: boolean = true): Promise<number> => {
        const savedEntity = await this.GetByIdAsync(entity._id);
        
        if(savedEntity && soft === true){
            savedEntity.recordStatus = RecordStatus.deleted;
            const updated = await this.UpdateAsync(savedEntity);
            return 1;
        }
        else if(savedEntity && soft === false){
            await this._model.deleteOne(savedEntity);
            return 1;
        }
        return 0;
    }

    GetPagedAsync = async (query:  Partial<{[k in keyof TEntity]: any}>, lastItemId: TId | null, pageSize: number = 10) : Promise<TEntity[]>=> {
        let queryData:  Record<string, any> = Object.fromEntries(Object.entries(query));
        
        if (lastItemId != null) {
            queryData._id = { $gt: lastItemId };
        }
        const result = await this._model.find(queryData).sort({ _id: 1 }).limit(pageSize);
        return result;
    }

    ToPagedAsync = async (query: Partial<{[k in keyof TEntity]: any}>, page: number = 1, pageSize: number = 10, sort: {[k: string]: any} = {_id: -1} ): Promise<PaginationResponse<TEntity>> => {
        const itemsToSkipCount = (page - 1 ) * pageSize
        const result = await this._model.aggregate([
            { $match: query }, // Match your query
            { $sort: sort }, // Sort as needed
            { $facet: { // Use $facet to run multiple pipelines within a single stage
              paginatedItems: [
                { $skip: itemsToSkipCount },
                { $limit: pageSize },
              ],
              totalCount: [
                { $count: 'count' },
              ],
            }},
          ]);
          
        const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
        const paginatedItems: TEntity[] = result[0]?.paginatedItems ?? [];
        const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize == 0) ? 0 : totalCount % pageSize);

        return new PaginationResponse<TEntity>(page, pageSize, totalCount, totalPages, paginatedItems);
    }

    private ConvertToEntity = (entity: TEntity): TEntity => {
        entity.recordStatus = RecordStatus.active;
        entity.createdAt = DateAndTimeUtilities.GetCurrentTime();
        entity.updatedAt = DateAndTimeUtilities.GetCurrentTime();
        return entity;
    }

    FirstOrDefault = async (query:  Partial<{[k in keyof TEntity]: any}>): Promise<TEntity | null> => {
        return await this._model.findOne(query) ?? null;
    }
    
}