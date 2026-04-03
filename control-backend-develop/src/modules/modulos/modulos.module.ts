import { Module } from '@nestjs/common';
import { ModulosEntity } from './entities/modulos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulosService } from './services/modulos.service';
import { ModulosController } from './controllers/modulos.controller';
import { OperacionesModulosEntity } from './entities/operaciones-modulos.entity';
import { OperacionesModulosService } from './services/operaciones-modulos.service';
import { OperacionesModulosValidationService } from './services/operaciones-modulos-validation.service';
@Module({
    imports: [
        TypeOrmModule.forFeature([ModulosEntity, OperacionesModulosEntity]),
    ],
    providers: [
        ModulosService,
        OperacionesModulosService,
        OperacionesModulosValidationService,
    ],
    exports: [
        ModulosService,
        OperacionesModulosService,
        OperacionesModulosValidationService,
    ],
    controllers: [ModulosController],
})
export class ModulosModule {}
