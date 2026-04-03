import { Injectable } from '@nestjs/common';
import {
    IReportStrategy,
    ITableReportOptions,
    IReportResult,
} from '../interfaces/report.interfaces';
import { ExcelTableDocument } from '../components/excel.table.component';

@Injectable()
export class ExcelReportStrategy implements IReportStrategy {
    async generate(options: ITableReportOptions): Promise<IReportResult> {
        const {
            headers,
            data,
            title = 'Reporte',
            fileName = 'reporte',
            customTexts,
        } = options;

        const buffer = await ExcelTableDocument({
            title,
            headers,
            data,
            customTexts,
        });

        return {
            buffer: Buffer.from(buffer),
            mimeType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fileName: `${fileName}.xlsx`,
        };
    }
}
