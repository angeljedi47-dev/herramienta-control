import { z } from 'zod';

export const createProjectSchema = z.object({
    id_proyecto: z.number().optional(),
    nombre: z.string().min(3, { message: 'El nombre del proyecto es requerido' }),
    descripcion: z.string().optional(),
    tipo: z.enum(['Nuevo Sistema', 'Actualización', 'Mantenimiento'], { required_error: 'El tipo es requerido' }),
    id_estado_proyecto: z.coerce.number({ required_error: 'El estado es requerido' }),
    fecha_inicio: z.date().optional().nullable(),
    fecha_fin_estimada: z.date().optional().nullable(),
    porcentaje: z.coerce.number().min(0).max(100).optional(),
    id_tipo_informe: z.coerce.number().optional(),
});

export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;
