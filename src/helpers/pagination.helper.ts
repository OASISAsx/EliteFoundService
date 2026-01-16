type PaginationParams = {
  page?: number;
  limit?: number;
};

const getPagination = ({ page = 1, limit = 10 }: PaginationParams) => {
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  return { take, skip, page: Number(page), limit: take };
};

const buildPaginationMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export { getPagination, buildPaginationMeta };
