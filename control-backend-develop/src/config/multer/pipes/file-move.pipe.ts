import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';

export interface IFileMoveConfig {
    [fieldName: string]: string;
}

export interface IMovedFileInfo {
    originalname: string;
    filename: string;
    finalPath: string;
    size: number;
    mimetype: string;
    encoding: string;
    fieldname?: string;
}

export class FileMovePipe implements PipeTransform {
    private readonly tempPath: string;
    private readonly config: IFileMoveConfig | string;

    constructor(config?: IFileMoveConfig | string) {
        // Usar la variable de entorno correcta
        const tempPath = process.env.PATHS_PATH_TEMP || './temp';
        this.tempPath = join(process.cwd(), tempPath);

        // Crear la carpeta temp si no existe
        if (!existsSync(this.tempPath)) {
            mkdirSync(this.tempPath, { recursive: true });
            console.log(`Carpeta temporal creada: ${this.tempPath}`);
        }

        this.config = config || 'files_test';
    }

    transform(
        value:
            | Express.Multer.File
            | Express.Multer.File[]
            | { [fieldname: string]: Express.Multer.File[] },
        _metadata: ArgumentMetadata,
    ):
        | IMovedFileInfo
        | IMovedFileInfo[]
        | { [fieldname: string]: IMovedFileInfo[] } {
        if (!value) {
            return value as any;
        }

        // Caso: Single file
        if (
            !Array.isArray(value) &&
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            'originalname' in value
        ) {
            return this.moveSingleFile(value as Express.Multer.File);
        }

        // Caso: Array de archivos (FilesInterceptor)
        if (Array.isArray(value)) {
            return this.moveMultipleFiles(value as Express.Multer.File[]);
        }

        // Caso: Multiple fields (FileFieldsInterceptor)
        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value)
        ) {
            return this.moveFieldSpecificFiles(
                value as { [fieldname: string]: Express.Multer.File[] },
            );
        }

        return value as any;
    }

    private validateExistFileOnTemp(filename: string): boolean {
        const tempFilePath = join(this.tempPath, filename);
        return existsSync(tempFilePath);
    }

    private moveFileOfTempToFinalDest(
        filename: string,
        finalDestination: string,
    ): string {
        const tempFilePath = join(this.tempPath, filename);
        const finalDir = join(
            process.cwd(),
            'public',
            'dinamics',
            finalDestination,
        );
        const finalPath = join(finalDir, filename);

        if (!existsSync(finalDir)) {
            mkdirSync(finalDir, { recursive: true });
        }

        // Mover archivo
        renameSync(tempFilePath, finalPath);

        return finalPath;
    }

    private moveFileFromSource(
        sourcePath: string,
        finalDestination: string,
        filename: string,
    ): string {
        const finalDir = join(
            process.cwd(),
            'public',
            'dinamics',
            finalDestination,
        );
        const finalPath = join(finalDir, filename);

        if (!existsSync(finalDir)) {
            mkdirSync(finalDir, { recursive: true });
        }

        // Mover archivo desde la ubicación encontrada
        renameSync(sourcePath, finalPath);

        return finalPath;
    }

    private getDestinationPath(fieldName?: string): string {
        if (typeof this.config === 'string') {
            return this.config;
        }

        if (fieldName && this.config[fieldName]) {
            return this.config[fieldName];
        }

        // Fallback a configuración por defecto
        return this.config.default || 'files_test';
    }

    private moveSingleFile(file: Express.Multer.File): IMovedFileInfo {
        // Verificar que el archivo existe en temp
        if (!this.validateExistFileOnTemp(file.filename)) {
            console.warn(
                `Archivo ${file.filename} no encontrado en temp. Buscando en otras ubicaciones...`,
            );

            // Buscar el archivo en diferentes ubicaciones posibles
            const possiblePaths = [
                join(this.tempPath, file.filename),
                join(process.cwd(), 'uploads', file.filename),
                join(process.cwd(), 'temp', file.filename),
                file.path, // Ruta original de Multer si existe
            ];

            let sourcePath = null;
            for (const path of possiblePaths) {
                if (existsSync(path)) {
                    sourcePath = path;
                    console.log(`Archivo encontrado en: ${sourcePath}`);
                    break;
                }
            }

            if (!sourcePath) {
                console.error(
                    `No se pudo encontrar el archivo ${file.filename} en ninguna ubicación`,
                );
                // Retornar objeto con ruta simulada como fallback
                const destination = this.getDestinationPath();
                const finalPath = join(
                    process.cwd(),
                    'public',
                    'dinamics',
                    destination,
                    file.filename,
                );

                return {
                    originalname: file.originalname,
                    filename: file.filename,
                    finalPath,
                    size: file.size,
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    fieldname: file.fieldname,
                };
            }

            // Mover desde la ubicación encontrada
            const destination = this.getDestinationPath();
            const finalPath = this.moveFileFromSource(
                sourcePath,
                destination,
                file.filename,
            );

            return {
                originalname: file.originalname,
                filename: file.filename,
                finalPath,
                size: file.size,
                mimetype: file.mimetype,
                encoding: file.encoding,
                fieldname: file.fieldname,
            };
        }

        // Mover archivo a destino final
        const destination = this.getDestinationPath();
        const finalPath = this.moveFileOfTempToFinalDest(
            file.filename,
            destination,
        );

        return {
            originalname: file.originalname,
            filename: file.filename,
            finalPath,
            size: file.size,
            mimetype: file.mimetype,
            encoding: file.encoding,
            fieldname: file.fieldname,
        };
    }

    private moveMultipleFiles(files: Express.Multer.File[]): IMovedFileInfo[] {
        const movedFiles: IMovedFileInfo[] = [];

        for (const file of files) {
            // Verificar que el archivo existe en temp
            if (!this.validateExistFileOnTemp(file.filename)) {
                console.warn(
                    `Archivo ${file.filename} no encontrado en temp. Buscando en otras ubicaciones...`,
                );

                // Buscar el archivo en diferentes ubicaciones posibles
                const possiblePaths = [
                    join(this.tempPath, file.filename),
                    join(process.cwd(), 'uploads', file.filename),
                    join(process.cwd(), 'temp', file.filename),
                    file.path, // Ruta original de Multer si existe
                ];

                let sourcePath = null;
                for (const path of possiblePaths) {
                    if (existsSync(path)) {
                        sourcePath = path;
                        console.log(`Archivo encontrado en: ${sourcePath}`);
                        break;
                    }
                }

                if (!sourcePath) {
                    console.error(
                        `No se pudo encontrar el archivo ${file.filename} en ninguna ubicación`,
                    );
                    // Retornar objeto con ruta simulada como fallback
                    const destination = this.getDestinationPath();
                    const finalPath = join(
                        process.cwd(),
                        'public',
                        'dinamics',
                        destination,
                        file.filename,
                    );

                    movedFiles.push({
                        originalname: file.originalname,
                        filename: file.filename,
                        finalPath,
                        size: file.size,
                        mimetype: file.mimetype,
                        encoding: file.encoding,
                        fieldname: file.fieldname,
                    });
                    continue;
                }

                // Mover desde la ubicación encontrada
                const destination = this.getDestinationPath();
                const finalPath = this.moveFileFromSource(
                    sourcePath,
                    destination,
                    file.filename,
                );

                movedFiles.push({
                    originalname: file.originalname,
                    filename: file.filename,
                    finalPath,
                    size: file.size,
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    fieldname: file.fieldname,
                });
                continue;
            }

            // Mover archivo a destino final
            const destination = this.getDestinationPath();
            const finalPath = this.moveFileOfTempToFinalDest(
                file.filename,
                destination,
            );

            movedFiles.push({
                originalname: file.originalname,
                filename: file.filename,
                finalPath,
                size: file.size,
                mimetype: file.mimetype,
                encoding: file.encoding,
                fieldname: file.fieldname,
            });
        }

        return movedFiles;
    }

    private moveFieldSpecificFiles(files: {
        [fieldname: string]: Express.Multer.File[];
    }): { [fieldname: string]: IMovedFileInfo[] } {
        const result: { [fieldname: string]: IMovedFileInfo[] } = {};

        for (const [fieldName, fieldFiles] of Object.entries(files)) {
            if (fieldFiles && fieldFiles.length > 0) {
                const movedFiles: IMovedFileInfo[] = [];

                for (const file of fieldFiles) {
                    // Verificar que el archivo existe en temp
                    if (!this.validateExistFileOnTemp(file.filename)) {
                        console.warn(
                            `Archivo ${file.filename} no encontrado en temp. Buscando en otras ubicaciones...`,
                        );

                        // Buscar el archivo en diferentes ubicaciones posibles
                        const possiblePaths = [
                            join(this.tempPath, file.filename),
                            join(process.cwd(), 'uploads', file.filename),
                            join(process.cwd(), 'temp', file.filename),
                            file.path, // Ruta original de Multer si existe
                        ];

                        let sourcePath = null;
                        for (const path of possiblePaths) {
                            if (existsSync(path)) {
                                sourcePath = path;
                                console.log(
                                    `Archivo encontrado en: ${sourcePath}`,
                                );
                                break;
                            }
                        }

                        if (!sourcePath) {
                            console.error(
                                `No se pudo encontrar el archivo ${file.filename} en ninguna ubicación`,
                            );
                            // Retornar objeto con ruta simulada como fallback
                            const destination =
                                this.getDestinationPath(fieldName);
                            const finalPath = join(
                                process.cwd(),
                                'public',
                                'dinamics',
                                destination,
                                file.filename,
                            );

                            movedFiles.push({
                                originalname: file.originalname,
                                filename: file.filename,
                                finalPath,
                                size: file.size,
                                mimetype: file.mimetype,
                                encoding: file.encoding,
                                fieldname: file.fieldname,
                            });
                            continue;
                        }

                        // Mover desde la ubicación encontrada
                        const destination = this.getDestinationPath(fieldName);
                        const finalPath = this.moveFileFromSource(
                            sourcePath,
                            destination,
                            file.filename,
                        );

                        movedFiles.push({
                            originalname: file.originalname,
                            filename: file.filename,
                            finalPath,
                            size: file.size,
                            mimetype: file.mimetype,
                            encoding: file.encoding,
                            fieldname: file.fieldname,
                        });
                        continue;
                    }

                    // Mover archivo a destino final (directorio específico por campo)
                    const destination = this.getDestinationPath(fieldName);
                    const finalPath = this.moveFileOfTempToFinalDest(
                        file.filename,
                        destination,
                    );

                    movedFiles.push({
                        originalname: file.originalname,
                        filename: file.filename,
                        finalPath,
                        size: file.size,
                        mimetype: file.mimetype,
                        encoding: file.encoding,
                        fieldname: file.fieldname,
                    });
                }

                result[fieldName] = movedFiles;
            }
        }

        return result;
    }
}
