import { PipeTransform, Injectable } from '@nestjs/common';
import { BaseException } from 'src/shared/exceptions/base.exception';

@Injectable()
export class MaxFilesValidationPipe implements PipeTransform {
    constructor(private readonly maxFiles: number) {}

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
            return value;
        }

        // Caso: Array de archivos (FilesInterceptor)
        if (Array.isArray(value)) {
            this.validateFilesCount(value);
            return value;
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (value instanceof Object) {
            const totalFiles = Object.values(value).reduce(
                (acc, files) => acc + files.length,
                0,
            );
            if (totalFiles > this.maxFiles) {
                throw new BaseException({
                    message: `Se excedió el número máximo de archivos permitidos. Máximo ${this.maxFiles} archivo(s)`,
                    statusCode: 400,
                });
            }
        }

        return value;
    }

    private validateFilesCount(files: Express.Multer.File[]) {
        if (files.length > this.maxFiles) {
            throw new BaseException({
                message: `Se excedió el número máximo de archivos permitidos. Máximo ${this.maxFiles} archivo(s)`,
                statusCode: 400,
            });
        }
    }
}
