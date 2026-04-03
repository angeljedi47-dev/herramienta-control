import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosEntity } from './entities/proyectos.entity';
import { ProyectosController } from './controllers/proyectos.controller';
import { ProyectosService } from './services/proyectos.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProyectosEntity])],
    controllers: [ProyectosController],
    providers: [ProyectosService],
    exports: [ProyectosService],
})
export class ProyectosModule {}
