import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TiposInformeService } from '../services/tipos-informe.service';
import { CreateTipoInformeDto } from '../dtos/create-tipo-informe.dto';
import { UpdateTipoInformeDto } from '../dtos/update-tipo-informe.dto';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { AuthenticatedUser } from 'src/modules/auth/decorators/authenticated-user.decorator';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('Tipos Informe')
@Controller('tipos-informe')
export class TiposInformeController {
    constructor(private readonly tiposInformeService: TiposInformeService) {}

    @Public()
    @Get('public/status/:slug')
    @ApiOperation({ summary: 'Obtener información pública del tipo de informe por slug' })
    async getPublicStatus(@Param('slug') slug: string) {
        const data = await this.tiposInformeService.findPublicStatus(slug);
        return CustomResponse.buildResponse({
            message: 'Información del tipo de informe obtenida exitosamente',
            data,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Obtener lista de tipos de informe activos' })
    async findAll() {
        const data = await this.tiposInformeService.findAll();
        return CustomResponse.buildResponse({
            message: 'Lista de tipos de informe obtenida exitosamente',
            data,
        });
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo tipo de informe' })
    async create(@Body() createDto: CreateTipoInformeDto, @AuthenticatedUser() user: IUserAuthenticated) {
        const data = await this.tiposInformeService.create(createDto, user);
        return CustomResponse.buildResponse({
            message: 'Tipo de informe creado correctamente',
            data,
        });
    }

    @Put()
    @ApiOperation({ summary: 'Actualizar un tipo de informe' })
    async update(@Body() updateDto: UpdateTipoInformeDto, @AuthenticatedUser() user: IUserAuthenticated) {
        const data = await this.tiposInformeService.update(updateDto.id_tipo_informe, updateDto, user);
        return CustomResponse.buildResponse({
            message: 'Tipo de informe actualizado correctamente',
            data,
        });
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar de forma lógica un tipo de informe' })
    async delete(@Param('id', ParseIntPipe) id: number, @AuthenticatedUser() user: IUserAuthenticated) {
        await this.tiposInformeService.delete(id, user);
        return CustomResponse.buildResponse({
            message: 'Tipo de informe eliminado correctamente',
            data: true,
        });
    }
}
