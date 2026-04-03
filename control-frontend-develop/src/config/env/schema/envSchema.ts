import { z } from 'zod';

export const envSchema = z.object({
    VITE_API_URL: z.string().url('La URL de la API es inválida'),
    VITE_NODE_ENV: z.enum(['development', 'production', 'staging'], {
        errorMap: () => ({
            message: 'El ambiente debe ser development, production o staging',
        }),
    }),
    VITE_API_ENDPOINT: z
        .string()
        .min(1, 'El endpoint de la API no puede estar vacío'),
});
