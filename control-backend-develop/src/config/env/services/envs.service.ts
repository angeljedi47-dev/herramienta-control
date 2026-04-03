import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from '../schemas/envs.schema';

@Injectable()
export class EnvsService {
    constructor(private configService: ConfigService<EnvVars>) {}

    // Obtener cualquier grupo (server, database, etc.)
    getGroup<K extends keyof EnvVars>(group: K): EnvVars[K] {
        return this.configService.get(group, { infer: true });
    }

    // Obtener cualquier variable dentro de un grupo
    getVar<G extends keyof EnvVars, V extends keyof EnvVars[G]>(
        group: G,
        variable: V,
    ): EnvVars[G][V] {
        return this.getGroup(group)[variable];
    }
}
