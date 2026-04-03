import { Controller, Post, Body } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiProperty,
} from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { EmailExamplesService } from '../services/email-examples.service';

class SendTestEmailDto {
    @ApiProperty({
        description: 'Correo electrónico del destinatario',
        example: 'usuario@ejemplo.com',
        type: 'string',
    })
    @IsEmail()
    to: string;
}

@ApiTags('Email - Ejemplos')
@Controller('email/examples')
export class EmailExamplesController {
    constructor(private readonly emailExamplesService: EmailExamplesService) {}

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Enviar correo de prueba (EJEMPLO)',
    })
    @ApiResponse({
        status: 200,
        description: 'Correo de prueba enviado correctamente.',
    })
    @Post('send-test-email')
    async sendTestEmail(@Body() sendTestEmailDto: SendTestEmailDto) {
        await this.emailExamplesService.sendTestEmail(sendTestEmailDto.to);
        return {
            message: 'Correo de prueba enviado correctamente',
            data: null,
        };
    }
}
