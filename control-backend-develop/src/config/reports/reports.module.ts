import { Module } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ExamplesService } from './examples/services/examples.service';
import { ReportFactory } from './factories/report.factory';
import { ExcelReportStrategy } from './strategies/excel.strategy';
import { PdfReportStrategy } from './strategies/pdf.strategy';
import { PdfCustomReportStrategy } from './strategies/pdf-custom.strategy';
import { ExamplesController } from './examples/controllers/examples.controller';

@Module({
    providers: [
        ReportService,
        ExamplesService,
        ReportFactory,
        ExcelReportStrategy,
        PdfReportStrategy,
        PdfCustomReportStrategy,
    ],
    controllers: [ExamplesController],
    exports: [ReportService],
})
export class ReportsModule {}
