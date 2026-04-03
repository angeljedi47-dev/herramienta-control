import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomResponse } from './shared/interceptors/response.interceptor';
import { IsDateString, IsNumber } from 'class-validator';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';

class SetDateDto {
    @ApiProperty({
        description: 'Fecha en formato ISO 8601',
        example: new Date().toISOString(),
        type: 'string',
    })
    @IsDateString()
    date: string;
}

class SetYearDto {
    @ApiProperty({
        description: 'Año a simular',
        example: 2025,
        type: 'number',
    })
    @IsNumber()
    year: number;
}

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    getHello() {
        return CustomResponse.buildResponse({
            data: {
                env: this.appService.getHello(),
            },
            message: 'Servidor funcionando correctamente',
        });
    }

    @ApiBearerAuth()
    @Get('server-date')
    getServerDate() {
        return CustomResponse.buildResponse({
            data: {
                date: this.appService.getCurrentDate(),
                year: this.appService.getCurrentYear(),
            },
            message: 'Fecha y año del servidor obtenidos correctamente',
        });
    }

    @ApiBearerAuth()
    @Post('set-server-date')
    setServerDate(@Body() setDateDto: SetDateDto) {
        const date = new Date(setDateDto.date);
        this.appService.setSimulatedDate(date);
        return CustomResponse.buildResponse({
            data: {
                date: this.appService.getCurrentDate(),
            },
            message: 'Fecha del servidor configurada correctamente',
        });
    }

    @ApiBearerAuth()
    @Post('set-server-year')
    setServerYear(@Body() setYearDto: SetYearDto) {
        this.appService.setSimulatedYear(setYearDto.year);
        return CustomResponse.buildResponse({
            data: {
                year: this.appService.getCurrentYear(),
            },
            message: 'Año del servidor configurado correctamente',
        });
    }

    @ApiBearerAuth()
    @Post('reset-server-date')
    resetServerDate() {
        this.appService.resetSimulatedDate();
        return CustomResponse.buildResponse({
            data: {
                date: this.appService.getCurrentDate(),
            },
            message: 'Fecha del servidor restablecida correctamente',
        });
    }
}
