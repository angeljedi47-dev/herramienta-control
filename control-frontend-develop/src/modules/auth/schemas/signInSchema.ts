import { z } from 'zod';

export const signInSchema = z.object({
    nombreUsuario: z
        .string()
        .min(3, { message: 'El nombre de usuario es requerido' }),
    password: z.string().min(3, { message: 'La contraseña es requerida' }),
});

export type ISignInSchema = z.infer<typeof signInSchema>;
