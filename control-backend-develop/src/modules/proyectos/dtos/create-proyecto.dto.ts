import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { TipoProyecto } from '../entities/proyectos.entity';

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

    @ApiProperty({ description: 'ID del Estado del Proyecto' })
    @IsNumber({}, { message: 'El ID de estado debe ser un número' })
    @IsNotEmpty({ message: 'El ID de estado es obligatorio' })
    id_estado_proyecto: number;

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
