// src/shared/hooks/useTableState.ts
import { useState, useCallback } from 'react';

interface TableState {
  search:      string;
  sortKey:     string;
  sortDir:     'asc' | 'desc';
  page:        number;
  pageSize:    number;
  selectedIds: string[];
  filters:     Record<string, unknown>;
}

export function useTableState(defaults: Partial<TableState> = {}) {
  const [state, setState] = useState<TableState>({
    search:      '',
    sortKey:     defaults.sortKey  ?? '',
    sortDir:     defaults.sortDir  ?? 'asc',
    page:        defaults.page     ?? 1,
    pageSize:    defaults.pageSize ?? 10,
    selectedIds: [],
    filters:     {},
    ...defaults,
  });

  const setSearch   = useCallback((search: string) =>
    setState((s) => ({ ...s, search, page: 1 })), []);

  const setSort     = useCallback((key: string) =>
    setState((s) => ({
      ...s,
      sortKey: key,
      sortDir: s.sortKey === key && s.sortDir === 'asc' ? 'desc' : 'asc',
      page:    1,
    })), []);

  const setPage     = useCallback((page: number) =>
    setState((s) => ({ ...s, page })), []);

  const setPageSize = useCallback((pageSize: number) =>
    setState((s) => ({ ...s, pageSize, page: 1 })), []);

  const setFilter   = useCallback((key: string, value: unknown) =>
    setState((s) => ({ ...s, filters: { ...s.filters, [key]: value }, page: 1 })), []);

  const toggleSelect = useCallback((id: string) =>
    setState((s) => ({
      ...s,
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((i) => i !== id)
        : [...s.selectedIds, id],
    })), []);

  const selectAll   = useCallback((ids: string[]) =>
    setState((s) => ({ ...s, selectedIds: ids })), []);

  const clearSelect = useCallback(() =>
    setState((s) => ({ ...s, selectedIds: [] })), []);

  const reset       = useCallback(() =>
    setState({ search: '', sortKey: '', sortDir: 'asc', page: 1, pageSize: 10, selectedIds: [], filters: {} }), []);

  return {
    ...state,
    setSearch, setSort, setPage, setPageSize,
    setFilter, toggleSelect, selectAll, clearSelect, reset,
  };
}
