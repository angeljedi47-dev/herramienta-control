import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TipoProyecto, EstadoProyecto } from '../entities/proyectos.entity';

export class CreateProyectoDto {
    @ApiProperty({ description: 'Nombre del proyecto', maxLength: 300 })
    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    nombre: string;

    @ApiPropertyOptional({ description: 'Descripción remota del proyecto' })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty({ description: 'Tipo de proyecto', enum: TipoProyecto })
    @IsNotEmpty()
    @IsEnum(TipoProyecto)
    tipo: TipoProyecto;

    @ApiProperty({ description: 'Estado actual del proyecto', enum: EstadoProyecto })
    @IsNotEmpty()
    @IsEnum(EstadoProyecto)
    estado: EstadoProyecto;

    @ApiPropertyOptional({ description: 'Fecha de inicio del proyecto', type: String, format: 'date' })
    @IsOptional()
    @IsDateString()
    fecha_inicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de finalización estimada del proyecto', type: String, format: 'date' })
    @IsOptional()
    @IsDateString()
    fecha_fin_estimada?: string;
}
