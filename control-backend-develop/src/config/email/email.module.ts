import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EnvsModule } from '../env/envs.module';
import { DateTimeModule } from '../date-time/date-time.module';
import { EmailExamplesService } from './examples/services/email-examples.service';
import { EmailExamplesController } from './examples/controllers/email-examples.controller';

@Global()
@Module({
    imports: [EnvsModule, DateTimeModule],
    providers: [EmailService, EmailExamplesService],
    controllers: [EmailExamplesController],
    exports: [EmailService],
})
export class EmailModule {}
