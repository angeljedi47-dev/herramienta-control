import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvsModule } from '../env/envs.module';
import { EnvsService } from '../env/services/envs.service';
import { NODE_ENVIROMENTS } from '../env/interfaces/envs.interface';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [EnvsModule],
            inject: [EnvsService],
            useFactory: (envService: EnvsService) => {
                const dbEnv = envService.getGroup('DB');
                const serverEnv = envService.getGroup('SERVER');
                return {
                    type: 'postgres',
                    host: dbEnv.DB_HOST,
                    port: dbEnv.DB_PORT,
                    username: dbEnv.DB_USERNAME,
                    password: dbEnv.DB_PASSWORD,
                    database: dbEnv.DB_NAME,
                    autoLoadEntities: true,
                    synchronize:
                        serverEnv.ENVIRONMENT === NODE_ENVIROMENTS.DEVELOPMENT,
                    logging:
                        serverEnv.ENVIRONMENT === NODE_ENVIROMENTS.DEVELOPMENT,
                };
            },
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Options are required');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
    ],
})
export class DatabaseModule {}
