import { Injectable } from '@angular/core';
import * as ExcelJs from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  async exportToExcel<T extends Record<string, unknown>>(data: T[], fileName: string): Promise<void> {
    if (data.length === 0) {
      console.error('No data to export.');
      return;
    }

    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((item) => {
      const row = headers.map((header) => item[header]);
      worksheet.addRow(row);
    });

    worksheet.columns.forEach((column) => {
      if (column) {
        column.width = 20;
      }
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 12 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const buffer: ArrayBuffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, fileName);
  }

  private saveExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
