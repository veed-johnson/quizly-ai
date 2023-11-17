
export class PaginationResponse<T> {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    items: T[]

    public constructor(currentPage: number, itemsPerPage: number, totalItems: number, totalPages: number, items: T[]){
            this.currentPage = currentPage;
            this.itemsPerPage = itemsPerPage;
            this.totalItems = totalItems;
            this.totalPages = totalPages;
            this.items = items;
    }
}