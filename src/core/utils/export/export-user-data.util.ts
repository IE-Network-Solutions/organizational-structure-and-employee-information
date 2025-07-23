import { DownloadFormat } from '@root/src/app/modules/users/dto/export-user.dto';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

export interface ExportColumn {
  header: string;
  key: string;
  width: number;
}

export interface ExportOptions {
  columns: ExportColumn[];
  exportData: any[];
  exportUserDto: any;
}

export async function generateExportFile({
  columns,
  exportData,
  exportUserDto,
}: ExportOptions): Promise<{
  buffer: Buffer;
  fileName: string;
  mimetype: string;
}> {
  let buffer: Buffer;
  let fileName: string;
  let mimetype: string;

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate(),
  )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  if (exportUserDto.downloadFormat === DownloadFormat.EXCEL) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');
    worksheet.columns = columns.map((col) => ({ ...col }));
    worksheet.addRows(exportData);
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1976D2' },
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });
      column.width = maxLength;
    });
    buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    fileName = `users-${timestamp}.xlsx`;
    mimetype =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    // doc.on('end', () => { /* not used */});
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const totalColumnWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const scale = pageWidth / totalColumnWidth;
    const scaledColumns = columns.map((col) => ({
      ...col,
      width: col.width * scale,
    }));
    const rowHeight = 18;
    const headerFontSize = 7;
    const dataFontSize = 6;
    const cellPadding = 0.5;
    let y = doc.y;
    let x = doc.page.margins.left;
    scaledColumns.forEach((col) => {
      doc
        .rect(x, y, col.width, rowHeight)
        .fill('#1976D2')
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .fontSize(headerFontSize)
        .text(col.header, x + cellPadding, y + 5, {
          width: col.width - 2 * cellPadding,
          align: 'center',
        });
      x += col.width;
    });
    y += rowHeight;
    exportData.forEach((row, idx) => {
      x = doc.page.margins.left;
      const cellHeights = scaledColumns.map((col) => {
        const text =
          row[col.key] !== undefined && row[col.key] !== null
            ? row[col.key].toString()
            : '';
        return (
          doc.heightOfString(text, {
            width: col.width - 2 * cellPadding,
          }) + 4
        );
      });
      const rowHeightAuto = Math.max(...cellHeights, 18);
      scaledColumns.forEach((col) => {
        doc.save();
        doc
          .rect(x, y, col.width, rowHeightAuto)
          .fill(idx % 2 === 0 ? '#F5F5F5' : '#FFFFFF');
        doc.restore();
        const text =
          row[col.key] !== undefined && row[col.key] !== null
            ? row[col.key].toString()
            : '';
        doc
          .fillColor('black')
          .font('Helvetica')
          .fontSize(dataFontSize)
          .text(text, x + cellPadding, y + 2, {
            width: col.width - 2 * cellPadding,
            align: 'center',
          });
        x += col.width;
      });
      y += rowHeightAuto;
      if (y + 18 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.y;
      }
    });
    doc.end();
    buffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
    fileName = `users-${timestamp}.pdf`;
    mimetype = 'application/pdf';
  }

  return { buffer, fileName, mimetype };
}
