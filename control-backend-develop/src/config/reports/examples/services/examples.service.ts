import { Injectable } from '@nestjs/common';
import { ReportService } from '../../services/report.service';
import {
    IReportHeader,
    IReportData,
    IPdfComponent,
} from '../../interfaces/report.interfaces';
import { TestCustomDocument } from '../components/test-custom.component';

@Injectable()
export class ExamplesService {
    constructor(private readonly reportService: ReportService) {}

    getTestHeaders(): IReportHeader[] {
        return [
            { title: 'Nombre', key: 'nombre' },
            { title: 'Apellido paterno', key: 'apellidoPaterno' },
            { title: 'Usuario', key: 'usuario' },
            { title: 'Estado', key: 'estado' },
            { title: 'Fecha creación', key: 'fechaCreacion' },
            { title: 'Fecha actualización', key: 'fechaActualizacion' },
        ];
    }

    getTestData(): IReportData[] {
        return [
            {
                nombre: 'Juan',
                apellidoPaterno: 'Pérez',
                usuario: 'jperez',
                estado: 'Activo',
                fechaCreacion: '2024-01-01',
                fechaActualizacion: '2024-01-01',
            },
            {
                nombre: 'Ana',
                apellidoPaterno: 'García',
                usuario: 'agarcia',
                estado: 'Inactivo',
                fechaCreacion: '2023-12-15',
                fechaActualizacion: '2023-12-15',
            },
        ];
    }

    async generateTestTableReport(format: 'pdf' | 'excel') {
        const headers = this.getTestHeaders();
        const data = this.getTestData();

        if (format === 'excel') {
            return this.reportService.generateExcelTableReport(
                headers,
                data,
                'Datos de prueba',
                'datos-prueba',
            );
        } else {
            return this.reportService.generatePdfTableReport(
                headers,
                data,
                'Datos de prueba',
                'datos-prueba',
            );
        }
    }

    async generateTestCustomPdfReport() {
        const component: IPdfComponent = {
            component: TestCustomDocument,
            props: {
                title: 'Reporte Personalizado de Prueba',
                content:
                    'Este es un ejemplo de un PDF generado con un componente personalizado. El sistema permite crear cualquier tipo de diseño usando componentes React.',
            },
        };

        return this.reportService.generateCustomPdfReport(
            component,
            'reporte-personalizado-prueba',
        );
    }
}
