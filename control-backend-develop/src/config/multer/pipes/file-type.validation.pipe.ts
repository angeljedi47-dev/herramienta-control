import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';
import { BaseTypesFiles } from 'src/config/multer/file-upload.interface';
import { extname } from 'path';
import { FileSizeUtil } from 'src/config/multer/utils/file-size.util';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    private readonly allowedTypes: BaseTypesFiles[];

    constructor(
        allowedTypes: BaseTypesFiles[] = [
            '.pdf',
            '.doc',
            '.docx',
            '.xls',
            '.xlsx',
            '.jpg',
            '.jpeg',
            '.png',
        ],
    ) {
        this.allowedTypes = allowedTypes;
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

        // Caso: Single file
        if (!Array.isArray(value) && !(value instanceof Object)) {
            if (value && (value as Express.Multer.File).originalname) {
                this.validateFileType(value as Express.Multer.File);
            }
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor)
        if (Array.isArray(value)) {
            value
                .filter((file) => file)
                .forEach((file) => this.validateFileType(file));
            return value;
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (value instanceof Object) {
            Object.values(value).forEach((files) => {
                if (Array.isArray(files) && files.length > 0) {
                    files
                        .filter((file) => file && file.originalname)
                        .forEach((file) => this.validateFileType(file));
                }
            });
        }

        return value;
    }

    private validateFileType(file: Express.Multer.File) {
        // Validar que el archivo existe y tiene las propiedades necesarias
        if (!file) {
            return; // Si no hay archivo, no validar
        }

        if (!file.originalname) {
            throw new BaseException({
                message: 'El archivo no tiene un nombre válido',
                statusCode: 400,
            });
        }

        const fileExtension = extname(
            file.originalname,
        ).toLowerCase() as BaseTypesFiles;
        const fileSize = FileSizeUtil.formatFileSize(file.size || 0);

        if (!this.allowedTypes.includes(fileExtension)) {
            throw new BaseException({
                message: `El archivo "${file.originalname}" (${fileSize}) tiene un formato no permitido. Los tipos permitidos son: ${this.allowedTypes.join(', ')}`,
                statusCode: 400,
            });
        }
    }
}
