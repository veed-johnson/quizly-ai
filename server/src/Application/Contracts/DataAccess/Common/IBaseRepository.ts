import { PaginationResponse } from "../../../../Application/DTO/Models/PaginationResponse";
import { BaseEntity } from "../../../../Domain/Entities/Common/BaseEntity";

export interface IBaseRepository<TEntity extends BaseEntity<TId>, TId>{
    AddAsync(entity: TEntity ): Promise<TEntity>;
    
    GetByIdAsync(id: TId ): Promise<TEntity | null>;
    GetAsync(query: Partial<{[k in keyof TEntity]: any}>): Promise<TEntity[]>;
    
    UpdateAsync(entity: TEntity ): Promise<TEntity>;

    DeleteAsync(entity: TEntity, soft: boolean): Promise<number>;
    GetPagedAsync(query: Partial<{[k in keyof TEntity]: any}>, lastItemId: TId | null, pageSize?: number) : Promise<TEntity[]>;
    ToPagedAsync(query: Partial<{[k in keyof TEntity]: any}>, page: number, pageSize: number, sort?: {[k: string]: any} | string): Promise<PaginationResponse<TEntity>>
}