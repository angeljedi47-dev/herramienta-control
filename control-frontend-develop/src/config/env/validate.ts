import { z } from 'zod';
import { envSchema } from './schema';

const validateEnv = () => {
    try {
        return envSchema.parse(import.meta.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors
                .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
                .join('\n');

            console.error(
                'Error de validación en las variables de entorno:\n' + errors,
            );

            throw new Error(
                'Variables de entorno inválidas. Revisa la consola para más detalles.',
            );
        }
        throw error;
    }
};

export const env = validateEnv();
