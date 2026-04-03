import { MultipleFieldsUploadDto } from '../dtos/file-upload.dtos';

export interface ISingleFileResult {
    id: string;
    name: string;
    description?: string;
    originalName: string;
    finalPath: string;
    size: number;
    uploadedAt: Date;
}

export interface IMultipleFilesResult {
    id: string;
    title: string;
    category?: string;
    files: {
        originalName: string;
        finalPath: string;
        size: number;
    }[];
    totalFiles: number;
    uploadedAt: Date;
}

// Interfaces para campos específicos
export type IFieldSpecificFiles = Pick<
    MultipleFieldsUploadDto,
    'imagenes' | 'documentos'
>;

export interface IFieldSpecificFileResult {
    originalName: string;
    finalPath: string;
    size: number;
}

export interface IFieldSpecificResult {
    id: string;
    title: string;
    description?: string;
    imagenes?: IFieldSpecificFileResult[];
    documentos?: IFieldSpecificFileResult[];
    uploadedAt: Date;
}

export interface IUserProfileResult {
    id: string;
    userId: string;
    name: string;
    description?: string;
    fotos?: IFieldSpecificFileResult[];
    documentos?: IFieldSpecificFileResult[];
    uploadedAt: Date;
}
