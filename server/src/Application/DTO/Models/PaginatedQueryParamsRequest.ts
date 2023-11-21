export class PaginatedQueryParamsRequest {
    page: number;
    pageSize: number;

    public constructor(page?: number | string, pageSize?: number | string){
        const DEFAULT_FIRST_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10
        this.page = page ? Number(page) : DEFAULT_FIRST_PAGE;
        this.pageSize = pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE;
    }
}