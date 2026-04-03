import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';
import { FileSizeUtil } from 'src/config/multer/utils/file-size.util';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    private readonly MAX_FILE_SIZE: number;

    constructor(private readonly maxFileSize: number) {
        this.MAX_FILE_SIZE = maxFileSize * FileSizeUtil.BYTES_IN_MB;
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
            if (value && (value as Express.Multer.File).size) {
                this.validateFileSize(value as Express.Multer.File);
            }
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor)
        if (Array.isArray(value)) {
            value
                .filter((file) => file)
                .forEach((file) => this.validateFileSize(file));
            return value;
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (value instanceof Object) {
            Object.values(value).forEach((files) => {
                if (Array.isArray(files) && files.length > 0) {
                    files
                        .filter((file) => file && file.size)
                        .forEach((file) => this.validateFileSize(file));
                }
            });
        }

        return value;
    }

    private validateFileSize(file: Express.Multer.File) {
        // Validar que el archivo existe y tiene las propiedades necesarias
        if (!file) {
            return; // Si no hay archivo, no validar
        }

        if (!file.size) {
            throw new BaseException({
                message: 'El archivo no tiene un tamaño válido',
                statusCode: 400,
            });
        }

        if (file.size > this.MAX_FILE_SIZE) {
            const actualSize = FileSizeUtil.formatFileSize(file.size);
            const maxSize = FileSizeUtil.formatFileSize(this.MAX_FILE_SIZE);

            throw new BaseException({
                message: `El archivo ${file.originalname || 'sin nombre'} (${actualSize}) excede el tamaño máximo permitido de ${maxSize}`,
                statusCode: 400,
            });
        }
    }
}
