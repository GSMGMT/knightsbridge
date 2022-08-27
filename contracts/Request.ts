export interface Request {
  pageSize: number;
  pageNumber: number;
  search?: string;
  sort?: string;
  startDate?: number;
  endDate?: number;
}
