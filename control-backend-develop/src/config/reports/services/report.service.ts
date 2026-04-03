import { Injectable } from '@nestjs/common';
import {
    IReportOptions,
    IReportResult,
    IReportHeader,
    IReportData,
    IPdfComponent,
} from '../interfaces/report.interfaces';
import { ReportFactory } from '../factories/report.factory';

@Injectable()
export class ReportService {
    constructor(private readonly reportFactory: ReportFactory) {}

    // 1. Generar reporte Excel de tabla
    async generateExcelTableReport(
        headers: IReportHeader[],
        data: IReportData[],
        title?: string,
        fileName?: string,
        customTexts?: {
            mainTitle?: string;
            direccion?: string;
            subdireccion?: string;
        },
    ): Promise<IReportResult> {
        const options: IReportOptions = {
            format: 'excel',
            type: 'table',
            headers,
            data,
            title,
            fileName,
            customTexts,
        };
        const strategy = this.reportFactory.createStrategy('excel', 'table');
        return await strategy.generate(options);
    }

    // 2. Generar reporte PDF de tabla
    async generatePdfTableReport(
        headers: IReportHeader[],
        data: IReportData[],
        title?: string,
        fileName?: string,
        customTexts?: {
            mainTitle?: string;
            direccion?: string;
            subdireccion?: string;
        },
    ): Promise<IReportResult> {
        const options: IReportOptions = {
            format: 'pdf',
            type: 'table',
            headers,
            data,
            title,
            fileName,
            customTexts,
        };
        const strategy = this.reportFactory.createStrategy('pdf', 'table');
        return await strategy.generate(options);
    }

    // 3. Generar reporte PDF personalizado
    async generateCustomPdfReport(
        component: IPdfComponent,
        fileName?: string,
    ): Promise<IReportResult> {
        const options: IReportOptions = {
            format: 'pdf',
            type: 'custom',
            component,
            fileName,
        };
        const strategy = this.reportFactory.createStrategy('pdf', 'custom');
        return await strategy.generate(options);
    }
}
