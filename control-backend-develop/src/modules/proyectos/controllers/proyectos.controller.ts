import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { AuthenticatedUser } from 'src/modules/auth/decorators/authenticated-user.decorator';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { Public } from 'src/modules/auth/decorators/public.decorator';

import { ProyectosService } from '../services/proyectos.service';
import { CreateProyectoDto } from '../dtos/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/update-proyecto.dto';
import { PROYECTOS_PAGINATION_CONFIG } from '../const/proyectos.const';

@ApiBearerAuth()
@Controller('proyectos')
export class ProyectosController {
    constructor(private proyectosService: ProyectosService) {}

    @Get()
    @ApiPaginationQuery(PROYECTOS_PAGINATION_CONFIG)
    async findAll(@Paginate() query: PaginateQuery) {
        const proyectos = await this.proyectosService.findAll(query);

        return CustomResponse.buildResponse({
            message: 'Proyectos obtenidos correctamente',
            data: proyectos,
        });
    }

    @Public()
    @Get('public/status')
    @ApiOperation({
        summary: 'Obtener estado de los proyectos públicamente',
        description: 'Retorna un resumen del estado de los proyectos activos',
    })
    async getPublicStatus() {
        const proyectosStatus = await this.proyectosService.findPublicStatus();

        return CustomResponse.buildResponse({
            message: 'Estado de proyectos obtenido correctamente',
            data: proyectosStatus,
        });
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'ID del proyecto' })
    async findOne(@Param('id') id: number) {
        const proyecto = await this.proyectosService.findOne(id);

        return CustomResponse.buildResponse({
            message: 'Proyecto obtenido correctamente',
            data: proyecto,
        });
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo proyecto' })
    async create(
        @Body() createProyectoDto: CreateProyectoDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        const proyectoCreado = await this.proyectosService.create(
            createProyectoDto,
            userAuthenticated,
        );

        return CustomResponse.buildResponse({
            message: 'Proyecto creado correctamente',
            data: proyectoCreado,
        });
    }

    @Put()
    @ApiOperation({ summary: 'Actualizar un proyecto existente' })
    async update(
        @Body() updateProyectoDto: UpdateProyectoDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        const proyectoActualizado = await this.proyectosService.update(
            updateProyectoDto.id_proyecto,
            updateProyectoDto,
            userAuthenticated,
        );

        return CustomResponse.buildResponse({
            message: 'Proyecto actualizado correctamente',
            data: proyectoActualizado,
        });
    }

    @Delete(':id')
    @ApiParam({ name: 'id', description: 'ID del proyecto a eliminar' })
    async delete(
        @Param('id') id: number,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        await this.proyectosService.delete(id, userAuthenticated);

        return CustomResponse.buildResponse({
            message: 'Proyecto eliminado correctamente',
            data: true,
        });
    }
}
