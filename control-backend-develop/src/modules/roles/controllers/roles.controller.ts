import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { RolesService } from 'src/modules/roles/services/roles.service';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { CreateRolDto } from '../dtos/create-rol.dto';
import { UpdateRolDto } from '../dtos/update-rol.dto';
import { OPERACIONES_ACCESO } from 'src/modules/auth/const/variables_acceso';
import { RequireOperations } from 'src/modules/auth/decorators/require-operations.decorator';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginationQuery, PaginateQuery } from 'nestjs-paginate';
import { Paginate } from 'nestjs-paginate';
import { ROLE_PAGINATION_CONFIG } from 'src/modules/roles/const/roles.const';
import { AuthenticatedUser } from 'src/modules/auth/decorators/authenticated-user.decorator';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

@ApiBearerAuth()
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Get()
    @ApiPaginationQuery(ROLE_PAGINATION_CONFIG)
    async findAll(@Paginate() query: PaginateQuery) {
        const roles = await this.rolesService.findAll(query);

        return CustomResponse.buildResponse({
            message: 'Roles obtenidos correctamente',
            data: roles,
        });
    }

    @Get('catalogo')
    @ApiOperation({
        summary: 'Obtener roles por término de búsqueda',
        description: 'Retorna roles que coincidan con el término de búsqueda',
    })
    @ApiQuery({ name: 'term', description: 'Término para buscar roles' })
    async findByTerm(@Query('term') term: string) {
        const roles = await this.rolesService.findByTerm(term);

        return CustomResponse.buildResponse({
            message: 'Roles encontrados correctamente',
            data: roles,
        });
    }

    @ApiOperation({
        summary: 'Crear un rol',
        responses: {
            200: { description: 'Rol creado correctamente' },
        },
    })
    @Post()
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.AGREGAR_ROL] })
    async create(
        @Body() createRolDto: CreateRolDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        const rolCreado = await this.rolesService.create(
            createRolDto,
            userAuthenticated,
        );

        return CustomResponse.buildResponse({
            message: 'Rol creado correctamente',
            data: rolCreado,
        });
    }

    @ApiOperation({
        summary: 'Actualizar un rol',
        responses: {
            200: { description: 'Rol actualizado correctamente' },
        },
    })
    @Put()
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.EDITAR_ROL] })
    async update(
        @Body() updateRolDto: UpdateRolDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        const rolActualizado = await this.rolesService.update(
            updateRolDto.id_rol,
            updateRolDto,
            userAuthenticated,
        );

        return CustomResponse.buildResponse({
            message: 'Rol actualizado correctamente',
            data: rolActualizado,
        });
    }

    @ApiOperation({
        summary: 'Eliminar un rol',
        responses: {
            200: { description: 'Rol eliminado correctamente' },
        },
    })
    @ApiParam({ name: 'id', description: 'ID del rol a eliminar' })
    @Delete(':id')
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.ELIMINAR_ROL] })
    async delete(
        @Param('id') id: number,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        await this.rolesService.delete(id, userAuthenticated);

        return CustomResponse.buildResponse({
            message: 'Rol eliminado correctamente',
            data: true,
        });
    }
}
