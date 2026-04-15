// ============================================================
// USE EXPORT HOOK
// src/shared/hooks/useExport.ts
// ============================================================

import { useCallback, useState } from 'react';
import { exportToCSV, exportToExcel, exportToPDF } from '@/shared/utils/exportUtils';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = useCallback(
    (data: Record<string, unknown>[], filename: string, headers?: Record<string, string>) => {
      setIsExporting(true);
      try {
        exportToCSV(data, filename, headers);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const handleExportExcel = useCallback(
    async (
      data: Record<string, unknown>[],
      filename: string,
      sheetName?: string,
      headers?: Record<string, string>
    ) => {
      setIsExporting(true);
      try {
        await exportToExcel(data, filename, sheetName, headers);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const handleExportPDF = useCallback(
    async (elementId: string, filename: string, title?: string) => {
      setIsExporting(true);
      try {
        await exportToPDF(elementId, filename, title);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    isExporting,
    exportCSV:   handleExportCSV,
    exportExcel: handleExportExcel,
    exportPDF:   handleExportPDF,
  };
}
