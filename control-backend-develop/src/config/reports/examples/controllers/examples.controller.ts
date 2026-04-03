import { Controller, Get, Query, Res } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiProduces,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { ExamplesService } from '../services/examples.service';

@ApiTags('Reportes - Ejemplos')
@Controller('reports/examples')
export class ExamplesController {
    constructor(private readonly examplesService: ExamplesService) {}

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Descargar reporte de tabla en formato Excel (EJEMPLO)',
    })
    @ApiProduces(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    @ApiResponse({
        status: 200,
        description: 'Archivo Excel de tabla generado correctamente.',
    })
    @Get('download-excel-table')
    async downloadExcelTable(@Res() res: ExpressResponse) {
        const report =
            await this.examplesService.generateTestTableReport('excel');
        res.set({
            'Content-Type': report.mimeType,
            'Content-Disposition': `attachment; filename="${report.fileName}"`,
            'Content-Length': report.buffer.length,
        });
        return res.send(report.buffer);
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Descargar reporte de tabla en formato PDF (EJEMPLO)',
    })
    @ApiProduces('application/pdf')
    @ApiResponse({
        status: 200,
        description: 'Archivo PDF de tabla generado correctamente.',
    })
    @Get('download-pdf-table')
    async downloadPdfTable(@Res() res: ExpressResponse) {
        const report =
            await this.examplesService.generateTestTableReport('pdf');
        res.set({
            'Content-Type': report.mimeType,
            'Content-Disposition': `attachment; filename="${report.fileName}"`,
            'Content-Length': report.buffer.length,
        });
        return res.send(report.buffer);
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Descargar reporte de tabla en formato PDF o Excel (selector EJEMPLO)',
    })
    @ApiQuery({
        name: 'format',
        enum: ['pdf', 'excel'],
        required: true,
        example: 'pdf',
        description: 'Formato del archivo a descargar (pdf o excel)',
    })
    @ApiResponse({
        status: 200,
        description:
            'Archivo de tabla generado correctamente en el formato solicitado.',
    })
    @Get('download-table-format')
    async downloadTableFormat(
        @Query('format') format: 'pdf' | 'excel',
        @Res() res: ExpressResponse,
    ) {
        if (!format || (format !== 'pdf' && format !== 'excel')) {
            res.status(400).send({
                message: 'Formato inválido. Usa ?format=pdf o ?format=excel',
            });
            return;
        }
        const report =
            await this.examplesService.generateTestTableReport(format);
        res.set({
            'Content-Type': report.mimeType,
            'Content-Disposition': `attachment; filename="${report.fileName}"`,
            'Content-Length': report.buffer.length,
        });
        return res.send(report.buffer);
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Descargar PDF con componente personalizado (EJEMPLO)',
    })
    @ApiProduces('application/pdf')
    @ApiResponse({
        status: 200,
        description:
            'Archivo PDF con componente personalizado generado correctamente.',
    })
    @Get('download-custom-component-pdf')
    async downloadCustomComponentPdf(@Res() res: ExpressResponse) {
        const report = await this.examplesService.generateTestCustomPdfReport();

        res.set({
            'Content-Type': report.mimeType,
            'Content-Disposition': `attachment; filename="${report.fileName}"`,
            'Content-Length': report.buffer.length,
        });
        return res.send(report.buffer);
    }
}
