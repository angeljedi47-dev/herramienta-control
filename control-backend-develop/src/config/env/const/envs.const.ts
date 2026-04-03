import { envsSchema, EnvVars } from '../schemas/envs.schema';
import { ZodError } from 'zod';

function formatZodErrors(error: ZodError<any>): string {
    return error.issues
        .map((err) => `• ${err.path.join('.')} → ${err.message}`)
        .join('\n');
}

const parseEnvs = (): EnvVars => {
    // Obtén los grupos y variables del schema
    const groups = Object.keys(envsSchema.shape) as (keyof EnvVars)[];
    const raw: any = {};

    for (const group of groups) {
        raw[group] = {};
        const groupShape = (envsSchema.shape as any)[group].shape;
        for (const variable of Object.keys(groupShape)) {
            // Convención: NOMBREGRUPO_NOMBREVARIABLE o NOMBREVARIABLE
            const envVarName = `${group.toString().toUpperCase()}_${variable}`;
            raw[group][variable] =
                process.env[envVarName] ?? process.env[variable];
        }
    }

    const result = envsSchema.safeParse(raw);
    if (!result.success) {
        throw new Error(
            '❌ Invalid environment variables:\n' +
                formatZodErrors(result.error),
        );
    }
    return result.data;
};

export default parseEnvs;
