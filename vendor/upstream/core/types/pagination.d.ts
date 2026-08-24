export interface PaginatedRequest {
    /** Page offset to start from */
    page: number;
    /** Number of items to be return per page */
    size: number;
}
export interface PaginatedResponse<T> {
    /** List of data sets of type T */
    swaps: T[];
    /** Current page offset */
    page: number;
    /** Number of items return per page */
    size: number;
    /** Number of pages given the current page size */
    pages: number;
}
//# sourceMappingURL=pagination.d.ts.map