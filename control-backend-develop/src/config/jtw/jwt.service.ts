import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAppService {
    constructor(private readonly jwtService: JwtService) {}

    async signAsync(payload: any) {
        return this.jwtService.signAsync(payload);
    }

    async verifyAsync<T extends object>(token: string): Promise<T> {
        return this.jwtService.verifyAsync<T>(token);
    }
}
