import { Module } from '@nestjs/common';
import { LoginController } from './controllers/login.controller';
import { LoginService } from './services/login.service';
import { EnvsModule } from '../../config/env/envs.module';
import { OperationsGuard } from './guards/operations.guard';
import { UserModule } from '../users/user.module';
import { JwtAppModule } from 'src/config/jtw/jwt-app.module';
import { SigninValidationService } from './services/signin-validation.service';

@Module({
    imports: [UserModule, EnvsModule, JwtAppModule],
    providers: [LoginService, OperationsGuard, SigninValidationService],
    controllers: [LoginController],
    exports: [LoginService],
})
export class AuthModule {}
