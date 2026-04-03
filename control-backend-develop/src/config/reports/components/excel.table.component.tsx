import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { format } from 'date-fns';
import { IReportData, IReportHeader } from '../interfaces/report.interfaces';

interface IExcelTableDocumentProps {
    title: string;
    headers: IReportHeader[];
    data: IReportData[];
    customTexts?: {
        mainTitle?: string;
        direccion?: string;
        subdireccion?: string;
    };
}

export const ExcelTableDocument = async ({
    title,
    headers,
    data,
    customTexts = {},
}: IExcelTableDocumentProps): Promise<ExcelJS.Buffer> => {
    const nameDireccion = customTexts.direccion || 'Nombre de la <dirección>';
    const nameSubdireccion =
        customTexts.subdireccion || 'Nombre de la <subdirección>';
    const mainTitle = customTexts.mainTitle || 'Nombre del reporte';
    const headerRowIndex = 9;

    const workbook = new ExcelJS.Workbook();
    const worksheetName =
        title.length > 31 ? title.substring(0, 28) + '...' : title;
    const worksheet = workbook.addWorksheet(worksheetName);

    // 1. Agregar logo
    try {
        const logoPath = path.join(
            __dirname,
            '../../../../public/statics/img/logo-agn-gob.png',
        );
        if (fs.existsSync(logoPath)) {
            const imageId = workbook.addImage({
                filename: logoPath,
                extension: 'png',
            });
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width: 300, height: 100 },
            });
        }
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error.message);
    }

    for (let i = 1; i < headerRowIndex; i++) {
        worksheet.getRow(i);
    }

    const getColumnLetter = (index: number): string => {
        let column = '';
        let i = index + 1;
        while (i > 0) {
            const modulo = (i - 1) % 26;
            column = String.fromCharCode(65 + modulo) + column;
            i = Math.floor((i - modulo) / 26);
        }
        return column || 'A';
    };

    const lastColLetter = getColumnLetter(Math.max(0, headers.length - 1));

    // Configurar títulos
    const titleCell = worksheet.getCell('A4');
    titleCell.value = mainTitle;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    const subtitleCell = worksheet.getCell('A5');
    subtitleCell.value = `${title}`;
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Configurar dirección y subdirección
    const dirCol = getColumnLetter(Math.max(0, headers.length - 1));
    const textDireccion = worksheet.getCell(`${dirCol}2`);
    textDireccion.value = nameDireccion;
    textDireccion.font = { size: 9, bold: true };
    textDireccion.alignment = { horizontal: 'right' };

    const textSubdireccion = worksheet.getCell(`${dirCol}3`);
    textSubdireccion.value = nameSubdireccion;
    textSubdireccion.font = { size: 7 };
    textSubdireccion.alignment = { horizontal: 'right' };

    worksheet.mergeCells(`A4:${lastColLetter}4`);
    worksheet.mergeCells(`A5:${lastColLetter}5`);

    const dirStartCol = getColumnLetter(Math.max(0, headers.length - 3));
    worksheet.mergeCells(`${dirStartCol}2:${lastColLetter}2`);
    worksheet.mergeCells(`${dirStartCol}3:${lastColLetter}3`);

    const celdaFechaValue = worksheet.getCell(`${lastColLetter}8`);
    celdaFechaValue.value = `Fecha elaboración: ${format(new Date(), 'dd-MM-yyyy')}`;
    celdaFechaValue.alignment = { horizontal: 'right', vertical: 'middle' };
    celdaFechaValue.font = { bold: true };
    celdaFechaValue.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    };

    const headerTitles = headers.map((h) => h.title);
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.values = [...headerTitles];
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
    };
    headerRow.border = {
        top: {},
        left: {},
        bottom: {},
        right: {},
    };

    headerRow.eachCell((cell) => {
        const fillColor = 'EADEC8';
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
        };
        cell.font = { bold: true };
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
        };
    });

    headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1);
        column.width = header.width || 30;
    });

    data.forEach((rowData, rowIndex) => {
        const rowValues = headers.map((header) => rowData[header.key] || '');
        const currentRow = worksheet.getRow(headerRowIndex + rowIndex + 1);
        currentRow.values = [...rowValues];
    });

    const lastDataRow = headerRowIndex + data.length;
    for (let row = headerRowIndex + 1; row <= lastDataRow; row++) {
        for (let col = 1; col <= headers.length; col++) {
            const cell = worksheet.getCell(row, col);
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            };
        }
    }

    worksheet.views = [
        {
            state: 'frozen',
            ySplit: 10,
            showGridLines: false,
        },
    ];

    return await workbook.xlsx.writeBuffer();
};
