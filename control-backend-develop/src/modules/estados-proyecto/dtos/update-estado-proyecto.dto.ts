import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateEstadoProyectoDto } from './create-estado-proyecto.dto';

export class UpdateEstadoProyectoDto extends PartialType(CreateEstadoProyectoDto) {
    @ApiPropertyOptional({ description: 'ID del Estado' })
    @IsNumber()
    @IsOptional()
    id_estado_proyecto?: number;
}
