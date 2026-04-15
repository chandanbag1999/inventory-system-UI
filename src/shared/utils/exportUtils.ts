// ============================================================
// EXPORT UTILITIES
// src/shared/utils/exportUtils.ts
// ============================================================

import { toast } from 'sonner';

// ─── CSV Export ──────────────────────────────────────────────
export const exportToCSV = (
  data:     Record<string, unknown>[],
  filename: string,
  headers?: Record<string, string>
): void => {
  if (!data.length) { toast.error('No data to export'); return; }

  const keys = Object.keys(data[0]);
  const head = headers
    ? keys.map((k) => headers[k] ?? k)
    : keys;

  const rows = data.map((row) =>
    keys.map((k) => {
      const val = row[k];
      if (val == null)           return '';
      if (typeof val === 'string' && val.includes(','))
        return '"' + val.replace(/"/g, '""') + '"';
      return String(val);
    }).join(',')
  );

  const csv  = [head.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename + '.csv');
  toast.success('CSV exported successfully');
};

// ─── Excel Export ────────────────────────────────────────────
export const exportToExcel = async (
  data:      Record<string, unknown>[],
  filename:  string,
  sheetName  = 'Sheet1',
  headers?:  Record<string, string>
): Promise<void> => {
  if (!data.length) { toast.error('No data to export'); return; }

  try {
    const XLSX = await import('xlsx');

    const exportData = headers
      ? data.map((row) => {
          const mapped: Record<string, unknown> = {};
          Object.keys(row).forEach((k) => {
            mapped[headers[k] ?? k] = row[k];
          });
          return mapped;
        })
      : data;

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Auto column widths
    const colWidths = Object.keys(exportData[0] ?? {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...exportData.map((r) => String(r[key] ?? '').length)
      ) + 2,
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, filename + '.xlsx');
    toast.success('Excel exported successfully');
  } catch (err) {
    console.error('Excel export failed:', err);
    toast.error('Failed to export Excel');
  }
};

// ─── PDF Export ──────────────────────────────────────────────
export const exportToPDF = async (
  elementId: string,
  filename:  string,
  title?:    string
): Promise<void> => {
  try {
    toast.loading('Generating PDF...');
    const element = document.getElementById(elementId);
    if (!element) { toast.error('Element not found'); return; }

    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF }   = await import('jspdf');

    const canvas = await html2canvas(element, {
      scale:           2,
      useCORS:         true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgW = pdfW - 20;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (title) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, 10, 15);
      pdf.addImage(imgData, 'PNG', 10, 25, imgW, Math.min(imgH, pdfH - 35));
    } else {
      pdf.addImage(imgData, 'PNG', 10, 10, imgW, Math.min(imgH, pdfH - 20));
    }

    pdf.save(filename + '.pdf');
    toast.dismiss();
    toast.success('PDF exported successfully');
  } catch (err) {
    console.error('PDF export failed:', err);
    toast.dismiss();
    toast.error('Failed to export PDF');
  }
};

// ─── Helper ──────────────────────────────────────────────────
function downloadBlob(blob: Blob, filename: string): void {
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href  = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
