import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosProyectoEntity } from './entities/estados-proyecto.entity';
import { EstadosProyectoController } from './controllers/estados-proyecto.controller';
import { EstadosProyectoService } from './services/estados-proyecto.service';

@Module({
    imports: [TypeOrmModule.forFeature([EstadosProyectoEntity])],
    controllers: [EstadosProyectoController],
    providers: [EstadosProyectoService],
    exports: [EstadosProyectoService]
})
export class EstadosProyectoModule {}
