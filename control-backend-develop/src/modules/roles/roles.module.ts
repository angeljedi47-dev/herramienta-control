import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './entities/roles.entity';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { RolesOperacionesService } from './services/roles-operaciones.service';
import { RolesOperacionesEntity } from './entities/roles-operaciones.entity';
import { ModulosModule } from '../modulos/modulos.module';
import { RolesOperacionesValidationService } from './services/roles-operaciones-validation.service';
import { RolesValidationService } from './services/roles-validation.service';
import { DateTimeModule } from 'src/config/date-time/date-time.module';

@Module({
    imports: [
        ModulosModule,
        TypeOrmModule.forFeature([RolesEntity, RolesOperacionesEntity]),
        DateTimeModule,
    ],
    providers: [
        RolesService,
        RolesOperacionesService,
        RolesOperacionesValidationService,
        RolesValidationService,
    ],
    exports: [RolesService, RolesOperacionesService, RolesValidationService],
    controllers: [RolesController],
})
export class RolesModule {}
