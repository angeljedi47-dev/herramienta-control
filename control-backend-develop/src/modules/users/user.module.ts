import { Module } from '@nestjs/common';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { RolesModule } from '../roles/roles.module';
import { UsuariosSistemaEntity } from './entities/usuarios-sistema.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesUsuariosEntity } from './entities/roles-usuarios.entity';
import { UsuariosValidationService } from './services/usuarios-validation.service';
import { RolesUsuariosService } from './services/roles-usuarios.service';
import { DateTimeModule } from 'src/config/date-time/date-time.module';

@Module({
    imports: [
        RolesModule,
        TypeOrmModule.forFeature([UsuariosSistemaEntity, RolesUsuariosEntity]),
        DateTimeModule,
    ],
    providers: [
        UsuariosService,
        UsuariosValidationService,
        RolesUsuariosService,
    ],
    controllers: [UsuariosController],
    exports: [UsuariosService, UsuariosValidationService, RolesUsuariosService],
})
export class UserModule {}
