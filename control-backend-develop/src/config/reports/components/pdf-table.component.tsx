import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { IReportHeader, IReportData } from '../interfaces/report.interfaces';

interface IPdfTableDocumentProps {
    title: string;
    headers: IReportHeader[];
    data: IReportData[];
    customTexts?: {
        mainTitle?: string;
        direccion?: string;
        subdireccion?: string;
    };
}

// Función para crear estilos dinámicamente basados en la orientación
const createStyles = (isLandscape: boolean) => {
    return StyleSheet.create({
        title: {
            fontSize: isLandscape ? 16 : 18,
            fontWeight: 'bold',
            marginBottom: isLandscape ? 20 : 25,
            textAlign: 'center',
            color: '#333333',
            paddingHorizontal: 10,
        },
        direccion: {
            fontSize: 9,
            fontWeight: 'bold',
            textAlign: 'right',
            marginBottom: 2,
        },
        subdireccion: {
            fontSize: 7,
            textAlign: 'right',
            marginBottom: 8,
        },
        table: {
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000000',
            marginTop: 15,
            marginBottom: 15,
            display: 'flex',
            flexDirection: 'column',
            pageBreakInside: 'avoid',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            minHeight: 24,
        },
        tableRowLast: {
            flexDirection: 'row',
            borderBottomWidth: 0,
        },
        tableColHeader: {
            borderStyle: 'solid',
            borderRightWidth: 1,
            borderRightColor: '#000000',
            backgroundColor: '#631233',
            textAlign: 'center',
            padding: isLandscape ? 4 : 6,
            fontWeight: 'bold',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        tableColHeaderLast: {
            backgroundColor: '#631233',
            textAlign: 'center',
            padding: isLandscape ? 4 : 6,
            fontWeight: 'bold',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        tableCol: {
            borderStyle: 'solid',
            borderRightWidth: 1,
            borderRightColor: '#000000',
            textAlign: 'center',
            padding: isLandscape ? 3 : 5,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        tableColLast: {
            textAlign: 'center',
            padding: isLandscape ? 3 : 5,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
        },
        tableCell: {
            fontSize: isLandscape ? 7 : 8,
            color: '#000000',
            lineHeight: 1.1,
            paddingVertical: 2,
            paddingHorizontal: 2,
            wordBreak: 'break-word',
        },
        tableCellHeader: {
            fontSize: isLandscape ? 7 : 8,
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.0,
            paddingVertical: 2,
            paddingHorizontal: 2,
        },
    });
};

export const PdfTableDocument: React.FC<IPdfTableDocumentProps> = ({
    title,
    headers,
    data,
    customTexts = {},
}) => {
    // Determinar si el documento debe estar en modo horizontal (más de 6 columnas)
    const isLandscape = headers.length > 6;
    const styles = createStyles(isLandscape);
    const mainTitle = customTexts.mainTitle || 'Nombre del reporte';
    const direccion = customTexts.direccion || 'Nombre de la <dirección>';
    const subdireccion =
        customTexts.subdireccion || 'Nombre de la <subdirección>';

    // Solo dividir si hay más de 8 columnas
    const shouldSplit = headers.length > 8;
    // Para 3 páginas: 1-6, 1-2+7-11, 1-2+12-17
    const firstBlockHeaders = shouldSplit ? headers.slice(0, 6) : headers;
    const secondBlockHeaders = shouldSplit
        ? [...headers.slice(0, 2), ...headers.slice(6, 11)]
        : [];
    const thirdBlockHeaders = shouldSplit
        ? [...headers.slice(0, 2), ...headers.slice(11)]
        : [];

    // Función auxiliar para calcular el ancho de columna
    const getColumnWidth = (blockHeaders: IReportHeader[]) => {
        const totalCustomWidth = blockHeaders.reduce(
            (sum, header) => sum + (header.width || 0),
            0,
        );
        const headersWithoutWidth = blockHeaders.filter(
            (header) => !header.width,
        ).length;
        const remainingWidth =
            totalCustomWidth > 0 ? Math.max(100 - totalCustomWidth, 0) : 100;
        return headersWithoutWidth > 0
            ? remainingWidth / headersWithoutWidth
            : 100 / blockHeaders.length;
    };

    // Renderizado de tabla genérico para bloques de columnas
    const renderTable = (blockHeaders: IReportHeader[], pageKey: string) => {
        const defaultColumnWidth = getColumnWidth(blockHeaders);
        return (
            <View style={styles.table} key={pageKey}>
                {/* Encabezados de la tabla */}
                <View style={styles.tableRow}>
                    {blockHeaders.map((header, index) => (
                        <View
                            key={`header-${pageKey}-${index}`}
                            style={{
                                ...(index === blockHeaders.length - 1
                                    ? styles.tableColHeaderLast
                                    : styles.tableColHeader),
                                width: header.width
                                    ? `${header.width}%`
                                    : `${defaultColumnWidth}%`,
                            }}
                        >
                            <Text style={styles.tableCellHeader}>
                                {header.title}
                            </Text>
                        </View>
                    ))}
                </View>
                {/* Filas de datos */}
                {data.map((row, rowIndex) => (
                    <View
                        key={`row-${pageKey}-${rowIndex}`}
                        style={
                            rowIndex === data.length - 1
                                ? styles.tableRowLast
                                : styles.tableRow
                        }
                    >
                        {blockHeaders.map((header, colIndex) => (
                            <View
                                key={`cell-${pageKey}-${rowIndex}-${colIndex}`}
                                style={{
                                    ...(colIndex === blockHeaders.length - 1
                                        ? styles.tableColLast
                                        : styles.tableCol),
                                    width: header.width
                                        ? `${header.width}%`
                                        : `${defaultColumnWidth}%`,
                                }}
                            >
                                <Text style={styles.tableCell}>
                                    {String(row[header.key] || '')}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <>
            <Text style={styles.direccion}>{direccion}</Text>
            <Text style={styles.subdireccion}>{subdireccion}</Text>
            <Text style={styles.title}>{mainTitle}</Text>
            <Text style={styles.title}>{title}</Text>
            {renderTable(firstBlockHeaders, 'block1')}
            {shouldSplit && (
                <>
                    {renderTable(secondBlockHeaders, 'block2')}
                    {renderTable(thirdBlockHeaders, 'block3')}
                </>
            )}
        </>
    );
};
