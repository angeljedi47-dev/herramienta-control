import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SingleFileUploadDto {
    @ApiProperty({
        description: 'Nombre del recurso',
        example: 'Mi documento',
        type: 'string',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Descripción del recurso',
        example: 'Documento importante',
        type: 'string',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
    })
    @IsOptional()
    @IsString()
    file?: Express.Multer.File;
}

export class MultipleFilesUploadDto {
    @ApiProperty({
        description: 'Título del conjunto de archivos',
        example: 'Documentos del proyecto',
        type: 'string',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Categoría de los archivos',
        example: 'documentos',
        type: 'string',
        required: false,
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        isArray: true,
    })
    @IsOptional()
    @IsString()
    files?: Express.Multer.File[];
}

export class MultipleFieldsUploadDto {
    @ApiProperty({
        description: 'Título del recurso',
        example: 'Perfil de usuario',
        type: 'string',
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Descripción del recurso',
        example: 'Información del perfil',
        type: 'string',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Imágenes de perfil (máximo 3 archivos)',
        isArray: true,
        maxItems: 3,
    })
    @IsOptional()
    @IsString()
    imagenes?: Express.Multer.File[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Documentos (máximo 1 archivo)',
        isArray: true,
        maxItems: 1,
    })
    @IsOptional()
    @IsString()
    documentos?: Express.Multer.File[];
}

export class UserProfileUploadDto {
    @ApiProperty({
        description: 'ID del usuario (será usado como nombre de carpeta)',
        example: 'user_12345',
        type: 'string',
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
        type: 'string',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Descripción del perfil',
        example: 'Información del perfil del usuario',
        type: 'string',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description:
            'Fotos del usuario (serán movidas a usuarios/{userId}/fotos/)',
        isArray: true,
    })
    @IsOptional()
    @IsString()
    fotos?: Express.Multer.File[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description:
            'Documentos del usuario (serán movidos a usuarios/{userId}/documentos/)',
        isArray: true,
    })
    @IsOptional()
    @IsString()
    documentos?: Express.Multer.File[];
}
