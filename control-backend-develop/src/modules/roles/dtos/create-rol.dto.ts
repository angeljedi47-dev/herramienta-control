import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateRolDto {
    @ApiProperty({
        description: 'Nombre del rol',
        example: 'super_admin',
        maxLength: 300,
    })
    @IsNotEmpty({ message: 'El nombre del rol es requerido' })
    @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
    @MaxLength(300, {
        message: 'El nombre del rol no debe exceder los 300 caracteres',
    })
    @Transform(({ value }: { value: string }) => value.trim().toUpperCase())
    nombre_rol: string;

    @ApiProperty({
        description: 'Los permisos son requeridos',
        example: [1, 2],
        minItems: 1,
        type: [Number],
    })
    @IsNotEmpty({ message: 'Los permisos son requeridos' })
    @IsArray({ message: 'Los permisos deben ser un arreglo' })
    @ArrayMinSize(1, { message: 'Debe asignar al menos una operación' })
    @IsNumber({}, { each: true, message: 'Cada permiso debe ser un número' })
    operaciones: number[];
}
