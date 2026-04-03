import { Injectable } from '@nestjs/common';
import { existsSync, unlinkSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import { EnvsService } from '../../env/services/envs.service';

@Injectable()
export class FileManipulationService {
    constructor(private readonly envsService: EnvsService) {}

    /**
     * Obtiene la ruta completa del directorio temporal
     * @returns string - Ruta completa del directorio temporal
     */
    getTempPath(): string {
        return join(
            process.cwd(),
            this.envsService.getGroup('PATHS').PATH_TEMP,
        );
    }

    /**
     * Obtiene la ruta completa del directorio de archivos dinámicos
     * @param finalDestination - Directorio de destino final
     * @returns string - Ruta completa del directorio dinámico
     */
    getDynamicPath(finalDestination: string): string {
        return join(process.cwd(), 'public', 'dinamics', finalDestination);
    }

    /**
     * Verifica si un archivo existe en el directorio temporal
     * @param filename - Nombre del archivo a verificar
     * @returns boolean - true si el archivo existe
     */
    validateExistFileOnTemp(filename: string): boolean {
        const tempPath = join(this.getTempPath(), filename);
        return existsSync(tempPath);
    }

    /**
     * Mueve un archivo desde el directorio temporal a su destino final
     * @param filename - Nombre del archivo a mover
     * @param finalDestination - Directorio de destino final (sin el nombre del archivo)
     * @returns string - Ruta final completa del archivo
     */
    moveFileOfTempToFinalDest(
        filename: string,
        finalDestination: string,
    ): string {
        const tempPath = join(this.getTempPath(), filename);
        const finalDir = this.getDynamicPath(finalDestination);
        const finalPath = join(finalDir, filename);

        // Crear directorio de destino si no existe
        if (!existsSync(finalDir)) {
            mkdirSync(finalDir, { recursive: true });
        }

        // Mover archivo
        renameSync(tempPath, finalPath);

        return finalPath;
    }

    /**
     * Elimina un archivo del directorio temporal
     * @param filename - Nombre del archivo a eliminar
     * @returns boolean - true si se eliminó correctamente
     */
    deleteFileFromTemp(filename: string): boolean {
        const tempPath = join(this.getTempPath(), filename);

        if (existsSync(tempPath)) {
            unlinkSync(tempPath);
            return true;
        }
        return false;
    }

    /**
     * Elimina un archivo del directorio final
     * @param filePath - Ruta completa del archivo a eliminar
     * @returns boolean - true si se eliminó correctamente
     */
    deleteFileFromFinal(filePath: string): boolean {
        if (existsSync(filePath)) {
            unlinkSync(filePath);
            return true;
        }
        return false;
    }
}
