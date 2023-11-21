import { BaseEntity } from "../../../Domain/Entities/Common/BaseEntity";
import { IBaseRepository } from "../../../Application/Contracts/DataAccess/Common/IBaseRepository";
import { FilterQuery, Model } from "mongoose";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { DateAndTimeUtilities } from "../../../Application/Common/Utilities/DateAndTimeUtilities";
import { PaginationResponse } from "../../../Application/DTO/Models/PaginationResponse";

export class BaseRepository<TEntity extends BaseEntity<TId>, TId> implements IBaseRepository<TEntity,  TId>{
    protected _model: Model<TEntity>
    public constructor(model: Model<TEntity>){
       this._model = model;
    }
    AddAsync =  async (entity: TEntity): Promise<TEntity> => {
        // Handles adding a deleted entity 
        if(entity.recordStatus === RecordStatus.deleted){
            entity.recordStatus = RecordStatus.active;
            await this.UpdateAsync(entity);
            return entity;
        }
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
    GetAsync = async (query: Partial<{[k in keyof TEntity]: any}> = {}): Promise<TEntity[]> => {
        if(!query.hasOwnProperty('recordStatus')){
            query.recordStatus = {
                
            }
        }
        return await this._model.find(query);
    }
    FirstOrDefaultAsync = async (query: Partial<{[k in keyof TEntity]: any}> = {}): Promise<TEntity | null> => {
        const entity = await this._model.findOne(query);
        return entity ?? null;
    } 

    UpdateAsync = async (entity: TEntity): Promise<TEntity> => {
        entity.updatedAt = DateAndTimeUtilities.GetCurrentTime();
        await this._model.findByIdAndUpdate(entity._id, entity);
        return entity;
    }
    UpdateByIdAsync = async (id: TId, entity: Partial<TEntity>): Promise<Partial<TEntity>> => {
        entity.updatedAt = DateAndTimeUtilities.GetCurrentTime();
        await this._model.findByIdAndUpdate(id, entity);
        return entity;
    }
    UpdateManyAsync = async (query: {[key in keyof Partial<TEntity>]: any}, update: Partial<TEntity>): Promise<number> => {
        update.updatedAt = DateAndTimeUtilities.GetCurrentTime();
        const updatedResponse  = await this._model.updateMany(query, update);
        return updatedResponse.modifiedCount;
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

    DeleteManyAsync = async (query: {[key in keyof Partial<TEntity>]: any}, soft: boolean = true): Promise<number> => {
        let deleteCount = 0;
        if(soft){
            const deleteUpdate : Partial<TEntity> = { recordStatus : RecordStatus.deleted} as Partial<TEntity>;
            deleteCount = await this.UpdateManyAsync(query, deleteUpdate);
        } 
        else{
            const deleteResponse = await this._model.deleteMany(query);
            deleteCount =  deleteResponse.deletedCount;
        }

        return deleteCount;
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
        const totalPages = Math.floor(totalCount / pageSize) + ((totalCount % pageSize == 0) ? 0 : 1);

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