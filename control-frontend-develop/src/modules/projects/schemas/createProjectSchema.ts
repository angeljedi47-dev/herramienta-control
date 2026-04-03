import { z } from 'zod';

export const createProjectSchema = z.object({
    id_proyecto: z.number().optional(),
    nombre: z.string().min(3, { message: 'El nombre del proyecto es requerido' }),
    descripcion: z.string().optional(),
    tipo: z.enum(['Nuevo Sistema', 'Actualización', 'Mantenimiento'], { required_error: 'El tipo es requerido' }),
    estado: z.enum(['Planeación', 'Desarrollo', 'Pruebas', 'Liberado'], { required_error: 'El estado es requerido' }),
    fecha_inicio: z.date().optional().nullable(),
    fecha_fin_estimada: z.date().optional().nullable(),
});

export type ICreateProjectSchema = z.infer<typeof createProjectSchema>;
