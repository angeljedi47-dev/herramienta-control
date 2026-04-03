import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { EnvsModule } from '../env/envs.module';
import { EnvsService } from '../env/services/envs.service';
import { JwtAppService } from './jwt.service';

@Module({
    imports: [
        EnvsModule,
        NestJwtModule.registerAsync({
            imports: [EnvsModule],
            useFactory: (envsService: EnvsService) => {
                const serverEnv = envsService.getGroup('SERVER');
                return {
                    global: true,
                    secret: serverEnv.JWT_SECRET,
                    signOptions: { expiresIn: '8h' },
                };
            },
            inject: [EnvsService],
        }),
    ],
    providers: [JwtAppService],
    exports: [JwtAppService],
})
export class JwtAppModule {}
