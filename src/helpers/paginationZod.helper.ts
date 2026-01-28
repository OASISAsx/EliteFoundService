import { PaginationInput } from "../schemas/pagination.schema";

export const getPagination = ({ page, limit }: PaginationInput) => {
  // 👇 รองรับ 0-based จาก frontend (เช่น MUI DataGrid)
  const safePage = page <= 0 ? 1 : page;

  const take = limit;
  const skip = (safePage - 1) * limit;

  return {
    page: safePage, // 👈 backend page (1-based)
    limit,
    take,
    skip,
  };
};
