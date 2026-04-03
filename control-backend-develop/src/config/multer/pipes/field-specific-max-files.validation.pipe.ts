import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

interface IFieldMaxFilesConfig {
    [fieldName: string]: number; // Número máximo de archivos por campo
}

@Injectable()
export class FieldSpecificMaxFilesValidationPipe implements PipeTransform {
    private readonly fieldMaxFilesConfig: IFieldMaxFilesConfig;

    constructor(fieldMaxFilesConfig: IFieldMaxFilesConfig) {
        this.fieldMaxFilesConfig = fieldMaxFilesConfig;
    }

    transform(
        value:
            | Express.Multer.File
            | Express.Multer.File[]
            | { [fieldname: string]: Express.Multer.File[] },
    ) {
        console.log(
            '🔍 MaxFiles Pipe recibió:',
            typeof value,
            Array.isArray(value),
            value instanceof Object,
        );

        // Caso: No hay archivos
        if (!value) {
            console.log('❌ No hay archivos para validar');
            return value;
        }

        // Caso: Single file (no aplica validación de cantidad)
        if (!Array.isArray(value) && typeof value !== 'object') {
            console.log('📄 Single file - no aplica validación de cantidad');
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor) - usa configuración por defecto
        if (Array.isArray(value)) {
            console.log(
                '📁 Array de archivos - validando con configuración por defecto',
            );
            this.validateMaxFiles(value, 'default');
            return value;
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            console.log(
                '📁 Multiple fields - campos disponibles:',
                Object.keys(value),
            );
            Object.entries(value).forEach(([fieldName, files]) => {
                console.log(
                    `Procesando campo: ${fieldName} con ${files?.length || 0} archivos`,
                );
                if (Array.isArray(files) && files.length > 0) {
                    this.validateMaxFiles(files, fieldName);
                }
            });
        }

        return value;
    }

    private validateMaxFiles(files: Express.Multer.File[], fieldName: string) {
        console.log(`🔍 Validando maxFiles para campo: ${fieldName}`);

        // Obtener el número máximo de archivos permitidos para este campo específico
        const maxFiles = this.fieldMaxFilesConfig[fieldName] || 1; // 1 archivo por defecto
        console.log(
            `📊 Configuración para ${fieldName}: máximo ${maxFiles} archivos`,
        );

        // Filtrar archivos válidos (que tengan filename)
        const validFiles = files.filter((file) => file && file.filename);
        console.log(
            `📁 Archivos válidos en ${fieldName}: ${validFiles.length}`,
        );

        if (validFiles.length > maxFiles) {
            console.log(
                `❌ ERROR: ${fieldName} excede el límite (${validFiles.length} > ${maxFiles})`,
            );
            throw new BaseException({
                message: 'Existen campos con demasiados archivos',
                statusCode: 400,
                errors: [
                    {
                        property: fieldName,
                        message: `El campo "${fieldName}" tiene ${validFiles.length} archivos, pero solo se permiten ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}`,
                    },
                ],
            });
        }

        // Log de éxito para debug
        console.log(
            `✅ Campo "${fieldName}" validado correctamente: ${validFiles.length}/${maxFiles} archivos`,
        );
    }
}
