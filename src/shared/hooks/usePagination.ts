// src/shared/hooks/usePagination.ts
import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  total:           number;
  defaultPageSize?: number;
  defaultPage?:    number;
}

export function usePagination({
  total,
  defaultPageSize = 10,
  defaultPage     = 1,
}: UsePaginationOptions) {
  const [page,     setPage]     = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages  = Math.max(1, Math.ceil(total / pageSize));
  const safePage    = Math.min(page, totalPages);
  const offset      = (safePage - 1) * pageSize;

  const goToPage   = (p: number)  => setPage(Math.min(Math.max(1, p), totalPages));
  const nextPage   = ()            => goToPage(safePage + 1);
  const prevPage   = ()            => goToPage(safePage - 1);
  const firstPage  = ()            => goToPage(1);
  const lastPage   = ()            => goToPage(totalPages);
  const changeSize = (size: number)=> { setPageSize(size); setPage(1); };

  return {
    page: safePage, pageSize, totalPages, offset,
    total, goToPage, nextPage, prevPage,
    firstPage, lastPage, changeSize,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    from: offset + 1,
    to:   Math.min(offset + pageSize, total),
  };
}
