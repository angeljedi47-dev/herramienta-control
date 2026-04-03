import { z } from 'zod';

export const tipoInformeSchema = z.object({
    id_tipo_informe: z.number().optional(),
    nombre: z.string().min(3, { message: 'El nombre es obligatorio' }),
    slug: z.string().min(3, { message: 'El slug es obligatorio' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas y guiones'),
});

export type ITipoInformeSchema = z.infer<typeof tipoInformeSchema>;
