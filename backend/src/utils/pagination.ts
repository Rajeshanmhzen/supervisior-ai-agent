export type PaginationOptions = {
  page?: number | undefined;
  limit?: number | undefined;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type PaginatedResult<T> = {
  data: T[];
} & PaginationMeta;

export const getPaginationParams = (options?: PaginationOptions) => {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, options?.limit ?? 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
