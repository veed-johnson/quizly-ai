import { PaginatedQueryParamsRequest } from "../../../../Application/DTO/Models/PaginatedQueryParamsRequest";

export class GetQuizByStatusQueryParams extends PaginatedQueryParamsRequest{
    status?: string

    public constructor(page?: number | string, pageSize?: number | string, status?: string){
        super(page, pageSize)
        this.status = status ? status: "";
    }    
}