import { Injectable } from '@nestjs/common';
import {
    IReportFactory,
    IReportStrategy,
    IReportFormat,
    IReportType,
} from '../interfaces/report.interfaces';
import { ExcelReportStrategy } from '../strategies/excel.strategy';
import { PdfReportStrategy } from '../strategies/pdf.strategy';
import { PdfCustomReportStrategy } from '../strategies/pdf-custom.strategy';

@Injectable()
export class ReportFactory implements IReportFactory {
    constructor(
        private readonly excelStrategy: ExcelReportStrategy,
        private readonly pdfStrategy: PdfReportStrategy,
        private readonly pdfCustomStrategy: PdfCustomReportStrategy,
    ) {}

    createStrategy(format: IReportFormat, type: IReportType): IReportStrategy {
        switch (format) {
            case 'excel':
                if (type === 'table') {
                    return this.excelStrategy;
                }
                throw new Error(
                    `Tipo de reporte no soportado para Excel: ${type}`,
                );
            case 'pdf':
                switch (type) {
                    case 'table':
                        return this.pdfStrategy;
                    case 'custom':
                        return this.pdfCustomStrategy;
                    default:
                        throw new Error(
                            `Tipo de reporte PDF no soportado: ${type}`,
                        );
                }
            default:
                throw new Error(`Formato de reporte no soportado: ${format}`);
        }
    }
}
