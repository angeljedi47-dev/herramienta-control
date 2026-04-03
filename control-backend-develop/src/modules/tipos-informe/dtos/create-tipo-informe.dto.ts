import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateTipoInformeDto {
    @ApiProperty({ description: 'Nombre del tipo de informe', maxLength: 150 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nombre: string;

    @ApiProperty({ description: 'Slug único para la URL', maxLength: 200 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'El slug debe contener solo minúsculas, números y guiones' })
    slug: string;
}
