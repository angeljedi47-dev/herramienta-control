import { NODE_ENVIROMENTS } from '../interfaces/envs.interface';
import { z } from 'zod';

export const envsSchema = z.object({
    SERVER: z.object({
        ENVIRONMENT: z.enum([
            NODE_ENVIROMENTS.DEVELOPMENT,
            NODE_ENVIROMENTS.PRODUCTION,
            NODE_ENVIROMENTS.STAGE,
        ]),
        PORT: z.string(),
        JWT_SECRET: z.string(),
        SERVICE_NAME: z.string(),
        HOST: z.string(),
    }),
    DB: z.object({
        DB_HOST: z.string(),
        DB_PORT: z.string().transform((val) => parseInt(val)),
        DB_USERNAME: z.string(),
        DB_PASSWORD: z.string(),
        DB_NAME: z.string(),
    }),
    EMAIL: z.object({
        HOST: z.string(),
        PORT: z.string().transform((val) => parseInt(val)),
        USER: z.string(),
        PASS: z.string(),
    }),
    PATHS: z.object({
        PATH_TEMP: z.string(),
    }),
});

export type EnvVars = z.infer<typeof envsSchema>;
