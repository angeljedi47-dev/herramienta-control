import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { TipoProyecto, EstadoProyecto } from '../entities/proyectos.entity';

export class UpdateProyectoDto {
    @ApiProperty({ description: 'ID del proyecto', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id_proyecto: number;

    @ApiPropertyOptional({ description: 'Nombre del proyecto', maxLength: 300 })
    @IsOptional()
    @IsString()
    @MaxLength(300)
    nombre?: string;

    @ApiPropertyOptional({ description: 'Descripción remota del proyecto' })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiPropertyOptional({ description: 'Tipo de proyecto', enum: TipoProyecto })
    @IsOptional()
    @IsEnum(TipoProyecto)
    tipo?: TipoProyecto;

    @ApiPropertyOptional({ description: 'Estado actual del proyecto', enum: EstadoProyecto })
    @IsOptional()
    @IsEnum(EstadoProyecto)
    estado?: EstadoProyecto;

    @ApiPropertyOptional({ description: 'Fecha de inicio del proyecto', type: String, format: 'date' })
    @IsOptional()
    @IsDateString()
    fecha_inicio?: string;

    @ApiPropertyOptional({ description: 'Fecha de finalización estimada del proyecto', type: String, format: 'date' })
    @IsOptional()
    @IsDateString()
    fecha_fin_estimada?: string;

    @ApiPropertyOptional({ description: 'Porcentaje de avance del proyecto', type: Number, example: 50 })
    @IsOptional()
    porcentaje?: number;

    @ApiPropertyOptional({ description: 'ID del Tipo de Informe asociado' })
    @IsOptional()
    id_tipo_informe?: number;
}
