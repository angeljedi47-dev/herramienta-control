import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstadoProyectoDto {
    @ApiProperty({ description: 'Nombre del estado' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @ApiPropertyOptional({ description: 'Color en formato HEX' })
    @IsString()
    @IsOptional()
    color_hex?: string;

    @ApiPropertyOptional({ description: 'Indica si este estado representa el final de un ciclo' })
    @IsBoolean()
    @IsOptional()
    es_final?: boolean;
}
