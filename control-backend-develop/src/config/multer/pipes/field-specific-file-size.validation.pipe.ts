import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';
import { FileSizeUtil } from 'src/config/multer/utils/file-size.util';

interface IFieldSizeConfig {
    [fieldName: string]: number; // Tamaño máximo en MB
}

@Injectable()
export class FieldSpecificFileSizeValidationPipe implements PipeTransform {
    private readonly fieldSizeConfig: IFieldSizeConfig;

    constructor(fieldSizeConfig: IFieldSizeConfig) {
        this.fieldSizeConfig = fieldSizeConfig;
    }

    transform(
        value:
            | Express.Multer.File
            | Express.Multer.File[]
            | { [fieldname: string]: Express.Multer.File[] },
    ) {
        // Caso: No hay archivos
        if (!value) {
            return value;
        }

        // Caso: Single file (usa configuración por defecto)
        if (!Array.isArray(value) && typeof value !== 'object') {
            if (value && (value as Express.Multer.File).size) {
                this.validateFileSize(value as Express.Multer.File, 'default');
            }
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor) - usa configuración por defecto
        if (Array.isArray(value)) {
            this.validateTotalSize(value, 'default');
            return value;
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            Object.entries(value).forEach(([fieldName, files]) => {
                if (Array.isArray(files) && files.length > 0) {
                    this.validateTotalSize(files, fieldName);
                }
            });
        }

        return value;
    }

    private validateTotalSize(files: Express.Multer.File[], fieldName: string) {
        // Filtrar archivos válidos
        const validFiles = files.filter(
            (file) => file && file.size && file.filename,
        );

        if (validFiles.length === 0) {
            return; // No hay archivos válidos para validar
        }

        // Validar propiedades básicas de cada archivo
        for (const file of validFiles) {
            if (!file.size) {
                throw new BaseException({
                    message: 'El archivo no tiene un tamaño válido',
                    statusCode: 400,
                    errors: [
                        {
                            property: fieldName,
                            message: 'El archivo no tiene un tamaño válido',
                        },
                    ],
                });
            }

            if (!file.filename) {
                throw new BaseException({
                    message: 'El archivo no tiene un nombre de archivo válido',
                    statusCode: 400,
                    errors: [
                        {
                            property: fieldName,
                            message:
                                'El archivo no tiene un nombre de archivo válido',
                        },
                    ],
                });
            }
        }

        // Calcular el tamaño total acumulado
        const totalSizeBytes = validFiles.reduce(
            (total, file) => total + file.size,
            0,
        );
        const totalSizeFormatted = FileSizeUtil.formatFileSize(totalSizeBytes);

        // Obtener el tamaño máximo permitido para este campo específico
        const maxSizeMB =
            this.fieldSizeConfig[fieldName] ||
            this.fieldSizeConfig['default'] ||
            5; // 5MB por defecto
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir MB a bytes

        // Validar el tamaño total acumulado
        if (totalSizeBytes > maxSizeBytes) {
            const fileNames = validFiles
                .map((file) => `"${file.originalname}"`)
                .join(', ');

            throw new BaseException({
                message: 'Existen archivos con tamaño excesivo',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: `Los archivos [${fileNames}] tienen un tamaño total de ${totalSizeFormatted}, pero el límite máximo para este campo es ${maxSizeMB}MB. No se guardará ningún archivo.`,
                    },
                ],
            });
        }

        // Log de éxito para debug
        console.log(
            `✅ Campo "${fieldName}" validado correctamente: ${validFiles.length} archivos, tamaño total: ${totalSizeFormatted}/${maxSizeMB}MB`,
        );
    }

    private validateFileSize(file: Express.Multer.File, fieldName: string) {
        // Validar que el archivo existe y tiene las propiedades necesarias
        if (!file) {
            return; // Si no hay archivo, no validar
        }

        if (!file.size) {
            throw new BaseException({
                message: 'El archivo no tiene un tamaño válido',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: 'El archivo no tiene un tamaño válido',
                    },
                ],
            });
        }

        if (!file.filename) {
            throw new BaseException({
                message: 'El archivo no tiene un nombre de archivo válido',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message:
                            'El archivo no tiene un nombre de archivo válido',
                    },
                ],
            });
        }

        // Obtener el tamaño máximo permitido para este campo específico
        const maxSizeMB =
            this.fieldSizeConfig[fieldName] ||
            this.fieldSizeConfig['default'] ||
            5; // 5MB por defecto
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir MB a bytes
        const fileSize = FileSizeUtil.formatFileSize(file.size);

        if (file.size > maxSizeBytes) {
            throw new BaseException({
                message: 'Existen archivos con tamaño excesivo',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: `El archivo "${file.originalname}" (${fileSize}) excede el tamaño máximo permitido. Tamaño máximo para este campo: ${maxSizeMB}MB`,
                    },
                ],
            });
        }
    }
}
