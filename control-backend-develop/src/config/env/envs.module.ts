import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvsService } from './services/envs.service';
import parseEnvs from './const/envs.const';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [parseEnvs],
        }),
    ],
    providers: [EnvsService],
    exports: [EnvsService],
})
export class EnvsModule {}
