import { z } from 'zod';

export const estadoProyectoSchema = z.object({
    id_estado_proyecto: z.number().optional(),
    nombre: z.string().min(3, { message: 'El nombre es obligatorio' }),
    color_hex: z.string().optional(),
    es_final: z.boolean().optional(),
});

export type IEstadoProyectoSchema = z.infer<typeof estadoProyectoSchema>;
