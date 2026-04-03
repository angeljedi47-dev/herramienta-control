import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf,
} from 'class-validator';

export class UpdateUsuarioDto {
    @ApiProperty({ description: 'ID del usuario del sistema', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id_usuario_sistema: number;

    @ApiProperty({
        description: 'Nombre de usuario del sistema',
        example: 'super_admin',
    })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @Transform(({ value }) => value.trim())
    nombre_usuario: string;

    @ApiProperty({
        description: 'Contraseña del usuario del sistema',
        example: '12345678',
        minLength: 8,
        required: false,
    })
    @ValidateIf((o) => !o.id_usuario_sistema)
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Transform(({ value }) => value && value.trim())
    @IsOptional()
    password?: string;

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
