import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateTipoInformeDto {
    @ApiProperty({ description: 'ID del tipo informe', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id_tipo_informe: number;

    @ApiPropertyOptional({ description: 'Nombre del tipo de informe', maxLength: 150 })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    nombre?: string;

    @ApiPropertyOptional({ description: 'Slug único para la URL', maxLength: 200 })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'El slug debe contener solo minúsculas, números y guiones' })
    slug?: string;
}
