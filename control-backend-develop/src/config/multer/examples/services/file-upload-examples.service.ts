import { Injectable } from '@nestjs/common';
import { FileManipulationService } from '../../services/file-manipulation.service';
import { IReqCustom } from 'src/shared/interfaces/request.interface';

import {
    ISingleFileResult,
    IMultipleFilesResult,
    IFieldSpecificResult,
    IFieldSpecificFileResult,
    IUserProfileResult,
} from '../interfaces/file-upload.interfaces';
import { IMovedFileInfo } from '../../pipes/file-move.pipe';

@Injectable()
export class FileUploadExamplesService {
    constructor(
        private readonly fileManipulationService: FileManipulationService,
    ) {}

    async processSingleFile(
        dto: { name: string; description?: string },
        movedFile: IMovedFileInfo,
        _req: IReqCustom,
    ): Promise<ISingleFileResult> {
        // Crear resultado (simulando guardado en BD)
        const result: ISingleFileResult = {
            id: this.generateId(),
            name: dto.name,
            description: dto.description,
            originalName: movedFile.originalname,
            finalPath: movedFile.finalPath,
            size: movedFile.size,
            uploadedAt: new Date(),
        };

        return result;
    }

    async processMultipleFiles(
        dto: { title: string; category?: string },
        movedFiles: IMovedFileInfo[],
        _req: IReqCustom,
    ): Promise<IMultipleFilesResult> {
        const processedFiles = movedFiles.map((movedFile) => ({
            originalName: movedFile.originalname,
            finalPath: movedFile.finalPath,
            size: movedFile.size,
        }));

        // Crear resultado (simulando guardado en BD)
        const result: IMultipleFilesResult = {
            id: this.generateId(),
            title: dto.title,
            category: dto.category,
            files: processedFiles,
            totalFiles: processedFiles.length,
            uploadedAt: new Date(),
        };

        return result;
    }

    async processFieldSpecificFiles(
        dto: { title: string; description?: string },
        finalPaths: {
            imagenes?: IMovedFileInfo[];
            documentos?: IMovedFileInfo[];
        },
        _req: IReqCustom,
    ): Promise<IFieldSpecificResult> {
        const result: IFieldSpecificResult = {
            id: this.generateId(),
            title: dto.title,
            description: dto.description,
            uploadedAt: new Date(),
        };

        // Procesar imágenes si existen
        if (finalPaths.imagenes && finalPaths.imagenes.length > 0) {
            const processedImages: IFieldSpecificFileResult[] =
                finalPaths.imagenes.map((movedFile) => ({
                    originalName: movedFile.originalname,
                    finalPath: movedFile.finalPath,
                    size: movedFile.size,
                }));

            result.imagenes = processedImages;
        }

        // Procesar documentos si existen
        if (finalPaths.documentos && finalPaths.documentos.length > 0) {
            const processedDocuments: IFieldSpecificFileResult[] =
                finalPaths.documentos.map((movedFile) => ({
                    originalName: movedFile.originalname,
                    finalPath: movedFile.finalPath,
                    size: movedFile.size,
                }));

            result.documentos = processedDocuments;
        }

        return result;
    }

    async processUserFiles(
        dto: { userId: string; name: string; description?: string },
        files: {
            fotos?: Express.Multer.File[];
            documentos?: Express.Multer.File[];
        },
        req: IReqCustom,
    ): Promise<IUserProfileResult> {
        const result: IUserProfileResult = {
            id: this.generateId(),
            userId: dto.userId,
            name: dto.name,
            description: dto.description,
            uploadedAt: new Date(),
        };

        // Procesar fotos si existen
        if (files.fotos && files.fotos.length > 0) {
            const processedFotos: IFieldSpecificFileResult[] = [];

            for (const file of files.fotos) {
                // Mover archivo directamente desde temp a la carpeta específica del usuario
                const userFotosDir = `files_test/usuarios/${dto.userId}/fotos`;
                const finalUserPath =
                    this.fileManipulationService.moveFileOfTempToFinalDest(
                        file.filename,
                        userFotosDir,
                    );

                // ⚠️ IMPORTANTE: Actualizar req.files_moved_final con la nueva ruta
                if (!req.files_moved_final) {
                    req.files_moved_final = [];
                }
                req.files_moved_final.push(finalUserPath);

                processedFotos.push({
                    originalName: file.originalname,
                    finalPath: finalUserPath,
                    size: file.size,
                });
            }

            result.fotos = processedFotos;
        }

        // Procesar documentos si existen
        if (files.documentos && files.documentos.length > 0) {
            const processedDocumentos: IFieldSpecificFileResult[] = [];

            for (const file of files.documentos) {
                // Mover archivo directamente desde temp a la carpeta específica del usuario
                const userDocsDir = `files_test/usuarios/${dto.userId}/documentos`;
                const finalUserPath =
                    this.fileManipulationService.moveFileOfTempToFinalDest(
                        file.filename,
                        userDocsDir,
                    );

                // ⚠️ IMPORTANTE: Actualizar req.files_moved_final con la nueva ruta
                if (!req.files_moved_final) {
                    req.files_moved_final = [];
                }
                req.files_moved_final.push(finalUserPath);

                processedDocumentos.push({
                    originalName: file.originalname,
                    finalPath: finalUserPath,
                    size: file.size,
                });
            }

            result.documentos = processedDocumentos;
        }

        return result;
    }

    /**
     * Genera un ID único para el archivo para simular el guardado en la base de datos en estos ejemplos
     * @returns string - ID único
     */
    private generateId(): string {
        return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
