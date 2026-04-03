import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EstadosProyectoService } from '../services/estados-proyecto.service';
import { CreateEstadoProyectoDto } from '../dtos/create-estado-proyecto.dto';
import { UpdateEstadoProyectoDto } from '../dtos/update-estado-proyecto.dto';
import { AuthenticatedUser } from 'src/modules/auth/decorators/authenticated-user.decorator';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Estados Proyecto')
@Controller('estados-proyecto')
export class EstadosProyectoController {
    constructor(private readonly estadosProyectoService: EstadosProyectoService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener lista de estados activos' })
    async findAll() {
        const data = await this.estadosProyectoService.findAll();
        return CustomResponse.buildResponse({
            message: 'Lista de estados de proyecto obtenida exitosamente',
            data,
        });
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo estado de proyecto' })
    async create(@Body() createDto: CreateEstadoProyectoDto, @AuthenticatedUser() user: IUserAuthenticated) {
        const data = await this.estadosProyectoService.create(createDto, user);
        return CustomResponse.buildResponse({
            message: 'Estado de proyecto creado correctamente',
            data,
        });
    }

    @Put()
    @ApiOperation({ summary: 'Actualizar un estado de proyecto' })
    async update(@Body() updateDto: UpdateEstadoProyectoDto, @AuthenticatedUser() user: IUserAuthenticated) {
        const data = await this.estadosProyectoService.update(updateDto.id_estado_proyecto, updateDto, user);
        return CustomResponse.buildResponse({
            message: 'Estado de proyecto actualizado correctamente',
            data,
        });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar de forma lógica un estado de proyecto' })
    async delete(@Param('id', ParseIntPipe) id: number, @AuthenticatedUser() user: IUserAuthenticated) {
        await this.estadosProyectoService.delete(id, user);
        return CustomResponse.buildResponse({
            message: 'Estado de proyecto eliminado correctamente',
            data: true,
        });
    }
}
