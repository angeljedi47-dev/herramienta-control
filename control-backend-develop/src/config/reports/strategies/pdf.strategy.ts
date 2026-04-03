import { Injectable } from '@nestjs/common';
import {
    IReportStrategy,
    ITableReportOptions,
    IReportResult,
} from '../interfaces/report.interfaces';
import ReactPDF from '@react-pdf/renderer';
import { PdfTableDocument } from '../components/pdf-table.component';
import { PdfBaseDocument } from '../components/pdf-base.component';
import React from 'react';

@Injectable()
export class PdfReportStrategy implements IReportStrategy {
    async generate(options: ITableReportOptions): Promise<IReportResult> {
        const {
            headers,
            data,
            title = 'Reporte',
            fileName = 'reporte',
            customTexts,
        } = options;

        // Determinar orientación basada en el número de columnas
        const isLandscape = headers.length > 6;

        // Crear el componente de tabla con las props
        const tableComponent = React.createElement(PdfTableDocument, {
            title,
            headers,
            data,
            customTexts,
        });

        // Envolver automáticamente con PdfBaseDocument
        const documentWithBase = React.createElement(PdfBaseDocument, {
            orientation: isLandscape ? 'landscape' : 'portrait',
            children: tableComponent,
        });

        const stream = await ReactPDF.renderToStream(documentWithBase);

        const buff = [];
        for await (const chunk of stream) {
            buff.push(chunk);
        }

        const buffer = Buffer.concat(buff);

        return {
            buffer,
            mimeType: 'application/pdf',
            fileName: `${fileName}.pdf`,
        };
    }
}
