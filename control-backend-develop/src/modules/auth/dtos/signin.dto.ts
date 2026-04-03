import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        description: 'El nombre de usuario es requerido',
        example: 'admin',
    })
    @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    nombre_usuario: string;

    @ApiProperty({
        description: 'La contraseña es requerida',
        example: '123456',
    })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    password: string;
}
