import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
    @ApiProperty({
        description: 'El nombre de usuario del usuario',
        example: 'super_admin',
    })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @Transform(({ value }) => value.trim())
    nombre_usuario: string;

    @ApiProperty({
        description: 'La contraseña del usuario',
        example: '12345678',
        minLength: 8,
    })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;

    @ApiProperty({
        description:
            'Los roles del usuario son requeridos y por lo menos debe tener un rol, en caso de que no se manden, si en base de datos estan asignados se desasignaran',
        example: [1, 2],
        minItems: 1,
        type: [Number],
    })
    @IsNotEmpty({ message: 'Los roles son requeridos' })
    @IsArray({ message: 'Los roles deben ser un arreglo' })
    @IsNumber({}, { each: true, message: 'Cada rol debe ser un número' })
    roles: number[];
}
