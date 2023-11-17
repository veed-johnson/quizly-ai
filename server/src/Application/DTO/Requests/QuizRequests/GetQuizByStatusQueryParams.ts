import { PaginatedQueryParamsRequest } from "../../../../Application/DTO/Models/PaginatedQueryParamsRequest";

export interface GetQuizByStatusQueryParams extends PaginatedQueryParamsRequest{
    status?: string
}