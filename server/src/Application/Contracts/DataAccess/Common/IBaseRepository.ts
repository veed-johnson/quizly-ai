import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { BaseEntity } from "../../../../Domain/Entities/Common/BaseEntity";

export interface IBaseRepository<TEntity extends BaseEntity<TId>, TId>{
    AddAsync(entity: TEntity ): Promise<TEntity>;
    
    GetByIdAsync(id: TId ): Promise<TEntity | null>;
    GetAsync(query?: Partial<{[k in keyof TEntity]: any}>): Promise<TEntity[]>;
    GetPagedAsync(query: Partial<{[k in keyof TEntity]: any}>, lastItemId: TId | null, pageSize?: number) : Promise<TEntity[]>;
    ToPagedAsync(query: Partial<{[k in keyof TEntity]: any}>, page: number, pageSize: number, sort?: {[k: string]: any} | string): Promise<PaginationResponse<TEntity>>
    FirstOrDefaultAsync (query: Partial<{[k in keyof TEntity]: any}>): Promise<TEntity | null>

    UpdateByIdAsync(id: TId, entity: Partial<TEntity>): Promise<Partial<TEntity>>;
    UpdateAsync(entity: TEntity ): Promise<TEntity>;
    UpdateManyAsync(query: {[key in keyof Partial<TEntity>]: any}, update: Partial<TEntity>): Promise<number>;

    DeleteAsync(entity: TEntity, soft: boolean): Promise<number>;
    DeleteManyAsync(query: {[key in keyof Partial<TEntity>]: any}, soft?: boolean): Promise<number>

    
}