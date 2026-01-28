"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.getPagination = void 0;
const getPagination = ({ page = 1, limit = 10 }) => {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    return { take, skip, page: Number(page), limit: take };
};
exports.getPagination = getPagination;
const buildPaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.buildPaginationMeta = buildPaginationMeta;
