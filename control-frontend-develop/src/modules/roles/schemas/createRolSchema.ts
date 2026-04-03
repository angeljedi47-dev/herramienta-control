import { z } from 'zod';

export const createRolSchema = z.object({
    idRol: z.number().optional(),
    nombreRol: z.string().min(3, { message: 'El nombre del rol es requerido' }),
    operaciones: z.array(z.number()).min(1, {
        message: 'Se debe seleccionar al menos una operación',
    }),
});

export type ICreateRolSchema = z.infer<typeof createRolSchema>;
