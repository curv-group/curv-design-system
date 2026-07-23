// Export helpers for DataTable — CSV is dependency-free; PDF lazily imports
// jsPDF only when the user actually exports, so it never touches the initial
// bundle (jspdf + jspdf-autotable are optional peers).

function csvCell(value: unknown): string {
  let s = value == null ? "" : String(value);
  // Neutralize CSV/formula injection (=, +, -, @ at the start of a cell).
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/["\n\r,]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export type CellValue = string | number | null | undefined;

export function toCsv(headers: string[], rows: CellValue[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  // Leading BOM so Excel reads UTF-8; CRLF line endings.
  return "﻿" + lines.join("\r\n");
}

function download(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadCsv(headers: string[], rows: CellValue[][], filename: string) {
  const name = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  download(toCsv(headers, rows), name, "text/csv;charset=utf-8");
}

export interface PdfOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  /** Per-column horizontal alignment, matched to the table. */
  align?: ("left" | "right")[];
}

export async function downloadPdf(headers: string[], rows: CellValue[][], opts: PdfOptions) {
  let jsPDF: typeof import("jspdf").jsPDF;
  let autoTable: typeof import("jspdf-autotable").default;
  try {
    jsPDF = (await import("jspdf")).jsPDF;
    autoTable = (await import("jspdf-autotable")).default;
  } catch {
    throw new Error(
      "PDF export needs `jspdf` and `jspdf-autotable` installed in the host app.",
    );
  }

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  let startY = 40;
  if (opts.title) {
    doc.setFontSize(14);
    doc.setTextColor(27, 27, 27);
    doc.text(opts.title, 40, startY);
    startY += 18;
  }
  if (opts.subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(opts.subtitle, 40, startY);
    startY += 14;
  }

  const columnStyles = (opts.align ?? []).reduce<Record<number, { halign: "left" | "right" }>>(
    (acc, a, i) => {
      if (a === "right") acc[i] = { halign: "right" };
      return acc;
    },
    {},
  );

  autoTable(doc, {
    head: [headers],
    body: rows.map((r) => r.map((c) => (c == null ? "" : String(c)))),
    startY: startY + 6,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 9, cellPadding: 5, lineColor: [230, 230, 230], lineWidth: 0.5 },
    headStyles: { fillColor: [27, 27, 27], textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles,
    didDrawPage: (data) => {
      const page = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${data.pageNumber} of ${page}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 16);
    },
  });

  const name = opts.filename.endsWith(".pdf") ? opts.filename : `${opts.filename}.pdf`;
  doc.save(name);
}
