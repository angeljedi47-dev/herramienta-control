# Módulo de Generación de Reportes

Este módulo proporciona una solución completa y flexible para la generación de reportes en formatos Excel y PDF. Utiliza el patrón Factory para crear diferentes tipos de reportes manteniendo una estructura unificada.

---

## Características

- **Reportes tabulares**: Generación de reportes en Excel (.xlsx) y PDF con formato de tabla
- **PDFs personalizados**: Generación de PDFs con componentes React personalizados
- **Completamente genérico** - No contiene lógica específica de dominio
- **Reutilizable** - Puede ser usado para cualquier tipo de datos
- **Personalizable** - Permite configurar headers, datos, títulos y componentes personalizados
- **Arquitectura unificada** - Utiliza el patrón Factory y Strategy en una sola estructura

---

## Arquitectura del Módulo

```
src/config/reports/
├── components/           # Componentes de renderizado
│   ├── excel.table.component.tsx
│   ├── pdf-table.component.tsx
│   └── pdf-base.component.tsx
├── examples/            # Ejemplos de implementación
│   ├── components/
│   │   └── test-custom.component.tsx
│   ├── controllers/
│   │   └── examples.controller.ts
│   └── services/
│       └── examples.service.ts
├── factories/           # Factory para crear estrategias
│   └── report.factory.ts
├── interfaces/          # Interfaces y tipos
│   └── report.interfaces.ts
├── services/           # Servicios principales
│   └── report.service.ts
├── strategies/         # Estrategias de generación
│   ├── excel.strategy.ts
│   ├── pdf.strategy.ts
│   └── pdf-custom.strategy.ts
├── reports.module.ts   # Módulo NestJS
└── index.ts           # Exports públicos
```

---

## Uso del Servicio

### 1. Inyectar el ReportService

```typescript
import { ReportService } from '@/config/reports';

@Injectable()
export class TuServicio {
    constructor(private readonly reportService: ReportService) {}
}
```

---

## Reportes Tabulares

### Generar reporte Excel

```typescript
async generarReporteExcel() {
    const headers = [
        { title: 'Nombre', key: 'nombre' },
        { title: 'Email', key: 'email' },
        { title: 'Estado', key: 'estado' },
    ];

    const data = [
        { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', estado: 'Activo' },
        { nombre: 'Ana García', email: 'ana@ejemplo.com', estado: 'Inactivo' },
    ];

    return await this.reportService.generateExcelTableReport(
        headers,
        data,
        'Reporte de Usuarios',
        'usuarios-reporte',
        {
            mainTitle: 'SISTEMA DE GESTIÓN',
            direccion: 'Dirección de Tecnologías',
            subdireccion: 'Subdirección de Desarrollo',
        }
    );
}
```

### Generar reporte PDF de tabla

```typescript
async generarReportePdfTabla() {
    const headers = [
        { title: 'ID', key: 'id' },
        { title: 'Nombre', key: 'nombre' },
        { title: 'Estado', key: 'estado' },
    ];

    const data = [
        { id: 1, nombre: 'Ejemplo 1', estado: 'Activo' },
        { id: 2, nombre: 'Ejemplo 2', estado: 'Inactivo' },
    ];

    return await this.reportService.generatePdfTableReport(
        headers,
        data,
        'Reporte de Ejemplos',
        'ejemplos-reporte'
    );
}
```

---

## PDFs Personalizados

### Crear un componente personalizado

```typescript
import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

interface IReportePersonalizadoProps {
    titulo: string;
    contenido: string;
    fecha: string;
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    contenido: {
        fontSize: 12,
        lineHeight: 1.5,
        marginBottom: 30,
    },
    fecha: {
        fontSize: 10,
        textAlign: 'right',
        color: '#666666',
    },
});

export const ReportePersonalizado: React.FC<IReportePersonalizadoProps> = ({
    titulo,
    contenido,
    fecha,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.contenido}>{contenido}</Text>
            <Text style={styles.fecha}>Fecha: {fecha}</Text>
        </View>
    );
};
```

### Generar PDF personalizado

```typescript
async generarPdfPersonalizado() {
    return await this.reportService.generateCustomPdfReport(
        {
            component: ReportePersonalizado,
            props: {
                titulo: 'Mi Reporte Personalizado',
                contenido: 'Este es el contenido del reporte...',
                fecha: '2024-01-15',
            },
        },
        'reporte-personalizado'
    );
}
```

### ¿Cómo funciona?

El sistema automáticamente envuelve tu componente con `PdfBaseDocument`, por lo que:

1. **Tu componente** solo debe contener el contenido específico
2. **El sistema** aplica automáticamente:
   - Fuentes NotoSans
   - Fondo institucional
   - Configuración de página
   - Padding y márgenes estándar
   - Orientación automática (para tablas)

**Ejemplo correcto:**
```typescript
// Componente de tabla
export const MiTabla = (props) => {
    return (
        <Text>Mi tabla</Text>  // ✅ Solo el contenido
    );
};

// Componente personalizado
export const MiComponente = (props) => {
    return (
        <Text>Mi contenido</Text>  // ✅ Solo el contenido
    );
};
```

---

## Interfaces y Tipos

### Para Reportes Tabulares

```typescript
interface IReportHeader {
    title: string;    // Título que se muestra en el reporte
    key: string;      // Clave para acceder al dato en IReportData
    width?: number;   // Ancho de columna (opcional, en porcentaje)
}

interface IReportData {
    [key: string]: any;  // Objeto con datos dinámicos
}

interface ITableReportOptions {
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
```

### Para PDFs Personalizados

```typescript
interface IPdfComponent {
    component: React.ComponentType<any>;
    props?: Record<string, any>;
}

interface IPdfReportOptions {
    format: 'pdf';
    type: 'custom';
    component: IPdfComponent;
    fileName?: string;
}
```

---

## Características de los Formatos

### Excel (.xlsx) - Tablas

- **Logo institucional** incluido automáticamente
- **Headers personalizables** con estilos corporativos
- **Ancho de columnas** configurable
- **Formato de fecha** automático
- **Estilos** consistentes con la identidad visual

### PDF - Tablas

- **Orientación automática** (portrait/landscape según número de columnas)
- **Múltiples páginas** para tablas con muchas columnas (>8 columnas)
- **Fuentes personalizadas** (NotoSans)
- **Imagen de fondo** institucional
- **Responsive** - Se adapta al contenido
- **Componente base** aplicado automáticamente

### PDF - Personalizado

- **Componente base** aplicado automáticamente con fuentes y fondo institucional
- **Flexibilidad total** en el diseño
- **Reutilización** de componentes
- **Props dinámicas** para personalización
- **Múltiples páginas** soportadas
- **No requiere** usar PdfBaseDocument en los componentes finales

---

## Métodos del Servicio

El servicio tiene exactamente 3 métodos para cubrir todos los casos de uso:

```typescript
// 1. Generar reporte Excel de tabla
generateExcelTableReport(headers, data, title?, fileName?, customTexts?)

// 2. Generar reporte PDF de tabla
generatePdfTableReport(headers, data, title?, fileName?, customTexts?)

// 3. Generar reporte PDF personalizado
generateCustomPdfReport(component, fileName?)
```

---

## Endpoints de Ejemplos

El módulo incluye endpoints de ejemplo en `ExamplesController` para demostrar su funcionamiento:

- `GET /reports/examples/download-excel-table` - Descarga reporte Excel de tabla de ejemplo
- `GET /reports/examples/download-pdf-table` - Descarga reporte PDF de tabla de ejemplo
- `GET /reports/examples/download-table-format?format=pdf|excel` - Selector de formato para tablas
- `GET /reports/examples/download-custom-component-pdf` - Descarga PDF con componente personalizado de ejemplo

---

## Ventajas de la Arquitectura

1. **Estructura unificada**: Todo en un solo directorio con Factory pattern
2. **Flexibilidad**: Puedes crear cualquier tipo de PDF con componentes React
3. **Reutilización**: El componente base se aplica automáticamente
4. **API clara**: Solo 3 métodos bien definidos
5. **Escalabilidad**: Fácil agregar nuevos tipos de reportes
6. **Mantenibilidad**: Código más organizado y fácil de mantener
7. **Simplicidad**: Los componentes finales no necesitan usar PdfBaseDocument
8. **Consistencia**: Todos los PDFs (tablas y personalizados) usan la misma base

---

## Configuración

El módulo se registra automáticamente en `AppModule` y no requiere configuración adicional. Solo asegúrate de que las dependencias (`exceljs`, `@react-pdf/renderer`) estén instaladas.