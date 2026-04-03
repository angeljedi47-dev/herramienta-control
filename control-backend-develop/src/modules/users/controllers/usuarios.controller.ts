import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
    Patch,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';
import { RequireOperations } from 'src/modules/auth/decorators/require-operations.decorator';
import { OPERACIONES_ACCESO } from 'src/modules/auth/const/variables_acceso';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from 'src/modules/users/const/users.const';
import { AuthenticatedUser } from 'src/modules/auth/decorators/authenticated-user.decorator';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @Get()
    @ApiPaginationQuery(USER_PAGINATION_CONFIG)
    async findAll(@Paginate() query: PaginateQuery) {
        return CustomResponse.buildResponse({
            message: 'Usuarios obtenidos correctamente',
            data: await this.usuariosService.findAll(query),
        });
    }

    @ApiOperation({ summary: 'Crear un usuario' })
    @Post()
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.AGREGAR_USUARIO] })
    async create(
        @Body() createUsuarioDto: CreateUsuarioDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        return CustomResponse.buildResponse({
            message: 'Usuario creado correctamente',
            data: await this.usuariosService.create(
                createUsuarioDto,
                userAuthenticated,
            ),
        });
    }

    @ApiOperation({ summary: 'Actualizar un usuario' })
    @Put()
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.EDITAR_USUARIO] })
    async update(
        @Body() updateUsuarioDto: UpdateUsuarioDto,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        return CustomResponse.buildResponse({
            message: 'Usuario actualizado correctamente',
            data: await this.usuariosService.update(
                updateUsuarioDto,
                userAuthenticated,
            ),
        });
    }

    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
    @Delete(':id')
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.ELIMINAR_USUARIO] })
    async delete(
        @Param('id') id: number,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        return CustomResponse.buildResponse({
            message: 'Usuario eliminado correctamente',
            data: await this.usuariosService.delete(id, userAuthenticated),
        });
    }

    @ApiOperation({ summary: 'Restaurar un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario a restaurar' })
    @Patch('restore/:id')
    @RequireOperations({ anyOf: [OPERACIONES_ACCESO.RESTAURAR_USUARIO] })
    async restore(
        @Param('id') id: number,
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        return CustomResponse.buildResponse({
            message: 'Usuario restaurado correctamente',
            data: await this.usuariosService.restore(id, userAuthenticated),
        });
    }
}
