export const LARGE_LIST_PAGE_SIZE = 10;

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = LARGE_LIST_PAGE_SIZE,
): {
  pageItems: T[];
  page: number;
  totalPages: number;
  total: number;
  start: number;
  end: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    pageItems,
    page: safePage,
    totalPages,
    total,
    start: total === 0 ? 0 : startIndex + 1,
    end: startIndex + pageItems.length,
  };
}
