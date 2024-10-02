export interface PaginationParams {
  limit: number;
  page: number;
}

export interface PaginatedResult<T> {
  results: T[];
  total: number;
  limit: number;
  page: number;
}
