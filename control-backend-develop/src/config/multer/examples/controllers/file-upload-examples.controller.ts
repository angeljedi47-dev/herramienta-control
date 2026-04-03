import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import {
    FileInterceptor,
    FilesInterceptor,
    FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { FileUploadExamplesService } from '../services/file-upload-examples.service';
import { FileTypeValidationPipe } from '../../pipes/file-type.validation.pipe';
import { FileSizeValidationPipe } from '../../pipes/max-file-size.pipe';
import { MaxFilesValidationPipe } from '../../pipes/max-files.validation.pipe';
import { FieldSpecificFileTypeValidationPipe } from '../../pipes/field-specific-file-type.validation.pipe';
import { FieldSpecificFileSizeValidationPipe } from '../../pipes/field-specific-file-size.validation.pipe';
import { FieldSpecificMaxFilesValidationPipe } from '../../pipes/field-specific-max-files.validation.pipe';
import { FileMovePipe, IMovedFileInfo } from '../../pipes/file-move.pipe';
import { IReqCustom } from 'src/shared/interfaces/request.interface';
import {
    SingleFileUploadDto,
    MultipleFilesUploadDto,
    MultipleFieldsUploadDto,
    UserProfileUploadDto,
} from '../dtos/file-upload.dtos';
import {
    ISingleFileResult,
    IMultipleFilesResult,
    IFieldSpecificResult,
    IUserProfileResult,
} from '../interfaces/file-upload.interfaces';

@ApiTags('File Upload - Ejemplos')
@Controller('file-upload/examples')
export class FileUploadExamplesController {
    constructor(
        private readonly fileUploadExamplesService: FileUploadExamplesService,
    ) {}

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Subir un solo archivo (EJEMPLO)',
        description:
            'Ejemplo de cómo subir un archivo único con validaciones de tipo y tamaño',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: SingleFileUploadDto })
    @ApiResponse({
        status: 200,
        description: 'Archivo subido correctamente.',
    })
    @Post('single-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingleFile(
        @Body() dto: SingleFileUploadDto,
        @UploadedFile(
            new FileTypeValidationPipe([
                '.pdf',
                '.doc',
                '.docx',
                '.jpg',
                '.png',
            ]),
            new FileSizeValidationPipe(5), // 5MB máximo
            new FileMovePipe('files_test'), // ← Mueve automáticamente
        )
        finalPath: IMovedFileInfo, // ← Ahora recibe toda la información del archivo
        @Req() req: IReqCustom,
    ): Promise<{ message: string; data: ISingleFileResult }> {
        const result = await this.fileUploadExamplesService.processSingleFile(
            dto,
            finalPath,
            req,
        );
        return {
            message: 'Archivo subido correctamente',
            data: result,
        };
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Subir múltiples archivos (EJEMPLO)',
        description:
            'Ejemplo de cómo subir múltiples archivos con validaciones de tipo, tamaño y cantidad',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: MultipleFilesUploadDto })
    @ApiResponse({
        status: 200,
        description: 'Archivos subidos correctamente.',
    })
    @Post('multiple-files')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMultipleFiles(
        @Body() dto: MultipleFilesUploadDto,
        @UploadedFiles(
            new FileTypeValidationPipe([
                '.pdf',
                '.doc',
                '.docx',
                '.jpg',
                '.png',
            ]),
            new FileSizeValidationPipe(2), // 2MB máximo por archivo
            new MaxFilesValidationPipe(5), // Máximo 5 archivos
            new FileMovePipe('files_test'), // ← Mueve automáticamente
        )
        finalPaths: IMovedFileInfo[], // ← Ahora recibe array con toda la información de archivos
        @Req() req: IReqCustom,
    ): Promise<{ message: string; data: IMultipleFilesResult }> {
        const result =
            await this.fileUploadExamplesService.processMultipleFiles(
                dto,
                finalPaths,
                req,
            );
        return {
            message: 'Archivos subidos correctamente',
            data: result,
        };
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Subir archivos con validación específica por campo (EJEMPLO)',
        description:
            'Ejemplo de cómo subir archivos con diferentes validaciones por campo usando FileFieldsInterceptor y pipes personalizados',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: MultipleFieldsUploadDto })
    @ApiResponse({
        status: 200,
        description:
            'Archivos subidos correctamente con validación específica por campo.',
    })
    @Post('field-specific-validation')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'imagenes' }, // Sin maxCount, se valida con pipe
            { name: 'documentos' }, // Sin maxCount, se valida con pipe
        ]),
    )
    async uploadWithFieldSpecificValidation(
        @Body() dto: MultipleFieldsUploadDto,
        @UploadedFiles(
            // Validación de tipos específica por campo
            new FieldSpecificFileTypeValidationPipe({
                imagenes: ['.jpg', '.jpeg', '.png'], // Solo imágenes para 'imagenes'
                documentos: ['.pdf'], // Solo pdf para 'documentos'
            }),
            // Validación de tamaño específica por campo
            new FieldSpecificFileSizeValidationPipe({
                imagenes: 2, // 2MB máximo para imágenes
                documentos: 2, // 2MB máximo para documentos
            }),
            // Validación de cantidad de archivos específica por campo
            new FieldSpecificMaxFilesValidationPipe({
                imagenes: 3, // Máximo 3 imágenes
                documentos: 2, // Máximo 2 documentos
            }),
            // Movimiento automático con configuración por campo
            new FileMovePipe({
                imagenes: 'files_test/imagenes',
                documentos: 'files_test/documentos',
            }),
        )
        finalPaths: {
            // ← Información completa de archivos organizada por campo
            imagenes?: IMovedFileInfo[];
            documentos?: IMovedFileInfo[];
        },
        @Req() req: IReqCustom,
    ): Promise<{ message: string; data: IFieldSpecificResult }> {
        const result =
            await this.fileUploadExamplesService.processFieldSpecificFiles(
                dto,
                finalPaths,
                req,
            );
        return {
            message:
                'Archivos subidos correctamente con validación específica por campo',
            data: result,
        };
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Subir archivos de usuario con organización por carpetas (EJEMPLO)',
        description:
            'Ejemplo de cómo subir fotos y documentos de un usuario y organizarlos en carpetas específicas (usuarios/{userId}/fotos/ y usuarios/{userId}/documentos/)',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UserProfileUploadDto })
    @ApiResponse({
        status: 200,
        description: 'Archivos del usuario subidos correctamente.',
    })
    @Post('user-files')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'fotos' }, // Sin maxCount, se valida con pipe
            { name: 'documentos' }, // Sin maxCount, se valida con pipe
        ]),
    )
    async uploadUserFiles(
        @Body() dto: UserProfileUploadDto,
        @UploadedFiles(
            // Validación de tipos específica por campo
            new FieldSpecificFileTypeValidationPipe({
                fotos: ['.jpg', '.jpeg', '.png'], // Solo imágenes para 'fotos'
                documentos: ['.pdf', '.doc', '.docx'], // Solo documentos para 'documentos'
            }),
            // Validación de tamaño específica por campo
            new FieldSpecificFileSizeValidationPipe({
                fotos: 5, // 5MB máximo TOTAL para todas las fotos
                documentos: 10, // 10MB máximo TOTAL para todos los documentos
            }),
            // Validación de cantidad de archivos específica por campo
            new FieldSpecificMaxFilesValidationPipe({
                fotos: 3, // Máximo 3 fotos
                documentos: 2, // Máximo 2 documentos
            }),
        )
        files: {
            // ← Archivos originales de Multer (sin FileMovePipe)
            fotos?: Express.Multer.File[];
            documentos?: Express.Multer.File[];
        },
        @Req() req: IReqCustom,
    ): Promise<{ message: string; data: IUserProfileResult }> {
        const result = await this.fileUploadExamplesService.processUserFiles(
            dto,
            files,
            req,
        );
        return {
            message: 'Archivos del usuario subidos correctamente',
            data: result,
        };
    }
}
