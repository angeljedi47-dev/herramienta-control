import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposInformeEntity } from './entities/tipos-informe.entity';
import { TiposInformeController } from './controllers/tipos-informe.controller';
import { TiposInformeService } from './services/tipos-informe.service';

@Module({
    imports: [TypeOrmModule.forFeature([TiposInformeEntity])],
    controllers: [TiposInformeController],
    providers: [TiposInformeService],
    exports: [TiposInformeService]
})
export class TiposInformeModule {}
