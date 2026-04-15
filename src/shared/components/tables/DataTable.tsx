// ============================================================
// DATA TABLE - Universal Reusable Table
// src/shared/components/tables/DataTable.tsx
// ============================================================

import { useState, useMemo, useCallback } from 'react';
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight,
  Search, X,
} from 'lucide-react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn }       from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────
export interface Column<T> {
  key:        string;
  label:      string;
  sortable?:  boolean;
  width?:     string;
  className?: string;
  render?:    (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  data:           T[];
  columns:        Column<T>[];
  isLoading?:     boolean;
  searchable?:    boolean;
  searchPlaceholder?: string;
  onRowClick?:    (row: T) => void;
  actions?:       (row: T) => React.ReactNode;
  emptyMessage?:  string;
  defaultSort?:   { key: string; dir: 'asc' | 'desc' };
  rowClassName?:  (row: T) => string;
  selectedIds?:   string[];
  onSelect?:      (id: string) => void;
  onSelectAll?:   (ids: string[]) => void;
  toolbar?:       React.ReactNode;
  footer?:        React.ReactNode;
  pageSize?:      number;
}

type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp   className="h-3 w-3 ml-1 text-primary" />
    : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading       = false,
  searchable      = true,
  searchPlaceholder = 'Search...',
  onRowClick,
  actions,
  emptyMessage    = 'No data found.',
  defaultSort,
  rowClassName,
  selectedIds     = [],
  onSelect,
  onSelectAll,
  toolbar,
  footer,
  pageSize:       defaultPageSize = 10,
}: DataTableProps<T>) {
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState(defaultSort?.key  ?? '');
  const [sortDir,  setSortDir]  = useState<SortDir>(defaultSort?.dir ?? 'asc');
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const toggleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }, [sortKey]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((row) =>
        columns.some((col) => {
          const val = (row as Record<string, unknown>)[col.key];
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      list.sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        let cmp  = 0;
        if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
        else cmp = String(av ?? '').localeCompare(String(bv ?? ''));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [data, search, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allSelected = paginated.length > 0 && paginated.every((r) => selectedIds.includes(r.id));

  const handleSelectAll = () => {
    if (allSelected) onSelectAll?.([]);
    else             onSelectAll?.(paginated.map((r) => r.id));
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Toolbar */}
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={searchPlaceholder}
                className="pl-9 h-9 text-sm"
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {/* Selected Banner */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-primary/5 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {selectedIds.length} row{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <button onClick={() => onSelectAll?.([])} className="text-xs text-muted-foreground hover:text-foreground">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {onSelect && (
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={handleSelectAll}
                    className="rounded border-border" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  style={{ width: col.width }}
                  className={cn(
                    'text-left py-3 px-4 text-xs font-semibold text-muted-foreground select-none',
                    col.sortable !== false && 'cursor-pointer hover:text-foreground transition-colors',
                    col.className
                  )}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable !== false && (
                      <SortIcon active={sortKey === col.key} dir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="py-3 px-4 w-12" />}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {onSelect && <td className="py-3 px-4"><Skeleton className="h-4 w-4" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </td>
                  ))}
                  {actions && <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelect ? 1 : 0) + (actions ? 1 : 0)}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border/50 last:border-0 transition-colors group',
                    onRowClick && 'cursor-pointer hover:bg-muted/30',
                    selectedIds.includes(row.id) && 'bg-primary/5',
                    rowClassName?.(row)
                  )}
                >
                  {onSelect && (
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onSelect(row.id)}
                        className="rounded border-border"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const val = (row as Record<string, unknown>)[col.key];
                    return (
                      <td key={col.key} className={cn('py-3 px-4', col.className)}>
                        {col.render ? col.render(val, row, index) : String(val ?? '-')}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="h-7 rounded border border-input bg-background px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
              {[10, 25, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={safePage <= 1} onClick={() => setPage(1)}><ChevronsLeft className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={safePage >= totalPages} onClick={() => setPage(totalPages)}><ChevronsRight className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </div>
      )}

      {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
    </div>
  );
}
