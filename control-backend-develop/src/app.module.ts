import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvsModule } from './config/env/envs.module';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './config/logger/logger.module';
import { DateTimeModule } from './config/date-time/date-time.module';
import { EmailModule } from './config/email/email.module';
import { MulterModuleApp } from './config/multer/multer.module';
import { UserModule } from './modules/users/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { ModulosModule } from './modules/modulos/modulos.module';
import { JwtAppModule } from './config/jtw/jwt-app.module';
import { ReportsModule } from './config/reports/reports.module';
import { ProyectosModule } from './modules/proyectos/proyectos.module';

@Module({
    imports: [
        RolesModule,
        UserModule,
        ProyectosModule,
        EnvsModule,
        ModulosModule,
        DatabaseModule,
        AuthModule,
        LoggerModule,
        DateTimeModule,
        EmailModule,
        JwtAppModule,
        MulterModuleApp.register(),
        ReportsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
