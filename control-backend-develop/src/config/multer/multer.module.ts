import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { EnvsModule } from '../env/envs.module';
import { EnvsService } from '../env/services/envs.service';
import { FileUploadExamplesController } from './examples/controllers/file-upload-examples.controller';
import { FileUploadExamplesService } from './examples/services/file-upload-examples.service';
import { FileManipulationService } from './services/file-manipulation.service';

@Module({})
export class MulterModuleApp {
    static register(): DynamicModule {
        return {
            global: true,
            module: MulterModuleApp,
            imports: [
                EnvsModule,
                MulterModule.registerAsync({
                    imports: [EnvsModule],
                    useFactory: async (
                        envs: EnvsService,
                    ): Promise<MulterModuleOptions> => ({
                        dest: join(
                            process.cwd(),
                            envs.getGroup('PATHS').PATH_TEMP,
                        ),
                        storage: diskStorage({
                            destination: join(
                                process.cwd(),
                                envs.getGroup('PATHS').PATH_TEMP,
                            ),
                            filename: (_, file, cb) => {
                                const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
                                cb(null, uniqueName);
                            },
                        }),
                    }),
                    inject: [EnvsService],
                }),
            ],
            controllers: [FileUploadExamplesController],
            providers: [FileUploadExamplesService, FileManipulationService],
            exports: [MulterModule],
        };
    }
}
