import { Injectable } from '@nestjs/common';
import { EmailService } from '../../email.service';
import { EnvsService } from '../../../env/services/envs.service';
import { DateTimeService } from '../../../date-time/date-time.service';

@Injectable()
export class EmailExamplesService {
    constructor(
        private readonly emailService: EmailService,
        private readonly configService: EnvsService,
        private readonly dateTimeService: DateTimeService,
    ) {}

    async sendTestEmail(to: string): Promise<void> {
        const serverEnvs = this.configService.getGroup('SERVER');
        const currentDate = this.dateTimeService.getCurrentDate();

        await this.emailService.sendEmail({
            to,
            subject: 'Correo de prueba',
            template: 'test-email',
            context: {
                nombre_sistema: serverEnvs.SERVICE_NAME,
                fecha_hora: currentDate.toLocaleString(),
            },
        });
    }
}
