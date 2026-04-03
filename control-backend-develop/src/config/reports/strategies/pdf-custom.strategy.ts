import { Injectable } from '@nestjs/common';
import {
    IReportStrategy,
    IPdfReportOptions,
    IReportResult,
} from '../interfaces/report.interfaces';
import ReactPDF from '@react-pdf/renderer';
import React from 'react';
import { PdfBaseDocument } from '../components/pdf-base.component';

@Injectable()
export class PdfCustomReportStrategy implements IReportStrategy {
    async generate(options: IPdfReportOptions): Promise<IReportResult> {
        const { component, fileName = 'reporte' } = options;

        // Crear el componente personalizado con las props
        const customComponent = React.createElement(
            component.component,
            component.props || {},
        );

        // Envolver automáticamente con PdfBaseDocument
        const documentWithBase = React.createElement(PdfBaseDocument, {
            children: customComponent,
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
