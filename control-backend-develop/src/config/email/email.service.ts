import { Injectable } from '@nestjs/common';
import { EnvsService } from '../env/services/envs.service';
import { LoggerService } from '../logger/logger.service';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import { join } from 'path';
import { readFileSync } from 'fs';
import { IEmailOptions, TemplateMap } from 'src/config/email/email.interface';
import { NODE_ENVIROMENTS } from '../env/interfaces/envs.interface';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly context = 'EmailService';

    constructor(
        private readonly envsService: EnvsService,
        private readonly loggerService: LoggerService,
    ) {
        this.initializeTransporter();
    }

    private initializeTransporter(): void {
        const emailConfig = this.envsService.getGroup('EMAIL');

        this.transporter = createTransport({
            host: emailConfig.HOST,
            port: emailConfig.PORT,
            secure: emailConfig.PORT === 465, // true for 465, false for other ports
            auth: {
                user: emailConfig.USER,
                pass: emailConfig.PASS,
            },
        });

        this.loggerService.info(
            this.context,
            `Servicio de correo electrónico inicializado correctamente con host: ${emailConfig.HOST}`,
        );
    }

    private getEnvironmentPrefix(): string {
        const nodeEnv = this.envsService.getGroup('SERVER').ENVIRONMENT;

        switch (nodeEnv) {
            case NODE_ENVIROMENTS.DEVELOPMENT:
                return '[DESARROLLO] ';
            case NODE_ENVIROMENTS.STAGE:
                return '[PRUEBAS] ';
            case NODE_ENVIROMENTS.PRODUCTION:
            default:
                return '';
        }
    }

    async sendEmail<T extends keyof TemplateMap>(
        options: IEmailOptions<T>,
    ): Promise<nodemailer.SentMessageInfo> {
        try {
            await this.verifyConnection();
            const emailConfig = this.envsService.getGroup('EMAIL');
            const templatePath = join(
                process.cwd(),
                'public',
                'statics',
                'templates_email',
                `${options.template}.html`,
            );

            const templateSource = readFileSync(templatePath, 'utf-8');
            const template = handlebars.compile(templateSource);
            const html = template(options.context);

            // Añadir prefijo de entorno al asunto
            const envPrefix = this.getEnvironmentPrefix();
            const subject = envPrefix + options.subject;
            const nodeEnv = this.envsService.getGroup('SERVER').ENVIRONMENT;
            const to =
                nodeEnv !== NODE_ENVIROMENTS.DEVELOPMENT
                    ? options.to
                    : emailConfig.USER;

            const mailOptions = {
                from: emailConfig.USER,
                to,
                cc: options.cc,
                bcc: options.bcc,
                subject,
                html,
                attachments: options.attachments,
            };

            const result = await this.transporter.sendMail(mailOptions);

            this.loggerService.info(
                this.context,
                `Correo electrónico enviado correctamente a: ${to}`,
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            this.loggerService.info(
                this.context,
                'Servicio de correo electrónico verificado correctamente',
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}
