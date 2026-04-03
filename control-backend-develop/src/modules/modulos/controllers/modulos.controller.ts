import { Controller, Get } from '@nestjs/common';
import { ModulosService } from '../services/modulos.service';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('modulos')
export class ModulosController {
    constructor(private readonly modulosService: ModulosService) {}

    @ApiOperation({ summary: 'Obtener todos los módulos' })
    @Get()
    async findAll() {
        const data = await this.modulosService.findAll();
        return CustomResponse.buildResponse({
            message: 'Listado de módulos obtenido exitosamente',
            data,
        });
    }
}
