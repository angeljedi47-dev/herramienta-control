import React from 'react';

// Interfaces para reportes tabulares
export interface IReportHeader {
    title: string;
    key: string;
    width?: number;
}

export interface IReportData {
    [key: string]: any;
}

// Interfaces para PDFs personalizados
export interface IPdfComponent {
    component: React.ComponentType<any>;
    props?: Record<string, any>;
}

// Interfaces unificadas para todos los tipos de reportes
export interface ITableReportOptions {
    format: 'excel' | 'pdf';
    type: 'table';
    headers: IReportHeader[];
    data: IReportData[];
    title?: string;
    fileName?: string;
    customTexts?: {
        mainTitle?: string;
        direccion?: string;
        subdireccion?: string;
    };
}

export interface IPdfReportOptions {
    format: 'pdf';
    type: 'custom';
    component: IPdfComponent;
    fileName?: string;
}

export type IReportOptions = ITableReportOptions | IPdfReportOptions;

export interface IReportResult {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
}

export type IReportFormat = 'pdf' | 'excel';
export type IReportType = 'table' | 'custom';
export type IExtension = 'pdf' | 'xlsx';

export interface IReportStrategy {
    generate(options: IReportOptions): Promise<IReportResult>;
}

export interface IReportFactory {
    createStrategy(format: IReportFormat, type: IReportType): IReportStrategy;
}
