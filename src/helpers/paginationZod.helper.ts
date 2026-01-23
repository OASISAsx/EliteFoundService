import { PaginationInput } from "../schemas/pagination.schema";

export const getPagination = ({ page, limit }: PaginationInput) => {
  const take = limit;
  const skip = (page - 1) * limit;

  return { page, limit, take, skip };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
