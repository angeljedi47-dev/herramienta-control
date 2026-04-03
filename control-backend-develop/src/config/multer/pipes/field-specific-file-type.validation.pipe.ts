import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';
import { BaseTypesFiles } from 'src/config/multer/file-upload.interface';
import { extname } from 'path';
import { FileSizeUtil } from 'src/config/multer/utils/file-size.util';

interface IFieldValidationConfig {
    [fieldName: string]: BaseTypesFiles[];
}

@Injectable()
export class FieldSpecificFileTypeValidationPipe implements PipeTransform {
    private readonly fieldValidations: IFieldValidationConfig;

    constructor(fieldValidations: IFieldValidationConfig) {
        this.fieldValidations = fieldValidations;
    }

    transform(
        value:
            | Express.Multer.File
            | Express.Multer.File[]
            | { [fieldname: string]: Express.Multer.File[] },
    ) {
        console.log(
            '🔍 Pipe recibió:',
            typeof value,
            Array.isArray(value),
            value instanceof Object,
        );
        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            console.log('📁 Campos disponibles:', Object.keys(value));
        }

        // Caso: No hay archivos
        if (!value) {
            return value;
        }

        // Caso: Single file (no aplica validación por campo)
        if (!Array.isArray(value) && typeof value !== 'object') {
            if (value && (value as Express.Multer.File).originalname) {
                this.validateFileType(value as Express.Multer.File, 'default');
            }
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor) - usa validación por defecto
        if (Array.isArray(value)) {
            value
                .filter((file) => file)
                .forEach((file) => this.validateFileType(file, 'default'));
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
                    files
                        .filter(
                            (file) =>
                                file && file.originalname && file.filename,
                        )
                        .forEach((file) =>
                            this.validateFileType(file, fieldName),
                        );
                }
            });
        }

        return value;
    }

    private validateFileType(file: Express.Multer.File, fieldName: string) {
        // Validar que el archivo existe y tiene las propiedades necesarias
        if (!file) {
            return; // Si no hay archivo, no validar
        }

        if (!file.originalname) {
            throw new BaseException({
                message: 'El archivo no tiene un nombre válido',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: 'El archivo no tiene un nombre válido',
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

        const fileExtension = extname(
            file.originalname,
        ).toLowerCase() as BaseTypesFiles;
        const fileSize = FileSizeUtil.formatFileSize(file.size || 0);

        // Obtener los tipos permitidos para este campo específico
        const allowedTypes = this.fieldValidations[fieldName] || [];

        // Si no hay configuración específica para este campo, usar tipos por defecto
        if (allowedTypes.length === 0) {
            const defaultTypes: BaseTypesFiles[] = [
                '.pdf',
                '.doc',
                '.docx',
                '.xls',
                '.xlsx',
                '.jpg',
                '.jpeg',
                '.png',
            ];

            if (!defaultTypes.includes(fileExtension)) {
                throw new BaseException({
                    message: `Existen archivos con formato no permitido`,
                    statusCode: 400,
                    errors: [
                        {
                            property: fieldName,
                            message: `El archivo "${file.originalname}" (${fileSize}) tiene un formato no permitido. Los tipos permitidos son: [${defaultTypes.join(', ')}]`,
                        },
                    ],
                });
            }
            return;
        }

        // Validar contra los tipos permitidos para este campo específico
        if (!allowedTypes.includes(fileExtension)) {
            throw new BaseException({
                message: `Formato no permitido en campo "${fieldName}"`,
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: `El archivo "${file.originalname}" (${fileSize}) tiene un formato no permitido. Los tipos permitidos para este campo son: ${allowedTypes.join(', ')}`,
                    },
                ],
            });
        }

        // Log de éxito para debug
        console.log(
            `✅ Archivo "${file.originalname}" validado correctamente en campo "${fieldName}"`,
        );
    }
}
